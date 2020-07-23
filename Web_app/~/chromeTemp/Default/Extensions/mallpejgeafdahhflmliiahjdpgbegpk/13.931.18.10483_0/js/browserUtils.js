"use strict";
var BrowserUtils;
(function (BrowserUtils) {
    function isAPIAvailable() {
        return {
            tabsExecuteScriptFrameIdSupport: (parseInt(BrowserUtils.getBrowserVersion(), 10) >= chromeVersionTabsExecuteScriptFrameIdSupport)
        };
    }
    BrowserUtils.isAPIAvailable = isAPIAvailable;
    var chromeVersionTabsExecuteScriptFrameIdSupport = 50;
    function isChrome() {
        return getBrowserName() === "Chrome";
    }
    BrowserUtils.isChrome = isChrome;
    function isFireFox() {
        return getBrowserName() === "Firefox";
    }
    BrowserUtils.isFireFox = isFireFox;
    function isEdgeChromium() {
        return getBrowserName() === "Edg";
    }
    BrowserUtils.isEdgeChromium = isEdgeChromium;
    function getBrowserName() {
        if (~window.navigator.userAgent.indexOf("Edg/")) {
            return "Edg";
        }
        if (~window.navigator.userAgent.indexOf("Chrome")) {
            return "Chrome";
        }
        if (~window.navigator.userAgent.indexOf("Firefox")) {
            return "Firefox";
        }
    }
    BrowserUtils.getBrowserName = getBrowserName;
    BrowserUtils.getBrowserVersion = function () {
        return new RegExp(getBrowserName() + "\\/([0-9\\.]+)").exec(window.navigator.userAgent)[1];
    };
    BrowserUtils.getLanguage = function () {
        return window.navigator.language.split("-")[0];
    };
    BrowserUtils.getOS = function () {
        if (/^Win.*$/.test(window.navigator.platform)) {
            return "Windows";
        }
        if (/^Mac.*$/.test(window.navigator.platform)) {
            return "Mac OS";
        }
        if (/^Linux.*$/.test(window.navigator.platform)) {
            return "Linux";
        }
        if (/.*CrOS.*/.test(window.navigator.userAgent)) {
            return "Chrome OS";
        }
        return "Other";
    };
})(BrowserUtils || (BrowserUtils = {}));
