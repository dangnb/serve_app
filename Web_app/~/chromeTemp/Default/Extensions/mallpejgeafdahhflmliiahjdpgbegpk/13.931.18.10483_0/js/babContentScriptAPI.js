var BabContentScriptAPI = (function () {
    function BabContentScriptAPI() {
        var _this = this;
        this.opacityLevel = 0.8;
        this.contentDivCSS = "\n                        vertical-align: middle; background-color: transparent;\n                        z-index: 9999999999; display: hidden;";
        this.opacityDivCSS = "z-index: 2147483627; position: fixed;\n                        top: 0; left: 0; background-color: rgb(0, 0, 0);\n                        opacity: {opacityLevel}; \n                        height: 100%; width: 100%; display: hidden;";
        this.contentDivHiddenCSS = "width: 0%; max-width: 100%; height: 0%;\n                        top: 0; left: 0;\n                        vertical-align: middle; background-color: transparent;  \n                        z-index: 9999999999; display: hidden;";
        this.opacityDivHiddenCSS = "z-index: 2147483627; position: fixed;\n                        top: 0; left: 0; background-color: rgb(0, 0, 0);\n                        height: 0%; width: 0%; display: hidden;";
        this.getBabContentScriptAPI = function () {
            if (!_this.babCSAvailableFeatures) {
                _this.babCSAvailableFeatures = [];
                Object.keys(_this.csAPI).forEach(function (featureName) {
                    _this.babCSAvailableFeatures.push({
                        name: featureName,
                        requiredArgs: _this.csAPI[featureName].getRequiredArgs(),
                        target: "babContentScript"
                    });
                });
            }
            return _this.babCSAvailableFeatures;
        };
        this.isFeatureCallValid = function (message) {
            var feature = _this.csAPI[message.name];
            if (!feature) {
                return false;
            }
            var argsArr = Object.keys(message.args || {});
            return !feature.getRequiredArgs().some(function (requiredArgName) { return !~argsArr.indexOf(requiredArgName); });
        };
        this.executeFeature = function (message) {
            if (!_this.isFeatureCallValid(message)) {
                return Promise.reject(new Error("invalid feature or required args are missing"));
            }
            return _this.csAPI[message.name].execute(message);
        };
        this.applyModalConfigOnCSS = function (css) {
            var buildCSSProp = function (propName, propValue) {
                if (!propName || !propValue)
                    return "";
                return propName + ":" + propValue + ";";
            };
            var defaultOverflowValue = "hidden";
            var defaultPositionValue = "fixed";
            var defaultCoordinatesCSS = "top:12%; left:25%;";
            var defaultSizeCSS = "width:50%; height:74%;";
            var overflowCSS = "overflow: {overflow};";
            var positionCSS = "position: {position};";
            if (!_this.modalConfig) {
                return css + defaultCoordinatesCSS + defaultSizeCSS +
                    overflowCSS.replace("{overflow}", defaultOverflowValue) +
                    positionCSS.replace("{position}", defaultPositionValue);
            }
            css += overflowCSS.replace("{overflow}", _this.modalConfig.overflow ? _this.modalConfig.overflow : defaultOverflowValue);
            css += positionCSS.replace("{position}", _this.modalConfig.position ? _this.modalConfig.position : defaultPositionValue);
            css += _this.modalConfig.coordinates
                ? ["left", "right", "top", "bottom"].reduce(function (result, coord) { return result + buildCSSProp(coord, _this.modalConfig.coordinates[coord]); }, "")
                : defaultCoordinatesCSS;
            css += _this.modalConfig.size
                ? ["width", "height"].reduce(function (result, length) { return result + buildCSSProp(length, _this.modalConfig.size[length]); }, "")
                : defaultSizeCSS;
            css += ["transform", "resize", "transition"].reduce(function (result, prop) { return result + buildCSSProp(prop, _this.modalConfig[prop]); }, "");
            return css;
        };
        this.loadInIframe = function (modalWindowType, args) {
            var createOpacity = function (modalConfig) {
                var opacityDivId = "bab-opacity";
                if (document.getElementById(opacityDivId) || (modalConfig && modalConfig.disableOpacity)) {
                    return Promise.resolve();
                }
                _this.opacityDiv = document.createElement("div");
                _this.opacityDiv.id = opacityDivId;
                if (modalConfig && modalConfig.opacity && !isNaN(Number(modalConfig.opacity))) {
                    _this.opacityLevel = modalConfig.opacity;
                }
                _this.opacityDiv.style.cssText = _this.opacityDivCSS.replace("{opacityLevel}", _this.opacityLevel.toString());
                document.body.appendChild(_this.opacityDiv);
                return Promise.resolve();
            };
            var createContentIframe = function (modalConfig) {
                var setIframeSrc = function () {
                    if (modalWindowType === "embedded-page") {
                        _this.contentIframe.src = chrome.runtime.getURL("babPage.html") + "?guid=" + encodeURIComponent(args.backgroundToken);
                    }
                    else if (modalWindowType === "iframe") {
                        if (args.replaceableParams) {
                            args.replaceableParams.tabtitle = window.document.title;
                            args.replaceableParams.taburl = window.document.location.href;
                            _this.contentIframe.src = TextTemplate.parse(args.iframeUrl, args.replaceableParams);
                        }
                        else {
                            _this.contentIframe.src = args.iframeUrl;
                        }
                    }
                };
                var contentIframeId = "bab-content-iframe";
                var contentDivId = "bab-content-div";
                if (!document || !document.body) {
                    return Promise.reject(new Error("missing document and/or body blocked content injection"));
                }
                var existingContentIframe = document.getElementById(contentIframeId);
                if (!existingContentIframe) {
                    _this.modalConfig = modalConfig;
                    _this.contentDiv = document.createElement("div");
                    _this.contentDiv.id = contentDivId;
                    _this.contentDiv.style.cssText = _this.applyModalConfigOnCSS(_this.contentDivCSS);
                    _this.contentIframe = document.createElement("iframe");
                    _this.contentIframe.id = contentIframeId;
                    _this.contentIframe.name = "bab-content";
                    _this.contentIframe.frameBorder = "0";
                    _this.contentIframe.scrolling = "no";
                    _this.contentIframe.style.cssText += ";width:99%;\n                        max-width: 100%; height:99%;\n                        overflow: hidden; background-color: transparent; z-index: 9999999999; display: hidden;";
                }
                setIframeSrc();
                return new Promise(function (resolve, reject) {
                    _this.contentIframe.onload = function () {
                        return resolve();
                    };
                    _this.contentIframe.onerror = function () {
                        console.warn("BrowserActionContentScript::onerror - error loading iframe");
                        return reject(new Error("error loading iframe"));
                    };
                    if (!existingContentIframe) {
                        _this.contentDiv.appendChild(_this.contentIframe);
                        document.body.appendChild(_this.contentDiv);
                    }
                });
            };
            var modalConfig = args.modalConfig;
            return Promise.all([createOpacity(modalConfig), createContentIframe(modalConfig)]).then(function () {
                return Promise.resolve({ data: "success" });
            });
        };
        this.csAPI = {
            "get-page-data": {
                getRequiredArgs: function () {
                    return [];
                },
                execute: function (babMessage) {
                    return Promise.resolve({
                        data: {
                            pageTitle: document.title,
                            pageUrl: location.href
                        }
                    });
                }
            },
            "hide-iframe": {
                getRequiredArgs: function () {
                    return [];
                },
                execute: function (babMessage) {
                    var setFocusOnWTTPage = function () {
                        var extensionStateName = "state";
                        chrome.storage.local.get(extensionStateName, function (data) {
                            if (!data)
                                return;
                            var state = data.state;
                            if (!state.toolbarData.newTabURL)
                                return;
                            if (~location.href.indexOf(new URL(state.toolbarData.newTabURL).hostname)) {
                                var searchInputs = document.getElementsByTagName("input");
                                if (searchInputs && searchInputs.length) {
                                    searchInputs[searchInputs.length - 1].focus();
                                }
                            }
                        });
                    };
                    if (!_this.contentIframe && !_this.opacityDiv) {
                        return Promise.reject(new Error("cannot hide bab elements"));
                    }
                    if (!!_this.opacityDiv) {
                        _this.opacityDiv.style.cssText = _this.opacityDivHiddenCSS;
                    }
                    if (!!_this.contentIframe) {
                        _this.contentDiv.style.cssText = _this.contentDivHiddenCSS;
                    }
                    setFocusOnWTTPage();
                    return Promise.resolve({ data: "success" });
                }
            },
            "open-new-tab": {
                getRequiredArgs: function () {
                    return [];
                },
                execute: function (babMessage) {
                    return Promise.reject(new Error("not implemented"));
                }
            },
            "show-iframe": {
                getRequiredArgs: function () {
                    return [];
                },
                execute: function (babMessage) {
                    if (!!_this.opacityDiv) {
                        _this.opacityDiv.style.cssText = _this.opacityDivCSS.replace("{opacityLevel}", _this.opacityLevel.toString());
                    }
                    if (!!_this.contentIframe) {
                        _this.contentIframe.focus();
                        _this.contentDiv.style.cssText = _this.applyModalConfigOnCSS(_this.contentDivCSS);
                        return Promise.resolve({ data: "success" });
                    }
                    return Promise.reject(new Error("cannot show bab elements"));
                }
            },
            "load-embedded-page-modal": {
                getRequiredArgs: function () {
                    return ["backgroundToken"];
                },
                execute: function (babMessage) {
                    return _this.loadInIframe("embedded-page", babMessage.args);
                }
            },
            "load-iframe-modal": {
                getRequiredArgs: function () {
                    return ["iframeUrl"];
                },
                execute: function (babMessage) {
                    return _this.loadInIframe("iframe", babMessage.args).then(function () {
                        return Promise.resolve({ data: _this.contentIframe.contentWindow });
                    });
                }
            },
            "get-remote-config": {
                getRequiredArgs: function () {
                    return [];
                },
                execute: function (babMessage) {
                    return new Promise(function (resolve) {
                        var babRemoteConfigStorageKey = "browserActionButton";
                        chrome.storage.local.get(babRemoteConfigStorageKey, function (data) {
                            resolve({ data: data.browserActionButton });
                        });
                    });
                }
            },
            "call-subsequent-bab-click-func": {
                getRequiredArgs: function () {
                    return [];
                },
                execute: function (babMessage) {
                    onBABClick(_this.csAPI["show-iframe"].execute);
                    return Promise.resolve({ data: "success" });
                }
            }
        };
    }
    return BabContentScriptAPI;
}());
