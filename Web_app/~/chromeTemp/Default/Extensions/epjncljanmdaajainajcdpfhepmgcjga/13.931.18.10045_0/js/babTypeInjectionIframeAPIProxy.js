var BabTypeInjectionIframeAPIProxy = (function () {
    function BabTypeInjectionIframeAPIProxy(iframeWindow, targetOrigin, executeCSFeatureCallback, executeBSFeatureCallback) {
        var _this = this;
        this.supportedFeature = [
            { name: "hide-iframe", requiredArgs: [] },
            { name: "get-page-data", requiredArgs: [] },
            { name: "get-remote-config", requiredArgs: [] },
            { name: "open-new-tab", requiredArgs: [] }
        ];
        this.openNewTabFeatureBehavior = function (message) {
            return _this.executeBSFeatureCallback(message);
        };
        this.featureSpecificBehaviorMapper = new Map([["open-new-tab", this.openNewTabFeatureBehavior]]);
        this.messageFromBabApiHandler = function (event) {
            console.log("BabTypeInjectionIframeAPIProxy: messageFromBabApiHandler: %o", event);
            var messageBabIframe = event.data;
            if (event.origin !== _this.targetOrigin || !messageBabIframe || messageBabIframe.extensionId !== chrome.runtime.id) {
                return;
            }
            var token = messageBabIframe.token;
            var babPageRequest = { name: messageBabIframe.name, args: messageBabIframe.args };
            var executingFeature = _this.featureSpecificBehaviorMapper.has(messageBabIframe.name)
                ? _this.featureSpecificBehaviorMapper.get(messageBabIframe.name)
                : _this.executeCSFeatureCallback;
            executingFeature(babPageRequest)
                .then(function (result) {
                var message = {
                    name: messageBabIframe.name,
                    extensionId: chrome.runtime.id,
                    data: result.data,
                    origin: window.location.href
                };
                if (token)
                    message.token = token;
                _this.iframeWindow.postMessage(message, _this.targetOrigin);
            })
                .catch(function (err) {
                console.warn(err.message || err);
                var message = {
                    name: messageBabIframe.name,
                    extensionId: chrome.runtime.id,
                    error: err.message || err.toString(),
                    origin: window.location.href
                };
                if (token)
                    message.token = token;
                _this.iframeWindow.postMessage(message, _this.targetOrigin);
            });
        };
        this.iframeWindow = iframeWindow;
        this.targetOrigin = targetOrigin;
        this.executeCSFeatureCallback = executeCSFeatureCallback;
        this.executeBSFeatureCallback = executeBSFeatureCallback;
        window.addEventListener("message", this.messageFromBabApiHandler);
    }
    BabTypeInjectionIframeAPIProxy.prototype.init = function () {
        var initMessage = {
            name: "init-features",
            extensionId: chrome.runtime.id,
            data: this.supportedFeature,
            origin: window.location.href
        };
        this.iframeWindow.postMessage(initMessage, this.targetOrigin);
    };
    return BabTypeInjectionIframeAPIProxy;
}());
