"use strict";
var NotificationService = (function () {
    function NotificationService(onNotificationShow) {
        var _this = this;
        if (onNotificationShow === void 0) { onNotificationShow = NotificationService.onNotificationShowDefault; }
        this.exec = function (extensionConfig) {
            Logger.log("ns:exec - initializing notification service");
            _this.extensionConfig = extensionConfig;
            _this.notificationConfigUrl = NotificationService.getNotificationConfigUrl(extensionConfig);
            new RemoteConfigLoader(_this.extensionConfig, "notificationServiceConfig", _this.onRemoteConfigUpdate)
                .initConfigLoader(_this.notificationConfigUrl)
                .then(_this.updateStateWithNewConfig)
                .then(_this.handleEnabledFlag)
                .then(_this.handleNotificationsPermission)
                .then(_this.getNextNotification)
                .then(_this.handleDormantNotification)
                .then(_this.showNotification)
                .then(_this.updateStateWithProceededNotificationIds)
                .catch(function (err) {
                var logType = err.name === "warning" ? "warn" : "error";
                Logger[logType]("ns:exec - notification service error: " + (err.message || err));
                if (err.infoSpecificData) {
                    _this.fireUL(err.infoSpecificData);
                }
                else {
                    _this.fireUL({
                        message: "on-error",
                        topic: "notification-service-setup",
                        data1: err && (err.message || err.toString())
                    });
                }
            })
                .catch(function (err) {
                Logger.error("os:exec error firing UL event: " + (err && (err.message || err)));
            });
        };
        this.fireUL = function (infoSpecificData) {
            Logger[infoSpecificData.message === "on-error" ? "error" : "log"]("ns:Info event, message: " + infoSpecificData.message + ", topic: " + infoSpecificData.topic + ", data1: " + infoSpecificData.data1 + ", data2: " + infoSpecificData.data2);
            if (infoSpecificData.message === "on-error") {
                ask.apps.ul.fireErrorEvent(_this.extensionConfig.buildVars.unifiedLoggingUrl, infoSpecificData, _this.extensionConfig, "NotificationService").catch(Logger.warn);
                return;
            }
            if (_this.state && _this.state.verbose) {
                ask.apps.ul.fireInfoEvent(_this.extensionConfig.buildVars.unifiedLoggingUrl, infoSpecificData, _this.extensionConfig, "NotificationService").catch(Logger.warn);
                return;
            }
        };
        this.createWarning = function (topic, data1, data2) {
            var err = new Error(data1);
            err.name = "warning";
            _this.addUlDataInError(err, {
                message: "log",
                topic: topic,
                data1: data1,
                data2: data2
            });
            return err;
        };
        this.addUlDataInError = function (err, infoSpecificData) {
            var ulError = err;
            ulError.infoSpecificData = infoSpecificData;
            return ulError;
        };
        this.checkNotificationPermission = function () {
            return new Promise(function (resolve) {
                _this.fireUL({
                    message: "on-before",
                    topic: "notification-permission-check"
                });
                chrome.permissions.contains({
                    permissions: ["notifications"],
                }, function (notificationPermissionAvailable) {
                    _this.fireUL({
                        message: "on-after",
                        topic: "notification-permission-check",
                        data1: "isAvailable",
                        data2: notificationPermissionAvailable.toString(),
                    });
                    resolve(notificationPermissionAvailable);
                });
            });
        };
        this.handleNotificationsPermission = function () {
            return _this.checkNotificationPermission()
                .then(function (notificationPermissionAvailable) {
                if (notificationPermissionAvailable) {
                    return Promise.resolve();
                }
                return Promise.reject(_this.createWarning("notification-permission-check", "Notifications permission is not available."));
            });
        };
        this.updateStateWithNewConfig = function (config) {
            var dormantServiceLastUpdateTimeInMs = config.dormantServiceLastUpdateTimeInMs ? config.dormantServiceLastUpdateTimeInMs : 0;
            return _this.stateStorage.get().then(function (state) {
                _this.state = state ? state : NotificationService.initialNotificationServiceState;
                _this.state.enabled = config.enabled;
                _this.state.verbose = config.verbose;
                _this.state.refreshIntervalInMS = config.refreshIntervalInMS;
                _this.state.notificationIntervalInMS = config.notificationIntervalInMS;
                _this.state.dormantServiceURL = config.dormantServiceURL;
                _this.state.notifications = config.notifications;
                _this.state.lastFetched = new Date().getTime();
                _this.state.shouldUpdateDormantStatus = dormantServiceLastUpdateTimeInMs > _this.state.dormantServiceLastUpdateTimeInMs;
                _this.state.dormantServiceLastUpdateTimeInMs = dormantServiceLastUpdateTimeInMs;
                return _this.stateStorage.set(_this.state).then(function () {
                    return Promise.resolve(_this.state);
                });
            });
        };
        this.getNextNotification = function () {
            var proceededNotificationIds = _this.state.proceededNotificationIds || [];
            var nextNotification = _this.state.notifications.find(function (notification) {
                return proceededNotificationIds.indexOf(notification.id) === -1;
            });
            if (!nextNotification) {
                return Promise.reject(_this.createWarning("notification-show", "No notifications to show."));
            }
            var canShowNotification = new Date().getTime() - _this.state.lastNotificationTime > _this.state.notificationIntervalInMS;
            if (!canShowNotification) {
                return Promise.reject(_this.createWarning("notification-show", "Notification show interval has not been passed."));
            }
            return Promise.resolve(nextNotification);
        };
        this.handleDormantNotification = function (notification) {
            if (!notification.dormant) {
                return Promise.resolve(notification);
            }
            if (_this.state.shouldUpdateDormantStatus) {
                return _this.checkDormantService()
                    .then(function (isDormant) {
                    return isDormant ? Promise.resolve(notification) : _this.skipDormantNotification(notification);
                });
            }
            return _this.state.isDormantUser ? Promise.resolve(notification) : _this.skipDormantNotification(notification);
        };
        this.skipDormantNotification = function (notification) {
            return _this.updateStateWithProceededNotificationIds(notification.id)
                .then(function () {
                return Promise.reject(_this.createWarning("dormant-service", "User is not dormant. Skipping notification", notification.id));
            });
        };
        this.checkDormantService = function () {
            if (!_this.state.dormantServiceURL) {
                return Promise.reject(_this.createWarning("dormant-service", "DormantAPIURL is empty."));
            }
            var finalDormantServiceURL = TextTemplate.parse(_this.state.dormantServiceURL, _this.extensionConfig.state.replaceableParams);
            _this.fireUL({
                message: "on-before",
                topic: "dormant-service",
                data1: _this.state.dormantServiceURL,
                data2: finalDormantServiceURL,
            });
            var makeAjaxRequest = AJAX.get.bind(null, { url: finalDormantServiceURL });
            return makeAjaxRequest()
                .then(function (xhr) {
                Logger.log("ns:DormantAPIURL -- url: " + _this.state.dormantServiceURL + " response: " + JSON.stringify(xhr.response));
                if (xhr.status !== 200) {
                    return Promise.reject(_this.createWarning("dormant-service", "Not success response " + xhr.status));
                }
                return xhr.response;
            })
                .then(function (response) {
                if (typeof response === "string") {
                    response = JSON.parse(response);
                }
                _this.fireUL({
                    message: "on-after",
                    topic: "dormant-service",
                    data1: _this.state.dormantServiceURL
                });
                _this.state.isDormantUser = response.isDormant;
                return _this.stateStorage.set(_this.state).then(function () {
                    return Promise.resolve(_this.state.isDormantUser);
                });
            })
                .catch(function (err) {
                Logger.error("ns:checkDormantService err " + err);
                _this.state.dormantServiceLastUpdateTimeInMs = -1;
                return _this.stateStorage.set(_this.state).then(function () {
                    return Promise.reject(_this.createWarning("dormant-service", _this.state.dormantServiceURL, err.message));
                });
            });
        };
        this.updateStateWithProceededNotificationIds = function (notificationId) {
            var updatedListOfNotificationIds = _this.state.proceededNotificationIds ? _this.state.proceededNotificationIds.slice() : [];
            updatedListOfNotificationIds.push(notificationId);
            _this.state.lastNotificationTime = new Date().getTime();
            _this.state.proceededNotificationIds = updatedListOfNotificationIds;
            return _this.stateStorage.set(_this.state).then(function () {
                return Promise.resolve();
            });
        };
        this.showNotification = function (notification) {
            var onClick = function (notificationId) {
                if (notificationId.startsWith(notification.id)) {
                    chrome.tabs.create({ url: notification.linkUrl }, function (tab) {
                        _this.fireUL({
                            message: "on-click",
                            topic: "notification-show",
                            data1: notification.id,
                            data2: notification.linkUrl
                        });
                    });
                }
            };
            var onClose = function (notificationId) {
                if (notificationId.startsWith(notification.id)) {
                    _this.fireUL({
                        message: "on-close",
                        topic: "notification-show",
                        data1: notification.id,
                        data2: notification.linkUrl
                    });
                }
            };
            chrome.notifications.onClicked.addListener(onClick);
            chrome.notifications.onButtonClicked.addListener(onClick);
            chrome.notifications.onClosed.addListener(onClose);
            return new Promise(function (resolve) {
                _this.fireUL({
                    message: "on-before",
                    topic: "notification-show",
                    data1: notification.id,
                    data2: notification.linkUrl
                });
                chrome.notifications.create(notification.id + new Date().getTime(), notification.notificationOptions, function (notificationId) {
                    _this.fireUL({
                        message: "on-after",
                        topic: "notification-show",
                        data1: notification.id,
                        data2: notification.linkUrl
                    });
                    return _this.onNotificationShow(_this.extensionConfig, notification.id).then(function () {
                        resolve(notification.id);
                    });
                });
            });
        };
        this.handleEnabledFlag = function (state) {
            if (state.enabled) {
                return Promise.resolve();
            }
            return Promise.reject(_this.createWarning("notification-setting", "Notification service is disabled."));
        };
        this.onRemoteConfigUpdate = function (config) {
            _this.updateStateWithNewConfig(config).then(function (state) {
                Logger.log("ns - NotificationServiceState has been updated. " + JSON.stringify(state));
            });
        };
        this.onNotificationShow = onNotificationShow;
        this.stateStorage = new ChromeStorage(chrome.storage.local, "notificationServiceState");
    }
    ;
    NotificationService.getNotificationConfigUrl = function (extensionConfig) {
        var notificationConfigBaseUrl = "https://download" + extensionConfig.buildVars.downloadDomain + "/images/download/static/native/notifications/{{cobrandID}}/{{trackID}}/notifications-config.json";
        return TextTemplate.parse(notificationConfigBaseUrl, extensionConfig.state.replaceableParams);
    };
    NotificationService.initialNotificationServiceState = {
        enabled: false,
        verbose: true,
        refreshIntervalInMS: DateTimeUtils.millisecondsMultiplier.d,
        lastFetched: new Date().getTime() - DateTimeUtils.millisecondsMultiplier.d,
        notificationIntervalInMS: DateTimeUtils.millisecondsMultiplier.d,
        dormantServiceURL: "",
        lastNotificationTime: new Date().getTime(),
        notifications: [],
        proceededNotificationIds: [],
        dormantServiceLastUpdateTimeInMs: -1,
        shouldUpdateDormantStatus: true,
        isDormantUser: false,
    };
    NotificationService.onNotificationShowDefault = function (config, notificationId) {
        var uninstallUrl = config.state.toolbarData.uninstallSurveyUrl || config.buildVars.uninstallSurveyUrl;
        var surveyUrl = UrlUtils.parseQueryString(UrlUtils.parseUrl(uninstallUrl).getQueryString()).getParam("surveyUrl");
        if (!surveyUrl) {
            return Promise.resolve();
        }
        surveyUrl = TextTemplate.parse(surveyUrl, config.state.replaceableParams);
        return ask.apps.ul.loadContent({ url: UrlUtils.appendParamToUrl(surveyUrl, "notificationShown", notificationId) })
            .then(function () {
            return Promise.resolve();
        })
            .catch(function (err) {
            return ask.apps.ul.fireErrorEvent(config.buildVars.unifiedLoggingUrl, {
                message: "uninstall-page-sync-fail",
                topic: "notification-show",
                data1: surveyUrl,
                data2: err.message,
            }, config, "NotificationService").then(function () {
                return Promise.resolve();
            });
        });
    };
    return NotificationService;
}());
