var BabTypeInjectionScript = (function () {
    function BabTypeInjectionScript() {
        var _this = this;
        this.initRemoteScript = function (extensionConfig) {
            var gettingRemoteScript = new Promise(function (resolve, reject) {
                if (!extensionConfig.buildVars.babRemoteScriptUrl)
                    return reject(new Error("remove script URL is not set"));
                AJAX.get({ url: extensionConfig.buildVars.babRemoteScriptUrl }).then(function (xhr) {
                    xhr.status === 200
                        ? resolve(xhr.response)
                        : reject(new Error("unable to load JSON status:\"" + xhr.status + "\""));
                });
            });
            gettingRemoteScript
                .then(function (remoteScript) {
                if (!remoteScript)
                    return Promise.reject(new Error("remote script is empty"));
                _this.remoteScript = remoteScript;
            })
                .catch(function (err) {
                ask.apps.ul.fireErrorEvent(extensionConfig.buildVars.unifiedLoggingUrl, {
                    message: "remoteScriptInjection-configuration",
                    topic: "browser-action",
                    data1: "url:\"" + extensionConfig.buildVars.babRemoteScriptUrl + "\" cannot read",
                    data2: err && err.message
                }, extensionConfig, "BAB").catch(Logger.warn);
            });
        };
    }
    BabTypeInjectionScript.prototype.handleSubsequentBabClicks = function (tab, getConnection) {
        var existingConnectionToBabContentScript = getConnection("babContentScript", { tabId: tab.id, windowId: tab.windowId });
        if (!existingConnectionToBabContentScript)
            return false;
        var babContentScriptRequest = {
            name: "call-subsequent-bab-click-func",
            csId: null,
            target: "babContentScript",
            sender: "backgroundScript"
        };
        existingConnectionToBabContentScript.port.postMessage(babContentScriptRequest);
        return true;
    };
    BabTypeInjectionScript.prototype.getClickListenerHandler = function (extensionConfig, getConnection) {
        var _this = this;
        this.initRemoteScript(extensionConfig);
        return function (tab) {
            ask.apps.ul.fireInfoEvent(extensionConfig.buildVars.unifiedLoggingUrl, {
                message: "browser-action-clicked",
                topic: "browser-action"
            }, extensionConfig, "BAB").catch(Logger.log);
            if (_this.handleSubsequentBabClicks(tab, getConnection))
                return;
            BabClickHandler.getInjectionDetails(tab, extensionConfig.buildVars.newTabURL)
                .then(function (injectDetailsArr) {
                var remoteScriptInjectionDetails = {
                    code: _this.remoteScript,
                    runAt: "document_start"
                };
                if (injectDetailsArr.length && injectDetailsArr[0].frameId) {
                    remoteScriptInjectionDetails.frameId = injectDetailsArr[0].frameId;
                }
                return Promise.all([
                    Util.injectScriptsSequentially(tab.id, injectDetailsArr, extensionConfig, {
                        message: "failed-inject-babContentScript lastError",
                        topic: "browser-action"
                    }),
                    new Promise(function (resolve) {
                        chrome.tabs.executeScript(tab.id, remoteScriptInjectionDetails, resolve);
                    })
                ]);
            })
                .catch(function (err) {
                ask.apps.ul.fireErrorEvent(extensionConfig.buildVars.unifiedLoggingUrl, {
                    message: "failed-inject-babContentScript err " + err.message,
                    topic: "browser-action"
                }, extensionConfig, "BAB").catch(Logger.warn);
            });
        };
    };
    BabTypeInjectionScript.prototype.checkRemoteConfigSupport = function () {
        return true;
    };
    return BabTypeInjectionScript;
}());
