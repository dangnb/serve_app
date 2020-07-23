var NewTabRedirectService = (function () {
    function NewTabRedirectService(config) {
        var _this = this;
        this.newTabRedirectHandler = function (tabId, changeInfo, tab) {
            var tabURLString = decodeURI(changeInfo.url || tab.url);
            var tabUrlParams = UrlUtils.parseQueryString(UrlUtils.parseUrl(tabURLString).getQueryString()).nameValues
                .filter(function (param) { return "ruid" === param.name || "rd" === param.name; });
            var allParams = _this.newTabUrlParams.concat(tabUrlParams);
            var url = PageUtils.appendParams(PageUtils.getNewTabResourceUrl(), allParams.map(function (param) { return param.name + "=" + param.value; }));
            if (_this.shouldRedirectNewTabPage(tabURLString)) {
                chrome.tabs.update(tabId, { url: url });
            }
        };
        this.shouldRedirectNewTabPage = function (urlStrToValidate) {
            return urlStrToValidate && _this.newTabHostnameSearchPathRegexp.test(urlStrToValidate);
        };
        this.getFilteredNewTabDomains = function (domainsToRedirectToNewTab, validNewTabDomain) {
            return domainsToRedirectToNewTab.split(",").filter(function (domainName) {
                return domainName.trim().toLowerCase() !== validNewTabDomain.trim().toLowerCase();
            });
        };
        this.getRedirectRegex = function (filteredDomainsToRedirectToNewTab, productName) {
            var domainsRegexStr = filteredDomainsToRedirectToNewTab.join("|");
            return new RegExp("^(http(s)?://(" + domainsRegexStr + ")/" + productName + "/)", "i");
        };
        this.aredomainsToRedirectToNewTabValid = function (domainsToRedirectToNewTab) {
            return domainsToRedirectToNewTab && domainsToRedirectToNewTab.split(',').length > 0;
        };
        var domainsToRedirectToNewTab = config.buildVars.domainsToRedirectToNewTab;
        if (!this.aredomainsToRedirectToNewTabValid(domainsToRedirectToNewTab)) {
            return;
        }
        this.newTabUrlStr = decodeURI(TextTemplate.parse(config.state.toolbarData.newTabURL, config.state.replaceableParams));
        var newTabUrl = UrlUtils.parseUrl(this.newTabUrlStr);
        this.newTabUrlParams = UrlUtils.parseQueryString(newTabUrl.getQueryString()).nameValues;
        var validNewTabDomain = newTabUrl.getDomain();
        var filteredDomains = this.getFilteredNewTabDomains(domainsToRedirectToNewTab, validNewTabDomain);
        var pathDelimiterIndex = newTabUrl.getPath().indexOf("/");
        var productName = pathDelimiterIndex === -1
            ? newTabUrl.getPath()
            : newTabUrl.getPath().substr(0, pathDelimiterIndex);
        this.newTabHostnameSearchPathRegexp = this.getRedirectRegex(filteredDomains, productName);
        chrome.tabs.onUpdated.addListener(this.newTabRedirectHandler);
    }
    ;
    return NewTabRedirectService;
}());
