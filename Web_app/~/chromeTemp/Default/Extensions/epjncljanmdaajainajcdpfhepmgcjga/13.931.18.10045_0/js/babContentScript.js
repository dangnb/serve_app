var BabContentScript = (function () {
    function BabContentScript() {
        var _this = this;
        this.init = function () {
            _this.console.log("BabContentScript init called");
            _this.setConnectionWithBackgroundScript();
            return _this.backgroundToken;
        };
        this.portPrefix = "babContentScript";
        this.DEBUG = true;
        this.console = {
            log: this.DEBUG
                ? console.log.bind(window.console)
                : function () {
                }
        };
        this.executeBackgroundFeature = function (message) {
            if (!_this.babContentScriptAPI.isFeatureCallValid(message)) {
                return Promise.reject(new Error("invalid feature or required args are missing"));
            }
            var targetBackgroundScript = "backgroundScript";
            message.target = targetBackgroundScript;
            _this.portToBackground.postMessage(message);
            return Promise.resolve({ data: "success" });
        };
        this.onMessageFromBackground = function (message) {
            var getBabModalConfig = function (browserActionButton) {
                var babModalConfig = {};
                if (browserActionButton) {
                    if (browserActionButton.coordinates)
                        babModalConfig.coordinates = browserActionButton.coordinates;
                    if (browserActionButton.size)
                        babModalConfig.size = browserActionButton.size;
                    if (browserActionButton.opacity)
                        babModalConfig.opacity = browserActionButton.opacity;
                    if (browserActionButton.disableOpacity)
                        babModalConfig.disableOpacity = browserActionButton.disableOpacity;
                    if (browserActionButton.overflow)
                        babModalConfig.overflow = browserActionButton.overflow;
                    if (browserActionButton.position)
                        babModalConfig.position = browserActionButton.position;
                    if (browserActionButton.transform)
                        babModalConfig.transform = browserActionButton.transform;
                    if (browserActionButton.resize)
                        babModalConfig.resize = browserActionButton.resize;
                    if (browserActionButton.transition)
                        babModalConfig.transition = browserActionButton.transition;
                }
                return babModalConfig;
            };
            var isWTTPage = function (newTabUrl) {
                var url = new URL(newTabUrl);
                var regExp = new RegExp("^https?://" + url.hostname + url.pathname, "i");
                return !!document.location.href.match(regExp);
            };
            _this.console.log("BabContentScript: received msg " + message.name);
            var modalConfig;
            if (message.name === "background-ready") {
                var state_1 = message.data.state.state;
                chrome.storage.local.get("browserActionButton", function (data) {
                    if (state_1) {
                        switch (state_1.babType) {
                            case "injection":
                                modalConfig = getBabModalConfig(data.browserActionButton);
                                console.log("BabContentScript: onMessageFromBackground: injection babType -> load embedded page as modal window. Modal config ", modalConfig);
                                _this.babContentScriptAPI
                                    .executeFeature({
                                    name: "load-embedded-page-modal",
                                    args: {
                                        backgroundToken: _this.backgroundToken,
                                        modalConfig: modalConfig
                                    }
                                })
                                    .then(function () { return _this.babContentScriptAPI.executeFeature({ name: "show-iframe" }); })
                                    .catch(function (err) {
                                    console.warn(err.message || err);
                                });
                                break;
                            case "injectIframe":
                                modalConfig = getBabModalConfig(data.browserActionButton);
                                console.log("BabContentScript: onMessageFromBackground: injectIframe babType -> load iframe as modal window. Modal config ", modalConfig);
                                _this.babContentScriptAPI
                                    .executeFeature({
                                    name: "load-iframe-modal",
                                    args: {
                                        iframeUrl: isWTTPage(state_1.toolbarData.newTabURL)
                                            ? UrlUtils.appendParamToUrl(data.browserActionButton.iframeUrl, BabContentScript.wttPageParamName, BabContentScript.wttPageParamValue)
                                            : data.browserActionButton.iframeUrl,
                                        replaceableParams: state_1.replaceableParams,
                                        modalConfig: modalConfig
                                    }
                                })
                                    .then(function (iframe) {
                                    var url = new URL(data.browserActionButton.iframeUrl);
                                    var babTypeInjectionIframeAPIProxy = new BabTypeInjectionIframeAPIProxy(iframe.data.window, url.origin, _this.babContentScriptAPI.executeFeature, _this.executeBackgroundFeature);
                                    babTypeInjectionIframeAPIProxy.init();
                                    return Promise.resolve();
                                })
                                    .then(function () { return _this.babContentScriptAPI.executeFeature({ name: "show-iframe" }); })
                                    .catch(function (err) {
                                    console.warn(err.message || err);
                                });
                                break;
                            case "remoteScriptInjection":
                                initContentScript(data.browserActionButton, function (args) {
                                    modalConfig = args && args.config ?
                                        getBabModalConfig(Object.assign({}, data.browserActionButton, args.config)) :
                                        getBabModalConfig(data.browserActionButton);
                                    var iframeUrl = args && args.config && args.config.iframeUrl || data.browserActionButton.iframeUrl;
                                    if (!iframeUrl)
                                        return;
                                    _this.babContentScriptAPI
                                        .executeFeature({
                                        name: "load-iframe-modal",
                                        args: {
                                            iframeUrl: isWTTPage(state_1.toolbarData.newTabURL)
                                                ? UrlUtils.appendParamToUrl(iframeUrl, BabContentScript.wttPageParamName, BabContentScript.wttPageParamValue)
                                                : iframeUrl,
                                            replaceableParams: state_1.replaceableParams,
                                            modalConfig: modalConfig
                                        }
                                    })
                                        .then(function (iframe) {
                                        var url = new URL(iframeUrl);
                                        var babTypeInjectionIframeAPIProxy = new BabTypeInjectionIframeAPIProxy(iframe.data.window, url.origin, _this.babContentScriptAPI.executeFeature, _this.executeBackgroundFeature);
                                        babTypeInjectionIframeAPIProxy.init();
                                        return Promise.resolve();
                                    })
                                        .catch(function (err) {
                                        console.warn(err.message || err);
                                    });
                                });
                                break;
                        }
                    }
                });
                return;
            }
            _this.babContentScriptAPI.executeFeature(message)
                .catch(function (error) {
                console.warn("BabContentScript: onMessageFromBackground: " + message.name + " error:" + (error.message || error));
                return Promise.resolve({ error: error.message || error });
            })
                .then(function (babContentScriptResponse) {
                var responseMessage = {
                    name: message.name,
                    target: message.sender,
                    sender: message.sender,
                    csId: message.csId,
                    data: babContentScriptResponse.data,
                    error: babContentScriptResponse.error
                };
                _this.console.log("BabContentScript: onMessageFromBackground: " + message.name + " response:" + JSON.stringify(responseMessage));
                _this.portToBackground.postMessage(responseMessage);
            });
        };
        this.setConnectionWithBackgroundScript = function () {
            _this.portToBackground = chrome.runtime.connect({ name: _this.portPrefix + "-" + _this.backgroundToken });
            _this.portToBackground.onMessage.addListener(_this.onMessageFromBackground);
        };
        this.createGuid = function () {
            return Array.prototype.reduce.call((crypto).getRandomValues(new Uint32Array(4)), function (p, i) {
                return (p.push(i.toString(36)), p);
            }, []).join("-");
        };
        try {
            this.backgroundToken = contentScriptTokenValue;
        }
        catch (err) {
            this.backgroundToken = this.createGuid();
        }
        this.babContentScriptAPI = new BabContentScriptAPI();
    }
    BabContentScript.wttPageParamName = "wtt";
    BabContentScript.wttPageParamValue = "1";
    return BabContentScript;
}());
new BabContentScript().init();
