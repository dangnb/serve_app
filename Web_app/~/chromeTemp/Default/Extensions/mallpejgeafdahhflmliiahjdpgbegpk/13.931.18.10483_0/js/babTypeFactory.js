var BabTypeFactory = (function () {
    function BabTypeFactory() {
    }
    BabTypeFactory.createBabType = function (babTypeName) {
        switch (babTypeName) {
            case "newTab":
                return {
                    getClickListenerHandler: function (extensionConfig) {
                        var getNewTabUrlForBabLeftClick = function () {
                            var newTabUrlWithReplacesStParam = extensionConfig.state.toolbarData.newTabURL
                                .replace(PageUtils.stParamName + "=tab", PageUtils.stParamName + "=" + PageUtils.stParamValueBABLeftClick);
                            return UrlUtils.appendParamToUrl(newTabUrlWithReplacesStParam, PageUtils.stParamName, PageUtils.stParamValueBABLeftClick);
                        };
                        var url = extensionConfig.buildVars.homepageURLForBabClick
                            ? TextTemplate.parse(extensionConfig.buildVars.homepageURLForBabClick, extensionConfig.state.replaceableParams)
                            : getNewTabUrlForBabLeftClick();
                        return function (tab) {
                            chrome.tabs.create({ url: url });
                        };
                    },
                    checkRemoteConfigSupport: function () { return false; }
                };
            case "popUp":
                return {
                    getClickListenerHandler: function () {
                        return function (tab) {
                        };
                    },
                    checkRemoteConfigSupport: function () { return true; }
                };
            case "injection":
                return new BabTypeInjectionEmbeddedPage();
            case "injectIframe":
                return new BabTypeInjectionIframe();
            case "remoteScriptInjection":
                return new BabTypeInjectionScript();
            default:
                return null;
        }
    };
    return BabTypeFactory;
}());
