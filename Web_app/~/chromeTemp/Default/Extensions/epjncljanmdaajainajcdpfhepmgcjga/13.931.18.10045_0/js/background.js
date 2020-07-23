"use strict";
var ask;
(function (ask) {
    var apps;
    (function (apps) {
        var background;
        (function (background) {
            var dataSourceExtension = "extension";
            var showSecondaryOfferForReEnabledOnlyAfterMonths = 6;
            var config;
            var extensionStateStorage = new ChromeStorage(chrome.storage.local, "state");
            var onRestartActionsExtensionStateStorage = new ChromeStorage(chrome.storage.local, "onRestart");
            var nativeMessagingHostName;
            var contentScriptConnectionManager = new ContentScriptConnectionManager(extensionStateStorage);
            var watchExtensionsHandler = new WatchExtensionsHandler();
            var pTagService;
            chrome.runtime.onConnect.addListener(contentScriptConnectionManager.connectionOperations.addConnectionToContentScript);
            function onPermissionChangeHandler(handlerType) {
                return function (permissions) {
                    Logger.log("permission changed - " + handlerType);
                    Logger.log(permissions);
                    if (config) {
                        ask.apps.ul.fireInfoEvent(config.buildVars.unifiedLoggingUrl, {
                            message: "permission changed",
                            topic: handlerType,
                            data1: permissions.origins.toString()
                        }, config, null).catch(Logger.warn);
                    }
                };
            }
            chrome.permissions.onAdded.addListener(onPermissionChangeHandler("added"));
            chrome.permissions.onRemoved.addListener(onPermissionChangeHandler("removed"));
            function init(configURL) {
                var _this = this;
                loadConfig(configURL)
                    .then(setUpContentScriptInjection)
                    .then(install)
                    .then(LoggingLevelUtils.loadRemoteConfig)
                    .then(handleInvalidNewTabUrl)
                    .then(run)
                    .catch(function (err) {
                    Logger.warn("Background: Unable to install", err);
                    if (config) {
                        ask.apps.ul.fireErrorEvent(_this.config.buildVars.unifiedLoggingUrl, {
                            message: "on-error",
                            topic: "extension-run",
                            data1: err.message
                        }, _this.config, null).catch(Logger.warn);
                    }
                });
            }
            background.init = init;
            function handleReEnable(config) {
                getCwsWindow().then(function (popUpWindowToClose) {
                    if (!popUpWindowToClose || !popUpWindowToClose.tabs.length) {
                        return;
                    }
                    closeCwsWindow(popUpWindowToClose);
                    var lastOfferShowDate = new Date(config.state.lastOfferShowDate);
                    var todayDate = new Date();
                    if (Util.getDateDiffInMonths(todayDate, lastOfferShowDate) > showSecondaryOfferForReEnabledOnlyAfterMonths) {
                        handleSecondaryOffer(config);
                    }
                    else {
                        PageUtils.openNewTabPage().catch(Logger.warn);
                    }
                });
            }
            function install(config) {
                return extensionStateStorage.get().then(function (state) {
                    if (state) {
                        config.state = state;
                        setInstallDateIfMissing(config);
                        handleReEnable(config);
                        return Promise.resolve(config);
                    }
                    return doInstall(config);
                }).catch(function (err) {
                    Logger.log("Background: install - Unable to get EXTENSION STATE::::", err);
                    return doInstall(config);
                });
            }
            function doInstall(config) {
                config.state = {
                    toolbarData: null,
                    isUpgradeFromLegacyChrome: false,
                    showSurveyNotification: false,
                    babType: config.buildVars.babType,
                    loggingLevel: config.buildVars.defaultLoggingLevel
                };
                var defaultPartnerId = config.buildVars.isB2B
                    ? Util.getB2BValidPartnerId(config.buildVars.defaultPartnerId)
                    : config.buildVars.defaultPartnerId;
                var defaultToolbarData = {
                    newTabURL: config.buildVars.newTabURL,
                    pixelUrl: null,
                    toolbarId: Util.generateToolbarId(),
                    partnerId: defaultPartnerId,
                    dataSource: dataSourceExtension
                };
                var toolbarDataFromLocalStorage = JSON.parse(localStorage.getItem("dlpToolbarData"));
                function indicateUpgradeFromLegacyAndCleanToolbarData() {
                    Logger.log("Background: indicateUpgradeFromLegacyAndCleanToolbarData: The extension is upgrading from a legacy Chrome extension.");
                    config.state.isUpgradeFromLegacyChrome = true;
                    return clean(toolbarDataFromLocalStorage, config);
                }
                return (toolbarDataFromLocalStorage
                    ? Promise.resolve(indicateUpgradeFromLegacyAndCleanToolbarData())
                    : getToolbarData(config.buildVars.localStorageUrl, config.buildVars.downloadDomain, 20000)).then(function (toolbarData) {
                    return doPostInstall(config, toolbarData || defaultToolbarData);
                }).catch(function (err) {
                    Logger.log("Background: doInstall - Unable to fetch toolbarData: ", err);
                    return doPostInstall(config, defaultToolbarData);
                });
            }
            function clean(toolbarDataFromLocalStorage, config) {
                var toolbarData = new Dlp.SkeletonToolbarData();
                for (var key in toolbarData) {
                    if (toolbarData.hasOwnProperty(key) && toolbarDataFromLocalStorage.hasOwnProperty(key)) {
                        toolbarData[key] = toolbarDataFromLocalStorage[key];
                    }
                }
                toolbarData.pixelUrl = null;
                if (legacyWasConfiguredForChromeTooltab(toolbarDataFromLocalStorage)) {
                    Logger.log("Background: clean: The legacy extension WAS INDEED configured for CTT. Upgrading this extension to WTT.");
                    toolbarData.newTabURL = config.buildVars.newTabURL;
                }
                return toolbarData;
            }
            function handleSecondaryOffer(config) {
                config.state.lastOfferShowDate = Date.now();
                persistConfig(config);
                if (shouldOfferSearchExtension(config)) {
                    UrlFragmentActions.init(config);
                    chrome.tabs.query({ url: matchPatternForDownloadDomain(config.buildVars.downloadDomain) }, function (tabs) {
                        if (tabs.length === 0) {
                            PageUtils.openSearchExtensionOfferPage(config).catch(Logger.warn);
                        }
                        else {
                            var leftMostTab = getLeftMostTab(tabs);
                            PageUtils.redirectToSearchExtensionOfferPage(config, leftMostTab.id, true).catch(Logger.warn);
                        }
                    });
                }
                else {
                    PageUtils.openDefaultNewTab().catch(Logger.warn);
                }
            }
            function doPostInstall(config, toolbarData) {
                config.state.toolbarData = toolbarData;
                if (!config.state.isUpgradeFromLegacyChrome) {
                    config.state.showSurveyNotification = true;
                }
                setInstallDateIfMissing(config);
                if (Util.getSearchDomain(config) === "bing" && config.buildVars.pTagServiceUrl) {
                    pTagService = new PTagService(config, onSearchParamsUpdate);
                    config.state.toolbarData = PTagService.getToolbarDataWithSearchParams(config);
                }
                return updateReplaceableParams(config)
                    .then(watchExtensionsHandler.init)
                    .then(persistConfig)
                    .then(function (config) {
                    var installPixelUrl = config.state.toolbarData.pixelUrl;
                    if (installPixelUrl) {
                        apps.ul.firePixel({ url: installPixelUrl }).catch(function (err) {
                            Logger.log("Background: doPostInstall - firePixel:::", err);
                        });
                    }
                    if (config.state.isUpgradeFromLegacyChrome) {
                        return Promise.resolve(config);
                    }
                    getCwsWindow().then(closeCwsWindow);
                    handleSecondaryOffer(config);
                    if (config.buildVars.domainsToRedirectToNewTab) {
                        new NewTabRedirectService(config);
                    }
                    return Promise.resolve(config);
                });
            }
            function closeCwsWindow(popUpWindowToClose) {
                if (!popUpWindowToClose || !popUpWindowToClose.tabs.length) {
                    return;
                }
                chrome.tabs.remove(popUpWindowToClose.tabs[0].id);
            }
            function getCwsWindow() {
                return new Promise(function (resolve) {
                    chrome.windows.getAll({
                        populate: true
                    }, function (windows) {
                        var popUpWindow = windows.find(function (window) {
                            return window.type === "popup" && !!window.tabs.find(function (tab) {
                                return new RegExp("chrome\\.google\\.com\\/webstore.*" + chrome.runtime.id).test(tab.url);
                            });
                        });
                        resolve(popUpWindow);
                    });
                });
            }
            function persistConfig(config) {
                return extensionStateStorage
                    .set(config.state)
                    .catch(function (err) {
                    Logger.log("Background: persistConfig - Unable to set EXTENSION STATE::::", err);
                    Promise.reject(err);
                })
                    .then(function (_) { return config; });
            }
            function updateReplaceableParams(config) {
                config.state.replaceableParams = createReplaceableParams(config);
                return Promise.resolve(config);
            }
            function handleInvalidNewTabUrl(config) {
                if (config.state.toolbarData && !config.state.toolbarData.newTabURL) {
                    Logger.log("Background: handleInvalidNewTabUrl: newTabURL is missing");
                    if (config.state.isUpgradeFromLegacyChrome) {
                        config.state.toolbarData.newTabURL = localStorage.getItem("newtab/url");
                    }
                    if (!config.state.toolbarData.newTabURL) {
                        config.state.toolbarData.newTabURL = config.buildVars.newTabURL;
                    }
                    extensionStateStorage.set(config.state).catch(function (err) {
                        Logger.log("Unable to set EXTENSION STATE - newTabUrl::::", err);
                    });
                }
                return Promise.resolve(config);
            }
            function run(cfg) {
                config = cfg;
                nativeMessagingHostName = config.csw.nativemessagingHostName;
                watchExtensionsHandler.startListening(config);
                updateReplaceableParams(config)
                    .then(persistConfig)
                    .then(function (config) {
                    if (Util.getSearchDomain(config) === "bing" && config.buildVars.pTagServiceUrl && !pTagService) {
                        pTagService = new PTagService(config, onSearchParamsUpdate);
                    }
                    setUninstallURL(config);
                    contentScriptConnectionManager.notifyExistingContentScripts(config);
                    startULPing(config);
                    SurveyService.checkServicePrerequisites(config).then(function (shouldShowNotification) {
                        if (shouldShowNotification) {
                            new SurveyService(config, extensionStateStorage);
                        }
                    });
                    if (config.buildVars.offerServiceConfigUrl) {
                        new OfferService().exec(config);
                    }
                    if (config.buildVars.notificationsEnabled && chrome.notifications) {
                        new NotificationService().exec(config);
                    }
                    Logger.log("Background:run setting splash page redirect handler");
                    new background.SplashPageRedirectHandler(config).start();
                    Logger.log("Background:run setting bab click handler");
                    new BabClickHandler(config, contentScriptConnectionManager.connectionOperations);
                    if (config.buildVars.isB2B) {
                        Logger.log("Background:run setting B2BService");
                        new B2BService(config);
                    }
                    ignoreFocusSetOnRestart();
                }).catch(function (err) {
                    Logger.log("Background: run - error: ", err);
                });
            }
            function ignoreFocusSetOnRestart() {
                var chromeMinVersionSetFocusWithMeta = 62;
                if (!BrowserUtils.isChrome() && parseInt(BrowserUtils.getBrowserVersion(), 10) < chromeMinVersionSetFocusWithMeta)
                    return;
                onRestartActionsExtensionStateStorage.get()
                    .then(function (onRestartActionsState) {
                    if (!onRestartActionsState) {
                        onRestartActionsState = { setFocus: false };
                        onRestartActionsExtensionStateStorage.set(onRestartActionsState);
                        return;
                    }
                    chrome.tabs.query({}, function (tabs) {
                        if (tabs.length === 1 && (tabs[0].url === "chrome://newtab/"))
                            return;
                        onRestartActionsState.setFocus = false;
                        onRestartActionsExtensionStateStorage.set(onRestartActionsState);
                    });
                });
            }
            function setUninstallURL(config) {
                try {
                    var url = config.state.toolbarData.uninstallSurveyUrl || config.buildVars.uninstallSurveyUrl;
                    if (chrome.runtime.setUninstallURL && url) {
                        chrome.runtime.setUninstallURL(TextTemplate.parse(url, config.state.replaceableParams));
                    }
                }
                catch (e) {
                    Logger.log(e);
                }
            }
            function setInstallDateIfMissing(config) {
                if (!config.state.toolbarData.installDate) {
                    config.state.toolbarData.installDate = createInstallDate();
                }
            }
            function createInstallDate() {
                var today = new Date(), year = today.getFullYear(), month = today.getMonth() + 1, day = today.getDate(), hour = today.getHours(), pad = function (n) { return (n < 10 ? "0" : "") + n.toString(); };
                return "" + year + pad(month) + pad(day) + pad(hour);
            }
            function getToolbarData(localStorageUrl, cookieDomain, timeout) {
                return Dlp.getDataFromCookies(cookieDomain)
                    .then(function (dlpData) {
                    Logger.log("Background: getToolbarData: Successfully got DLP data from COOKIES");
                    return Promise.resolve(dlpData.toolbarData);
                })
                    .catch(function (getCookiesErr) {
                    Logger.log("Background: getToolbarData: Failed to get DLP data from COOKIES: " + getCookiesErr);
                    Logger.log("Background: getToolbarData: Fail over to LOCAL STORAGE, since fetching DLP data from cookies failed.");
                    return Dlp.getDataFromLocalStorage({
                        url: localStorageUrl,
                        timeout: timeout,
                        keys: ["toolbarData"]
                    })
                        .then(function (dlpData) {
                        Logger.log("Background: getToolbarData: Successfully got DLP data from LOCAL STORAGE");
                        return Promise.resolve(dlpData.toolbarData);
                    })
                        .catch(function (getLocalStorageErr) {
                        Logger.log("Background: getToolbarData: Failed to get DLP data from LOCAL STORAGE: " + getLocalStorageErr);
                        Logger.log("Background: getToolbarData: Overall FAILED to fetch DLP data");
                        return Promise.reject(new Error("\nCOOKIE ERROR: " + getCookiesErr + "\nLOCAL STORAGE ERROR: " + getLocalStorageErr));
                    });
                });
            }
            function onSearchParamsUpdate(searchParams, ttl, isTTLChanged) {
                var _this = this;
                return extensionStateStorage.get()
                    .then(function (state) {
                    config.state = state;
                    var newSearchParams = JSON.stringify(searchParams);
                    if (newSearchParams !== config.state.toolbarData.searchParams || isTTLChanged) {
                        ask.apps.ul.fireInfoEvent(_this.extensionConfig.buildVars.unifiedLoggingUrl, {
                            message: "success-search-params-update",
                            topic: "ptag-service",
                            data1: JSON.stringify(searchParams),
                            data2: ttl.toString()
                        }, _this.extensionConfig, null).catch(Logger.log);
                    }
                    config.state.toolbarData.searchParams = newSearchParams;
                    return Promise.resolve(config);
                })
                    .then(updateReplaceableParams)
                    .then(persistConfig)
                    .then(function (config) {
                    contentScriptConnectionManager.sendSearchParamsMessage(config.state.toolbarData.searchParams);
                    return Promise.resolve(config);
                });
            }
            function createReplaceableParams(config) {
                var partnerId = GlobalPartnerIdFactory.parse(config.state.toolbarData.partnerId, config.state.toolbarData.partnerSubId);
                var installDate = config.state.toolbarData.installDate;
                var installDateHex = parseInt(config.state.toolbarData.installDate).toString(16);
                var installDateYYYY_MM_DD = installDate.substring(0, 4) + "-" + installDate.substring(4, 6) + "-" + installDate.substring(6, 8);
                var replaceableParams = {
                    affiliateID: partnerId.getCampaign() || config.state.toolbarData.campaign,
                    cobrandID: partnerId.getCobrand() || config.state.toolbarData.cobrand,
                    countryCode: partnerId.getCountry() || config.state.toolbarData.countryCode,
                    coID: config.state.toolbarData.coId,
                    definitionID: config.buildVars.configDefId,
                    installDate: installDate,
                    installDateHex: installDateHex,
                    installDateYYYY_MM_DD: installDateYYYY_MM_DD,
                    languageISO: window.navigator.language,
                    partnerID: partnerId.toString() || config.state.toolbarData.partnerId,
                    partnerParams: partnerId.appendQueryParameters("ptnrS"),
                    partnerParamsConfig: partnerId.appendQueryParameters("p"),
                    partnerParamsSearch: partnerId.appendQueryParameters("id", "ptnrS"),
                    partnerSubID: config.state.toolbarData.partnerSubId,
                    productName: config.buildVars.toolbarDisplayName,
                    si: config.state.toolbarData.partnerSubId,
                    toolbarID: config.state.toolbarData.toolbarId,
                    toolbarVersion: config.buildVars.version,
                    toolbarVersionNew: config.buildVars.version,
                    trackID: partnerId.getTrack() || config.buildVars.track,
                    cwsid: chrome.runtime.id,
                    searchParams: config.state.toolbarData.searchParams,
                    vendorId: config.state.toolbarData.vendorId,
                    downloadDomain: config.buildVars.downloadDomain
                };
                Logger.log("Background: createReplaceableParams - created the following replaceableParams: ", JSON.stringify(replaceableParams, null, 2));
                return replaceableParams;
            }
            function startULPing(config) {
                var alarmName = "livePing";
                var minTimeToNextPing = 60000;
                var interval = config.buildVars.livePing.interval;
                var lastPing = config.state.lastLivePing;
                var ping = function () {
                    var eventData = {
                        cwsid: chrome.runtime.id
                    };
                    apps.ul.fireToolbarActiveEvent(config.buildVars.livePing.url, eventData, config).then(function (response) {
                        config.state.lastLivePing = Date.now();
                        extensionStateStorage.update(config.state);
                    }).catch(function (err) {
                        Logger.log("Background: startULPing - " + alarmName + ": Unable to send Live ping. " + err);
                    });
                };
                var delta = Math.max(0, interval - (Date.now() - (lastPing || 0)));
                if (delta <= minTimeToNextPing) {
                    setTimeout(function () { return ping(); }, delta);
                    delta += interval;
                }
                chrome.alarms.create(alarmName, {
                    when: Date.now() + delta,
                    periodInMinutes: interval / 1000 / 60
                });
                chrome.alarms.onAlarm.addListener(function (alarm) {
                    if (alarm.name === alarmName) {
                        ping();
                    }
                });
            }
            function loadConfig(url) {
                return AJAX.readConfigJSON(url);
            }
            function matchPatternForDownloadDomain(downloadDomain) {
                return "*://*" + downloadDomain + "/*";
            }
            function legacyWasConfiguredForChromeTooltab(toolbarDataFromLocalStorage) {
                Logger.log("Background: legacyWasConfiguredForChromeTooltab: Checking whether or not the legacy extension from which this extension is upgrading was configured for CTT.");
                Logger.log("Background: legacyWasConfiguredForChromeTooltab: The value of newTabCache is: " + toolbarDataFromLocalStorage.newTabCache + ".");
                return (toolbarDataFromLocalStorage.newTabCache || "").toString() === "true";
            }
            function shouldOfferSearchExtension(config) {
                var isSearchExtensionEnabled = (config.state.toolbarData.chromeSearchExtensionEnabled === "true");
                return (isSearchExtensionEnabled && Boolean(config.state.toolbarData.chromeSearchExtensionURL));
            }
            function getLeftMostTab(tabs) {
                return sortTabsFromLeftToRight(tabs)[0];
            }
            function sortTabsFromLeftToRight(tabs) {
                return tabs.sort(function (tabA, tabB) { return tabA.index - tabB.index; });
            }
            function setUpContentScriptInjection(config) {
                if (config.buildVars.contentScriptMatchPatterns) {
                    var extensionDetectMatchPattern_1 = new RegExp("^https?://[\\w\\d]+" + config.buildVars.contentScriptMatchPatterns.extensionDetect + "/.*$", "i");
                    var webTooltabAPIProxyMatchPattert_1 = new RegExp("^https?://[\\w\\d]+" + config.buildVars.contentScriptMatchPatterns.webTooltabAPIProxy + "/.*$", "i");
                    var injectContentScripts = function (tabId, changeInfo, tab) {
                        if (!changeInfo || !changeInfo.url)
                            return;
                        if (extensionDetectMatchPattern_1.test(changeInfo.url)) {
                            var files = ["js/logger.js", "js/chrome.js", "js/util.js", "js/extensionDetect.js"];
                            files.forEach(function (file) { return chrome.tabs.executeScript({ runAt: "document_start", file: file }, function () {
                                if (chrome.runtime.lastError) {
                                    Logger.error(chrome.runtime.lastError);
                                }
                            }); });
                        }
                        if (webTooltabAPIProxyMatchPattert_1.test(changeInfo.url)) {
                            var files = ["js/logger.js", "js/chrome.js", "js/util.js", "js/webTooltabAPIProxy.js"];
                            files.forEach(function (file) { return chrome.tabs.executeScript({ runAt: "document_end", file: file }, function () {
                                if (chrome.runtime.lastError) {
                                    Logger.error(chrome.runtime.lastError);
                                }
                            }); });
                        }
                    };
                    chrome.tabs.onUpdated.addListener(injectContentScripts);
                }
                return Promise.resolve(config);
            }
        })(background = apps.background || (apps.background = {}));
    })(apps = ask.apps || (ask.apps = {}));
})(ask || (ask = {}));
