"use strict";
var oneDayInMs = 1000 * 60 * 60 * 24;
var timeToShowNotificationInMs = 7 * oneDayInMs;
var SurveyService = (function () {
    function SurveyService(config, stateExtensionStateStorage) {
        var _this = this;
        this.scheduleAlarm = function () {
            var getHumanReadableDateFromMs = function (milliseconds) {
                var date = new Date(milliseconds);
                return date.getFullYear() + ":" + (date.getMonth() + 1) + ":" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
            };
            chrome.alarms.get(SurveyService.alarmName, function (alarm) {
                if (alarm) {
                    Logger.log("surveyService: " + SurveyService.alarmName + " was already created and it'll fire " + getHumanReadableDateFromMs(alarm.scheduledTime));
                    return;
                }
                var when = Date.now() + timeToShowNotificationInMs;
                Logger.log("surveyService: alarm is created and it'll fire " + getHumanReadableDateFromMs(when));
                chrome.alarms.create(SurveyService.alarmName, { when: when });
            });
        };
        this.onSurveyAlarm = function (alarm) {
            if (alarm.name === SurveyService.alarmName) {
                if (_this.extensionConfig.state.showSurveyNotification) {
                    var notification = _this.getSurveyNotification();
                    _this.showNotification(notification).then(function () {
                        _this.extensionConfig.state.showSurveyNotification = false;
                        _this.extensionStateExtensionStateStorage.update(_this.extensionConfig.state);
                    });
                }
            }
        };
        this.showNotification = function (notification) {
            var onClick = function (notificationId) {
                if (notificationId.startsWith(notification.id)) {
                    chrome.tabs.create({ url: notification.linkUrl }, function () {
                        _this.fireUL({
                            message: "on-click",
                            topic: "survey-notification-show",
                            data1: notificationId,
                            data2: notification.linkUrl
                        });
                    });
                }
            };
            chrome.notifications.onClicked.addListener(onClick);
            return new Promise(function (resolve) {
                chrome.notifications.create(notification.id + Date.now(), notification.notificationOptions, function (notificationId) {
                    _this.fireUL({
                        message: "on-after",
                        topic: "survey-notification-show",
                        data1: notification.linkUrl,
                        data2: notificationId
                    });
                    resolve(notificationId);
                });
            });
        };
        this.getSurveyNotification = function () {
            return {
                id: "survey-notification-",
                linkUrl: TextTemplate.parse(_this.extensionConfig.buildVars.surveyURL, _this.extensionConfig.state.replaceableParams),
                notificationOptions: {
                    type: "basic",
                    iconUrl: chrome.extension.getURL("/icons/icon48.png"),
                    title: "Thank you for using our extension!",
                    message: _this.extensionConfig.buildVars.toolbarDisplayName + " survey.",
                    contextMessage: "Click here to tell us how we're doing."
                }
            };
        };
        this.fireUL = function (infoSpecificData) {
            Logger[infoSpecificData.message === "on-error" ? "error" : "log"]("ns:Info event, message: " + infoSpecificData.message + ", topic: " + infoSpecificData.topic + ", data1: " + infoSpecificData.data1 + ", data2: " + infoSpecificData.data2);
            if (infoSpecificData.message === "on-error") {
                ask.apps.ul.fireErrorEvent(_this.extensionConfig.buildVars.unifiedLoggingUrl, infoSpecificData, _this.extensionConfig, "SurveyService").catch(Logger.warn);
            }
            else {
                ask.apps.ul.fireInfoEvent(_this.extensionConfig.buildVars.unifiedLoggingUrl, infoSpecificData, _this.extensionConfig, "SurveyService").catch(Logger.warn);
            }
        };
        this.extensionConfig = config;
        this.extensionStateExtensionStateStorage = stateExtensionStateStorage;
        if (!chrome.alarms.onAlarm.hasListener(this.onSurveyAlarm)) {
            chrome.alarms.onAlarm.addListener(this.onSurveyAlarm);
        }
        this.scheduleAlarm();
    }
    ;
    SurveyService.alarmName = "surveyAlarm";
    SurveyService.checkServicePrerequisites = function (config) {
        if (!config.buildVars.surveyURL) {
            Logger.log("surveyService: survey URL is not set");
            return Promise.resolve(false);
        }
        if (!config.state.showSurveyNotification) {
            Logger.log("surveyService: survey notification has been already shown or this is not a new install");
            return Promise.resolve(false);
        }
        return new Promise(function (resolve) {
            chrome.permissions.contains({ permissions: ["notifications"] }, resolve);
        });
    };
    return SurveyService;
}());
