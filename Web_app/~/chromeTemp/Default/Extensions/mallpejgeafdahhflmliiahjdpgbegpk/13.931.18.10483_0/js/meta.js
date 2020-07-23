(function () {
    if (~document.location.href.indexOf("?")) {
        return;
    }
    var secondNewTabPageName = "ntp2.html";
    var onRestartActionsExtensionStateStorage = new ChromeStorage(chrome.storage.local, "onRestart");
    var assistShownNewTabKey = "assistNT";
    var setFocusOnSubsequentTabLoads = function (onRestartActionsState) {
        if (!onRestartActionsState) {
            onRestartActionsState = {};
        }
        onRestartActionsState.setFocus = true;
        onRestartActionsExtensionStateStorage.set(onRestartActionsState);
    };
    var redirectToSecondNewTab = function () {
        window.location.href = "chrome-extension://" + chrome.runtime.id + "/" + secondNewTabPageName;
    };
    var gettingAllTabs = new Promise(function (resolve) { return chrome.tabs.query({}, resolve); });
    var gettingCurrentTab = new Promise(function (resolve) { return chrome.tabs.getCurrent(resolve); });
    var gettingOnRestartActionsState = new Promise(function (resolve) { return onRestartActionsExtensionStateStorage.get().then(resolve); });
    if (BrowserUtils.isEdgeChromium()) {
        redirectToSecondNewTab();
        return;
    }
    if (BrowserUtils.isChrome()) {
        var chromeMinVersionsSetFocusWithRedirect = 83;
        var chromeMaxVersionsSetFocusWithMeta = 82;
        var chromeMinVersionSetFocusWithMeta = 62;
        var chromeVersionsSetFocusWithMeta_05_secDelay = 62;
        var chromeVersion = 0;
        var refreshDelay = 0;
        try {
            chromeVersion = parseInt(/Chrome\/([0-9.]+)/.exec(window.navigator.userAgent)[1], 10);
        }
        catch (err) {
        }
        if (!BrowserUtils.isAPIAvailable().tabsExecuteScriptFrameIdSupport) {
            return;
        }
        if (chromeVersion >= chromeMinVersionsSetFocusWithRedirect) {
            redirectToSecondNewTab();
            return;
        }
        if (chromeMinVersionSetFocusWithMeta <= chromeVersion && chromeVersion <= chromeMaxVersionsSetFocusWithMeta) {
            if (chromeVersion === chromeVersionsSetFocusWithMeta_05_secDelay) {
                refreshDelay = 0.5;
            }
            var meta = document.createElement("meta");
            meta.httpEquiv = "refresh";
            meta.content = refreshDelay + ";url=extension://ntp1.html";
            document.getElementsByTagName("head")[0].appendChild(meta);
            return;
        }
    }
    if (!window.localStorage.getItem(assistShownNewTabKey)) {
        gettingOnRestartActionsState
            .then(function (onRestartActionsState) {
            setFocusOnSubsequentTabLoads(onRestartActionsState);
        });
        return;
    }
    Promise.all([gettingAllTabs, gettingOnRestartActionsState, gettingCurrentTab])
        .then(function (result) {
        var onRestartActionsState = result[1];
        var openedTabs = result[0];
        var currentTab = result[2];
        if (openedTabs.length === 1 ||
            (onRestartActionsState && !onRestartActionsState.setFocus && currentTab.active)) {
            setFocusOnSubsequentTabLoads(onRestartActionsState);
            return;
        }
        chrome.tabs.create({ url: chrome.runtime.getURL(secondNewTabPageName) + "?" }, function (tab) {
            chrome.tabs.remove(currentTab.id);
        });
    });
})();
