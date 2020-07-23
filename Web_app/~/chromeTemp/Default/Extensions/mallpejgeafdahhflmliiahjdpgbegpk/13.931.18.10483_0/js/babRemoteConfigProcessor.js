var BabRemoteConfigProcessor = (function () {
    function BabRemoteConfigProcessor(extensionConfig, connectionOperations) {
        var _this = this;
        this.setBabThroughRemoteConfig = function () {
            Logger.log("BabRemoteConfigProcessor: setBabThroughRemoteConfig added listener window onMessage");
            window.addEventListener("message", _this.connectionOperations.addOnMessageHandlerForBabIframeProxy());
            if (_this.extensionConfig.buildVars.babConfigUrl) {
                new RemoteConfigLoader(_this.extensionConfig, "browserActionButton", _this.onRemoteConfigUpdate)
                    .initConfigLoader(_this.extensionConfig.buildVars.babConfigUrl)
                    .then(_this.loadBackgroundBabIframe)
                    .catch(Logger.warn);
            }
        };
        this.loadBackgroundBabIframe = function (babConfig) {
            var iframeId = "babIframeToProxy";
            var oneMinute = 60000;
            var addIframeToProxy = function () {
                _this.connectionOperations.initMessageHandler(babConfig);
                var iframe = document.createElement("iframe");
                iframe.setAttribute("id", iframeId);
                Logger.log("BabRemoteConfigProcessor: loadBackgroundBabIframe iframeUrl = " + babConfig.proxyUrl);
                iframe.setAttribute("src", babConfig.proxyUrl);
                iframe.onerror = function () {
                    Logger.log("BabRemoteConfigProcessor: loadBackgroundBabIframe onerror - error loading bab iframe");
                    ask.apps.ul.fireErrorEvent(_this.extensionConfig.buildVars.unifiedLoggingUrl, {
                        message: "proxy-iframe-load-error",
                        topic: "browser-action",
                    }, _this.extensionConfig, "BAB").catch(Logger.warn);
                };
                document.body.appendChild(iframe);
            };
            var removeIframeToProxy = function (existingIframe) {
                existingIframe.parentNode.removeChild(existingIframe);
            };
            var updateIframeToProxy = function (existingIframe) {
                var proxyPendingCallsCount = _this.connectionOperations.getCallbackQueueSize();
                if (proxyPendingCallsCount !== 0) {
                    Logger.log("BabRemoteConfigProcessor: loadBackgroundBabIframe: need to postpone iframe update because of pending " + proxyPendingCallsCount + " callbacks");
                    setTimeout(function () {
                        updateIframeToProxy(existingIframe);
                    }, oneMinute);
                    return;
                }
                removeIframeToProxy(existingIframe);
                addIframeToProxy();
            };
            if (!babConfig || !babConfig.reCaptcha || !babConfig.reCaptcha.reCaptchaUrl || !babConfig.reCaptcha.reCaptchaId || !babConfig.proxyUrl) {
                Logger.log("BabRemoteConfigProcessor: loadBackgroundBabIframe no reCaptcha or proxyUrl set in remoteConfig. IframeToProxy is not loaded.");
                return;
            }
            var existingIframe = document.getElementById(iframeId);
            if (existingIframe) {
                var iframeToProxyUrlChanged = existingIframe.src.replace(UrlUtils.urlProtocolRegex, "").replace(UrlUtils.urlParamsRegex, "") !==
                    babConfig.proxyUrl.replace(UrlUtils.urlProtocolRegex, "").replace(UrlUtils.urlParamsRegex, "");
                if (iframeToProxyUrlChanged) {
                    updateIframeToProxy(existingIframe);
                }
                else {
                    Logger.log("BabRemoteConfigProcessor: loadBackgroundBabIframe: existingIframe url matches the new remoteConfig url");
                }
                return;
            }
            addIframeToProxy();
        };
        this.onRemoteConfigUpdate = function (remoteConfig) {
            Logger.log("BabRemoteConfigProcessor: onRemoteConfigUpdate remote config loaded");
            _this.loadBackgroundBabIframe(remoteConfig);
        };
        this.connectionOperations = connectionOperations;
        this.babConfigStorage = new ChromeStorage(chrome.storage.local, "browserActionButton");
        this.extensionConfig = extensionConfig;
    }
    return BabRemoteConfigProcessor;
}());
