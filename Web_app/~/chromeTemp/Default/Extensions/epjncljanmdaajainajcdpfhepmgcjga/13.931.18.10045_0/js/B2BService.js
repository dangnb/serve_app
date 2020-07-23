var B2BService = (function () {
    function B2BService(extensionConfig) {
        var _this = this;
        this.PHONE_HOME_INTERVAL_MS = 8 * 60 * 60 * 1000;
        this.TBAPI_URL = "https://tbapi.search.ask.com/tb/analytics";
        this.UL_DEFAULT_URL = "https://anx.apnanalytics.com/tr.gif";
        this.UL_PHONE_HOME_URL = "https://phn.apnanalytics.com/tr.gif";
        this.events = {
            PHONE_HOME: "PhoneHome",
            SUCCESSFUL_INSTALL: "SuccessfulInstall",
            SUCCESSFUL_UNINSTALL: "SuccessfulUninstall",
            Info: "Info",
        };
        this.alarmName = 'B2BServiceAlarm';
        this.defaultState = {
            isLegacyTimeStampHandled: false,
            isSuccessfulInstallSent: false,
            isUninstallUrlSet: false,
            nextPhoneHomeCallInMs: 0
        };
        this.handleLegacyLastTimeStamp = function (state) {
            if (!state.isLegacyTimeStampHandled) {
                return _this.getLegacyLastTimeStampValue().then(function (lastPhoneHomeTimeStamp) {
                    return _this.removeLegacyLastTimeStampValue().then(function () {
                        var newStateLegacyUpdateFlow = {
                            isSuccessfulInstallSent: true,
                            isUninstallUrlSet: true,
                            nextPhoneHomeCallInMs: lastPhoneHomeTimeStamp + _this.PHONE_HOME_INTERVAL_MS,
                            isLegacyTimeStampHandled: true,
                        };
                        var newStateDefaultFlow = Object.assign({}, state, {
                            isLegacyTimeStampHandled: true
                        });
                        return Promise.resolve(lastPhoneHomeTimeStamp ? newStateLegacyUpdateFlow : newStateDefaultFlow);
                    });
                });
            }
            return Promise.resolve(state);
        };
        this.sendSuccessfulInstall = function (state) {
            if (!state.isSuccessfulInstallSent) {
                return _this.sendEvents(_this.events.SUCCESSFUL_INSTALL).then(function () {
                    var newState = Object.assign({}, state, {
                        isSuccessfulInstallSent: true
                    });
                    return Promise.resolve(newState);
                });
            }
            return Promise.resolve(state);
        };
        this.addVicinioAnxePostfix = function (reportingParams, eventName) {
            var POSTFIX = "Vicinio";
            if (eventName === _this.events.SUCCESSFUL_INSTALL ||
                eventName === _this.events.PHONE_HOME) {
                return Object.assign({}, reportingParams, { anxe: reportingParams.anxe + POSTFIX });
            }
            return reportingParams;
        };
        this.getCommonReportingParams = function (config) {
            return {
                anxe: undefined,
                anxa: "APNPNP",
                trgb: Browser.isChrome ? "CR" : "FF",
                anxp: config.state.toolbarData.partnerId,
                o: config.state.toolbarData.partnerId.split("^")[1],
                anxtv: config.buildVars.version,
                extVer: config.buildVars.version,
                guid: config.state.toolbarData.toolbarId,
                anxt: config.state.toolbarData.toolbarId,
                psv: config.state.toolbarData.partnerSubId || "",
                si: config.state.toolbarData.partnerSubId || "",
                extId: chrome.runtime.id,
                doi: config.state.replaceableParams.installDateYYYY_MM_DD,
                pid: _this.getB2BPid(config)
            };
        };
        this.getReportingParams = function (eventName) {
            return Object.assign({}, _this.getCommonReportingParams(_this.extensionConfig), {
                anxe: eventName
            });
        };
        this.getB2BPid = function (config) {
            var oldProductsPIDMap = {
                "CTR": "MOV-VCN",
                "CTS": "SPH-VCN",
                "CTT": "TVH-VCN",
                "CTV": "MUS-VCN",
                "CTP": "SCA-VCN",
                "CTU": "GMG-VCN",
                "CTQ": "SPA-VCN",
                "CTW": "YDT-VCN",
                "CTY": "SCD-VCN",
                "CTX": "SWN-VCN",
                "CQG": "FSC-VCN",
                "CQH": "WPC-VCN",
                "CWC": "MST-VCN",
                "CWD": "STF-VCN",
                "CWB": "MVT-VCN",
                "CFZ": "PLG-DS-VCN",
                "CRH": "WDS1-VCN",
                "CWU": "LK-DS-VCN",
                "CRI": "WDS2-VCN",
                "CRJ": "WDS3-VCN",
                "CWT": "FO-DS-VCN",
                "BLUCPA": "BLC-DS-VCN",
                "DAT": "DAT-VCN",
            };
            return oldProductsPIDMap[config.buildVars.coId] || config.buildVars.coId;
        };
        this.sendEvents = function (eventName) {
            return Promise.all([_this.sendTBAPIEvent(eventName), _this.sendULEvent(eventName)]).then(function () {
                return Promise.resolve();
            });
        };
        this.sendTBAPIEvent = function (eventName) {
            return new Promise(function (resolve) {
                var params = _this.getReportingParams(eventName);
                var url = UrlUtils.appendParamsFromObject(_this.TBAPI_URL, params);
                Logger.log("Event: ", url);
                new Image().src = url;
                resolve();
            });
        };
        this.sendULEvent = function (eventName) {
            return new Promise(function (resolve) {
                var params = _this.getReportingParams(eventName);
                var unifiedLoggingHostName = eventName === _this.events.PHONE_HOME ? _this.UL_PHONE_HOME_URL : _this.UL_DEFAULT_URL;
                var url = UrlUtils.appendParamsFromObject(unifiedLoggingHostName, _this.addVicinioAnxePostfix(params, eventName));
                Logger.log("Event: ", url);
                new Image().src = url;
                resolve();
            });
        };
        this.setUninstallUrlToRemotePage = function (state) {
            if (!state.isUninstallUrlSet) {
                var params = _this.getReportingParams(_this.events.SUCCESSFUL_UNINSTALL);
                var tbapiUninstallUrl = UrlUtils.appendParamsFromObject(_this.TBAPI_URL, params);
                var uninstallUrlOrigin = new URL(_this.extensionConfig.buildVars.uninstallSurveyUrl.toString()).origin;
                var uninstallUrlPath = new URL(_this.extensionConfig.buildVars.uninstallSurveyUrl.toString()).pathname;
                var pid = _this.getB2BPid(_this.extensionConfig);
                var uninstallUrl = "" + uninstallUrlOrigin + uninstallUrlPath + "?mode=write&pid=" + pid + "&uninstallURL_" + pid + "=" + encodeURIComponent(tbapiUninstallUrl);
                var iframe = document.createElement("iframe");
                iframe.src = uninstallUrl;
                document.body.appendChild(iframe);
                var newState = Object.assign({}, state, { isUninstallUrlSet: true });
                return Promise.resolve(newState);
            }
            return Promise.resolve(state);
        };
        this.schedulePhoneHome = function (state) {
            chrome.alarms.onAlarm.addListener(function (alarm) {
                if (alarm.name === _this.alarmName) {
                    _this.sendPhoneHome().then(function () {
                        var newState = {
                            nextPhoneHomeCallInMs: new Date().getTime() + _this.PHONE_HOME_INTERVAL_MS
                        };
                        B2BServiceStateStorage.update(newState).then(function () {
                            chrome.alarms.create(_this.alarmName, {
                                when: newState.nextPhoneHomeCallInMs
                            });
                        });
                    });
                }
            });
            return new Promise(function (resolve) {
                chrome.alarms.get(_this.alarmName, function (alarm) {
                    if (alarm) {
                        Logger.log("b2bs: schedulePhoneHome - phoneHome would fire in " + alarm.scheduledTime);
                        return resolve(state);
                    }
                    var now = new Date().getTime();
                    if (state.nextPhoneHomeCallInMs - now < 60000) {
                        return _this.sendPhoneHome().then(function () {
                            var newState = Object.assign({}, state, {
                                nextPhoneHomeCallInMs: new Date().getTime() + _this.PHONE_HOME_INTERVAL_MS
                            });
                            chrome.alarms.create(_this.alarmName, {
                                when: newState.nextPhoneHomeCallInMs
                            });
                            return resolve(newState);
                        });
                    }
                    else {
                        chrome.alarms.create(_this.alarmName, {
                            when: state.nextPhoneHomeCallInMs
                        });
                        return resolve(state);
                    }
                });
            });
        };
        this.sendPhoneHome = function () {
            return _this.sendEvents(_this.events.PHONE_HOME);
        };
        this.getLegacyLastTimeStampValue = function () {
            return new Promise(function (resolve) {
                chrome.storage.local.get("hbts", function (o) {
                    resolve(o.hbts);
                });
            });
        };
        this.removeLegacyLastTimeStampValue = function () {
            return new Promise(function (resolve) {
                chrome.storage.local.remove("hbts", function () {
                    resolve();
                });
            });
        };
        this.extensionConfig = extensionConfig;
        B2BServiceStateStorage.get().then(function (state) {
            if (!state) {
                state = _this.defaultState;
                ask.apps.ul.fireInfoEvent(_this.extensionConfig.buildVars.unifiedLoggingUrl, {
                    message: 'on-toolbar-initialized',
                    topic: 'B2B Tracking',
                }, _this.extensionConfig, "B2BService").catch(Logger.warn);
                if (!_this.extensionConfig.state.toolbarData.partnerSubId) {
                    ask.apps.ul.fireInfoEvent(_this.extensionConfig.buildVars.unifiedLoggingUrl, {
                        message: 'missing-sub-id',
                        topic: 'B2B Tracking',
                    }, _this.extensionConfig, "B2BService").catch(Logger.warn);
                }
            }
            _this.handleLegacyLastTimeStamp(state)
                .then(_this.sendSuccessfulInstall)
                .then(_this.setUninstallUrlToRemotePage)
                .then(_this.schedulePhoneHome)
                .then(B2BServiceStateStorage.set);
        });
    }
    ;
    return B2BService;
}());
var B2BServiceStateStorage = (function () {
    function B2BServiceStateStorage() {
    }
    B2BServiceStateStorage.stateStorage = new ChromeStorage(chrome.storage.local, "B2BService");
    B2BServiceStateStorage.set = function (state) {
        return B2BServiceStateStorage.stateStorage.set(state);
    };
    B2BServiceStateStorage.get = function () {
        return B2BServiceStateStorage.stateStorage.get();
    };
    B2BServiceStateStorage.update = function (newState) {
        return B2BServiceStateStorage.stateStorage.update(newState);
    };
    return B2BServiceStateStorage;
}());
var Browser = (function () {
    function Browser() {
    }
    Browser.isChrome = (navigator.userAgent.indexOf('Chrome') >= 0);
    return Browser;
}());
