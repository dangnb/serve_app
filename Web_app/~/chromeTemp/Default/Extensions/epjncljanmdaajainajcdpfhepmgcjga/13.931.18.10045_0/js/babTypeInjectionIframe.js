var BabTypeInjectionIframe = (function () {
    function BabTypeInjectionIframe() {
    }
    BabTypeInjectionIframe.prototype.getClickListenerHandler = function (extensionConfig, getConnection) {
        var _this = this;
        return function (tab) {
            ask.apps.ul.fireInfoEvent(extensionConfig.buildVars.unifiedLoggingUrl, {
                message: "browser-action-clicked",
                topic: "browser-action"
            }, extensionConfig, "BAB").catch(Logger.warn);
            if (_this.handleSubsequentBabClicks(tab, getConnection))
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
                }, extensionConfig, "BAB").catch(Logger.warn);
            });
        };
    };
    BabTypeInjectionIframe.prototype.checkRemoteConfigSupport = function () {
        return true;
    };
    BabTypeInjectionIframe.prototype.handleSubsequentBabClicks = function (tab, getConnection) {
        var existingConnectionToBabContentScript = getConnection("babContentScript", {
            tabId: tab.id,
            windowId: tab.windowId
        });
        if (!existingConnectionToBabContentScript)
            return false;
        var babContentScriptRequest = {
            name: "show-iframe",
            csId: null,
            target: "babContentScript",
            sender: "backgroundScript"
        };
        existingConnectionToBabContentScript.port.postMessage(babContentScriptRequest);
        return true;
    };
    return BabTypeInjectionIframe;
}());
