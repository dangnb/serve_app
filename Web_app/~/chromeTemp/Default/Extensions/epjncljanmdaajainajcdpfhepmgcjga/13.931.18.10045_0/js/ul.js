var ask;
(function (ask) {
    var apps;
    (function (apps) {
        var ul;
        (function (ul) {
            function createStandardData(eventName, config) {
                return {
                    anxa: "CAPNative",
                    anxv: config.buildVars.version,
                    anxe: eventName,
                    anxt: config.state.toolbarData.toolbarId,
                    anxtv: config.buildVars.version,
                    anxp: config.state.toolbarData.partnerId,
                    anxsi: config.state.toolbarData.partnerSubId,
                    anxd: config.buildVars.buildDate,
                    f: "00400000",
                    anxr: +new Date(),
                    coid: config.state.toolbarData.coId || config.buildVars.coId,
                    userSegment: config.state.toolbarData.userSegment
                };
            }
            function fireToolbarActiveEvent(url, eventSpecificData, config) {
                return fireEvent("ToolbarActive", url, eventSpecificData, config);
            }
            ul.fireToolbarActiveEvent = fireToolbarActiveEvent;
            function fireCEDisableEvent(url, eventSpecificData, config) {
                return fireEvent("CEDisable", url, eventSpecificData, config);
            }
            ul.fireCEDisableEvent = fireCEDisableEvent;
            function checkLevel(loggingType, config, featureName) {
                return (levelMap.get(loggingType) <= levelMap.get(getFeatureLoggingLevel(config, featureName)));
            }
            var levelMap = new Map([["Off", 0], ["Error", 100], ["Info", 200]]);
            function getFeatureLoggingLevel(config, featureName) {
                if (!featureName) {
                    return (config.state.loggingLevel && config.state.loggingLevel.default) || config.buildVars.defaultLoggingLevel.default;
                }
                if (!config.state.loggingLevel) {
                    return ((!!config.buildVars.defaultLoggingLevel.features) && (!!config.buildVars.defaultLoggingLevel.features[featureName]))
                        ? config.buildVars.defaultLoggingLevel.features[featureName]
                        : config.buildVars.defaultLoggingLevel.default;
                }
                return ((!!config.state.loggingLevel.features) && (!!config.state.loggingLevel.features[featureName]))
                    ? config.state.loggingLevel.features[featureName]
                    : config.state.loggingLevel.default;
            }
            function fireEvent(eventName, url, eventSpecificData, config) {
                var standardData = createStandardData(eventName, config);
                var combinedData = Util.mergeObjects(standardData, eventSpecificData);
                return AJAX.get({ url: url, data: combinedData, mimeType: "text/plain" });
            }
            function fireInfoEvent(url, eventSpecificData, config, featureName) {
                if (checkLevel("Info", config, featureName)) {
                    return fireEvent("Info", url, eventSpecificData, config);
                }
                return new Promise(function () {
                    setTimeout(function () { return Logger.warn("Event " + "INFO" + " Not Fired. " + eventSpecificData.message + " \n" + featureName + " " + eventSpecificData.data1 + " \n" + eventSpecificData.topic + " \n"); }, 10);
                });
            }
            ul.fireInfoEvent = fireInfoEvent;
            function fireErrorEvent(url, eventSpecificData, config, featureName) {
                if (checkLevel("Error", config, featureName)) {
                    return fireEvent("Error", url, eventSpecificData, config);
                }
                return new Promise(function () {
                    setTimeout(function () { return Logger.warn("Event " + "ERROR" + " Not Fired."); }, 10);
                });
            }
            ul.fireErrorEvent = fireErrorEvent;
            function firePixel(request) {
                return loadContent(request).then(function (respose) {
                    respose.close();
                    return Promise.resolve({ success: true });
                });
            }
            ul.firePixel = firePixel;
            function loadContent(request) {
                var url = request.url, timeout = request.timeout;
                if (window.location.href.indexOf(request.url) >= 0) {
                    Promise.reject(new Error("Cannot load \"" + url + "\" inside \"" + window.location.href + "\""));
                }
                return new Promise(function (resolve, reject) {
                    var iframe = document.createElement("iframe");
                    if (timeout) {
                        timeout = setTimeout(function () {
                            if (iframe) {
                                iframe.parentNode.removeChild(iframe);
                            }
                            reject(new Error("Load content timeout: \"" + url + "\""));
                        }, timeout);
                    }
                    iframe.addEventListener("load", function (e) {
                        !timeout || clearTimeout(timeout);
                        resolve({
                            url: url,
                            parentUrl: window.location.href,
                            timedout: false,
                            close: function () {
                                iframe.parentNode.removeChild(iframe);
                            }
                        });
                    }, true);
                    iframe.setAttribute("src", url);
                    document.body.appendChild(iframe);
                });
            }
            ul.loadContent = loadContent;
        })(ul = apps.ul || (apps.ul = {}));
    })(apps = ask.apps || (ask.apps = {}));
})(ask || (ask = {}));
