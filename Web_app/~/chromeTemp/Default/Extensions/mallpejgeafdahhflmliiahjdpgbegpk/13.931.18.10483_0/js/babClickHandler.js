var BabClickHandler = (function () {
    function BabClickHandler(extensionConfig, connectionOperations) {
        var _this = this;
        this.setBabClickHandler = function () {
            Logger.log("BabClickHandler: setBabClickHandler " + _this.extensionConfig.buildVars.babType);
            var babType = BabTypeFactory.createBabType(_this.extensionConfig.buildVars.babType);
            if (babType.checkRemoteConfigSupport) {
                _this.babRemoteConfigProcessor.setBabThroughRemoteConfig();
            }
            chrome.browserAction.onClicked.addListener(babType.getClickListenerHandler(_this.extensionConfig, _this.connectionOperations.getContentScriptConnectionByTabAndWin));
        };
        this.extensionConfig = extensionConfig;
        this.connectionOperations = connectionOperations;
        this.babRemoteConfigProcessor = new BabRemoteConfigProcessor(extensionConfig, connectionOperations);
        this.setBabClickHandler();
    }
    BabClickHandler.getInjectionDetails = function (tab, newTabURLStr) {
        var orderedScriptsNamesToInject = [
            "/js/urlUtils.js",
            "/js/templateParser.js",
            "/js/babTypeInjectionIframeAPIProxy.js",
            "/js/babContentScriptAPI.js",
            "/js/babContentScript.js"
        ];
        var injectDetailsArr = orderedScriptsNamesToInject.map(function (file) {
            return { runAt: "document_start", file: file };
        });
        var newTabDomain = "chrome-extension://" + chrome.runtime.id;
        var systemNewTab = BrowserUtils.isChrome()
            ? "chrome://newtab/"
            : "edge://newtab/";
        if (tab.url !== systemNewTab && !~tab.url.indexOf(newTabDomain)) {
            Logger.log("BabClickHandler: getInjectionDetails this is not extension page. Trying to inject content script");
            return Promise.resolve(injectDetailsArr);
        }
        return new Promise(function (resolve, reject) {
            chrome.webNavigation.getAllFrames({ tabId: tab.id }, function (iFrameDetailsArr) {
                if (!iFrameDetailsArr || !iFrameDetailsArr.length) {
                    return reject("\"" + systemNewTab + "\" does not contain any iframe");
                }
                if (!newTabURLStr) {
                    return reject("getInjectionDetails newTabURL argument is not set");
                }
                var newtabUrl = new URL(newTabURLStr);
                var newtabHostPathname = newtabUrl
                    ? "" + newtabUrl.hostname + newtabUrl.pathname
                    : null;
                var newTabIframe = iFrameDetailsArr.find(function (iFrameDetails) {
                    return iFrameDetails.url.replace(/(^\w+:|^)\/\//, "").indexOf(newtabHostPathname) === 0;
                });
                if (newTabIframe) {
                    injectDetailsArr = injectDetailsArr.map(function (injectDetails) {
                        injectDetails.frameId = newTabIframe.frameId;
                        return injectDetails;
                    });
                    Logger.log("BabClickHandler: getInjectionDetails it is WTT page. Injection details extended with iframeid: " + newTabIframe.frameId);
                    return resolve(injectDetailsArr);
                }
                return reject("new tab \"" + systemNewTab + "\" does not contain iframe with new tab url \"" + newtabHostPathname + "\"");
            });
        });
    };
    return BabClickHandler;
}());
