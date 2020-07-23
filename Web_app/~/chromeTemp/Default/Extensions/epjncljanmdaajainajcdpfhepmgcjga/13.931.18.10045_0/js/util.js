"use strict";
var Util;
(function (Util) {
    function mergeObjects() {
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i] = arguments[_i];
        }
        if (params.some(function (param) { return Array.isArray(param); })) {
            throw "This method DOES NOT support array inputs.";
        }
        return params.reduce(function (prev, current) {
            return mergeTwoObjects(prev, current);
        }, {});
    }
    Util.mergeObjects = mergeObjects;
    function mergeTwoObjects(left, right) {
        if (typeOf(left) === typeOf(right) && typeOf(right) === "object") {
            return Object.keys(right)
                .reduce(function (result, rightKey) {
                result[rightKey] = mergeTwoObjects(result[rightKey], right[rightKey]);
                return result;
            }, left);
        }
        else {
            if (typeOf(right) === "null") {
                return typeOf(left) === "undefined" ? right : left;
            }
            else {
                return right;
            }
        }
    }
    function typeOf(value) {
        return value === null ? "null" : typeof value;
    }
    function generateGuid2(prefix, length) {
        return (prefix || "") + Array.prototype.reduce.call((crypto).getRandomValues(new Uint32Array(length || 4)), function (p, i) {
            return (p.push(i.toString(18)), p);
        }, []).join("-");
    }
    Util.generateGuid2 = generateGuid2;
    function generateGuid(prefix, length) {
        return ((prefix || "") + Array.prototype
            .reduce.call(crypto.getRandomValues(new Uint32Array(length || 4)), function (p, i) {
            return p.push(i.toString(36)), p;
        }, [])
            .join("-"));
    }
    Util.generateGuid = generateGuid;
    function getObjectAPI(obj, prefix) {
        function ns(obj, px) {
            var keys = Object.keys(obj);
            if (keys.length == 0) {
                if (px.length) {
                    return [px.join(".")];
                }
                return [];
            }
            return keys.reduce(function (p, key) {
                return p.concat(ns(obj[key], px.concat([key])));
            }, []);
        }
        return ns(obj, prefix ? [prefix] : []);
    }
    Util.getObjectAPI = getObjectAPI;
    function resolveName(name, obj) {
        return name.split(".").reduce(function (p, n) {
            return p && p[n];
        }, obj);
    }
    Util.resolveName = resolveName;
    function injectScriptsSequentially(tabId, injectionDetailsArr, extensionConfig, ulData) {
        var injectingScript = function (injectDetails) {
            return new Promise(function (resolve, reject) {
                chrome.tabs.executeScript(tabId, injectDetails, function (result) {
                    if (chrome.runtime.lastError) {
                        if (ulData) {
                            ask.apps.ul.fireErrorEvent(extensionConfig.buildVars.unifiedLoggingUrl, { message: ulData.message + " " + chrome.runtime.lastError.message, topic: ulData.topic }, extensionConfig, null);
                        }
                        reject("failed to inject " + JSON.stringify(injectDetails) + " due to " + chrome.runtime.lastError);
                        return;
                    }
                    resolve(result);
                    return;
                });
            });
        };
        var injectionResult = [];
        return injectionDetailsArr
            .reduce(function (promiseChain, injectionDetails) { return promiseChain
            .then(function () {
            return injectingScript(injectionDetails);
        })
            .then(function (result) {
            injectionResult.push(result[0]);
        }); }, Promise.resolve())
            .then(function () { return Promise.resolve(injectionResult); });
    }
    Util.injectScriptsSequentially = injectScriptsSequentially;
    Util.clone = function (obj) {
        return JSON.parse(JSON.stringify(obj));
    };
    function generateToolbarId() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            var r = (Math.random() * 16) | 0, v = c == "x" ? r : (r & 0x3) | 0x8, hexString = v.toString(16);
            return hexString.toUpperCase();
        });
    }
    Util.generateToolbarId = generateToolbarId;
    function checkOverlap(arr1, arr2) {
        return arr1.some(function (arr1Elem) { return !!~arr2.indexOf(arr1Elem); });
    }
    Util.checkOverlap = checkOverlap;
    function getDateDiffInMonths(d1, d2) {
        var millisecInMonth = 2592000000;
        return Math.floor(Math.abs(d1.valueOf() - d2.valueOf()) / millisecInMonth);
    }
    Util.getDateDiffInMonths = getDateDiffInMonths;
    function getCobrandFromPartnerId(partnerId, defaultCobrand) {
        if (partnerId && partnerId.split("^")[1]) {
            return (partnerId.split("^")[1]);
        }
        return defaultCobrand;
    }
    Util.getCobrandFromPartnerId = getCobrandFromPartnerId;
    function isBing(config) {
        var searchDomain = config.buildVars.searchDomain;
        return searchDomain.toLowerCase().indexOf("bing.com") > -1;
    }
    Util.isBing = isBing;
    function getSearchDomain(config) {
        return isBing(config) ? "bing" : "not-bing";
    }
    Util.getSearchDomain = getSearchDomain;
    function getB2BValidPartnerId(partnerId) {
        var geoParamAbsentRe = new RegExp('^(\\^.*?){3}\\^$');
        if (geoParamAbsentRe.test(partnerId)) {
            return partnerId + "99";
        }
        return partnerId;
    }
    Util.getB2BValidPartnerId = getB2BValidPartnerId;
})(Util || (Util = {}));
