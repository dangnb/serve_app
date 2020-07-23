var BabTypeInjectionEmbeddedPage = (function () {
    function BabTypeInjectionEmbeddedPage() {
    }
    BabTypeInjectionEmbeddedPage.prototype.getClickListenerHandler = function (extensionConfig, getConnection) {
        var _this = this;
        return function (tab) {
            ask.apps.ul
                .fireInfoEvent(extensionConfig.buildVars.unifiedLoggingUrl, {
                message: "browser-action-clicked",
                topic: "browser-action"
            }, extensionConfig, "BAB")
                .catch(Logger.log);
            if (_this.reopenedLoadedEmbeddedPage(tab, getConnection))
                return;
            BabClickHandler.getInjectionDetails(tab, extensionConfig.buildVars.newTabURL)
                .then(function (injectDetailsArr) {
                return Util.injectScriptsSequentially(tab.id, injectDetailsArr, extensionConfig, {
                    message: "failed-inject-babContentScript lastError",
                    topic: "browser-action"
                });
            })
                .catch(function (err) {
                ask.apps.ul.fireErrorEvent(extensionConfig.buildVars.unifiedLoggingUrl, {
                    message: "failed-inject-babContentScript err " + err.message,
                    topic: "browser-action"
                }, extensionConfig, "BAB");
            });
        };
    };
    BabTypeInjectionEmbeddedPage.prototype.checkRemoteConfigSupport = function () {
        return true;
    };
    BabTypeInjectionEmbeddedPage.prototype.reopenedLoadedEmbeddedPage = function (tab, getConnection) {
        var showInjectedPage = function (babCSConnection, babPageCSConnection, token) {
            var babContentScriptResponse = {
                name: "reopen-bab-page",
                csId: null,
                target: "babPageContentScript",
                sender: "backgroundScript"
            };
            var babContentScriptRequest = {
                name: "show-iframe",
                csId: null,
                target: "babContentScript",
                sender: "backgroundScript"
            };
            babPageCSConnection.port.postMessage(babContentScriptResponse);
            babCSConnection.port.postMessage(babContentScriptRequest);
        };
        var existingConnectionToBabContentScript = getConnection("babContentScript", { tabId: tab.id, windowId: tab.windowId });
        var existingConnectionToBabPageContentScript = getConnection("babPageContentScript", { tabId: tab.id, windowId: tab.windowId });
        if (existingConnectionToBabContentScript && existingConnectionToBabPageContentScript) {
            var babCSToken = existingConnectionToBabContentScript.port.name.substr(existingConnectionToBabContentScript.port.name.indexOf("-") + 1);
            var babCSPageToken = existingConnectionToBabPageContentScript.port.name.substr(existingConnectionToBabPageContentScript.port.name.indexOf("-") + 1);
            if (babCSToken === babCSPageToken) {
                Logger.log("BabClickHandler: handleEmbeddedPageInjectionOnBabClick babPage rendered and connections exists. Send show iframe command");
                showInjectedPage(existingConnectionToBabContentScript, existingConnectionToBabPageContentScript, babCSToken);
                return true;
            }
        }
        return false;
    };
    return BabTypeInjectionEmbeddedPage;
}());
