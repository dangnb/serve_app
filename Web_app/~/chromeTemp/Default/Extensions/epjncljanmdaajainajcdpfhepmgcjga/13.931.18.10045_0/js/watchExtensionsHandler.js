var WatchExtensionsHandler = (function () {
    function WatchExtensionsHandler() {
        var _this = this;
        this.init = function (config) {
            Logger.log("WatchExtensionsHandler: watching extensions with " + WatchExtensionsHandler.permissionsToMonitor + " permissions");
            var initWatchExtensions = function () {
                var getEmptyWatchExtensionsObject = function () {
                    var watchExtensions = {};
                    if (~WatchExtensionsHandler.permissionsToMonitor.indexOf(WatchExtensionsHandler.defaultSearchPermission)) {
                        watchExtensions[WatchExtensionsHandler.defaultSearchPermission] = {
                            isDefault: null,
                            stackOfExtensions: []
                        };
                    }
                    if (~WatchExtensionsHandler.permissionsToMonitor.indexOf(WatchExtensionsHandler.defaultNewTabPermission)) {
                        watchExtensions[WatchExtensionsHandler.defaultNewTabPermission] = {
                            isDefault: null,
                            stackOfExtensions: []
                        };
                    }
                    return watchExtensions;
                };
                return new Promise(function (resolve) {
                    chrome.management.getAll(function (extensionInfos) {
                        var watchExtensions = getEmptyWatchExtensionsObject();
                        extensionInfos
                            .filter(function (eInfo) {
                            return eInfo.type === "extension" &&
                                eInfo.id !== chrome.runtime.id &&
                                Util.checkOverlap(eInfo.permissions, WatchExtensionsHandler.permissionsToMonitor);
                        })
                            .forEach(function (eInfo) {
                            WatchExtensionsHandler.permissionsToMonitor
                                .filter(function (monitorPermission) { return ~eInfo.permissions.indexOf(monitorPermission); })
                                .forEach(function (permission) {
                                watchExtensions[permission].stackOfExtensions.push({
                                    id: eInfo.id,
                                    version: eInfo.version,
                                    enabled: eInfo.enabled
                                });
                            });
                        });
                        Object.keys(watchExtensions)
                            .forEach(function (installedWatchExtensionsKey) {
                            watchExtensions[installedWatchExtensionsKey].isDefault = true;
                            watchExtensions[installedWatchExtensionsKey].stackOfExtensions.push({
                                id: chrome.runtime.id,
                                version: config.buildVars.version,
                                enabled: true
                            });
                        });
                        _this.watchExtensionStateStorage.set(watchExtensions).catch(Logger.warn);
                        Logger.log("WatchExtensionsHandler: extension has management permission. Currently following extensions installed: " + JSON.stringify(watchExtensions, null, 2));
                        resolve(config);
                    });
                });
            };
            return chrome.management && chrome.management.getAll
                ? initWatchExtensions()
                : Promise.resolve(config);
        };
        this.startListening = function (config) {
            _this.extensionConfig = config;
            if (chrome.management && chrome.management.getAll) {
                chrome.management.onInstalled.addListener(_this.onInstalledHandler);
                chrome.management.onUninstalled.addListener(_this.onUninstalledHandler);
                chrome.management.onEnabled.addListener(_this.onEnabledHandler);
                chrome.management.onDisabled.addListener(_this.onDisabledHandler);
            }
        };
        this.watchExtensionStateStorage = new ChromeStorage(chrome.storage.local, "watchExtensions");
        this.onInstalledHandler = function (extensionInfo) {
            Logger.log("WatchExtensionsHandler: installed extension", extensionInfo);
            _this.watchExtensionStateStorage.get()
                .then(function (watchExtensions) {
                var defaultOverrideLost = [];
                WatchExtensionsHandler.permissionsToMonitor.filter(function (permission) { return ~extensionInfo.permissions.indexOf(permission); })
                    .forEach(function (permission) {
                    if (watchExtensions[permission].isDefault) {
                        watchExtensions[permission].isDefault = false;
                        defaultOverrideLost.push(permission);
                    }
                    Logger.log("WatchExtensionsHandler: installed extension is default for: " + permission);
                    watchExtensions[permission].stackOfExtensions.push({
                        id: extensionInfo.id,
                        version: extensionInfo.version,
                        enabled: true
                    });
                });
                _this.watchExtensionStateStorage.set(watchExtensions);
                defaultOverrideLost.forEach(function (defaultOverride) {
                    _this.fireULWithChangeDetails(defaultOverride, "lost");
                });
            });
        };
        this.onUninstalledHandler = function (uninstalledExtensionId) {
            Logger.log("WatchExtensionsHandler: uninstalled extension " + uninstalledExtensionId);
            _this.iterateOverInstalledExtensions(function (overrideStatus) {
                var elementToRemoveFound = false;
                for (var i = 0; i < overrideStatus.stackOfExtensions.length; i += 1) {
                    if (!elementToRemoveFound && overrideStatus.stackOfExtensions[i].id === uninstalledExtensionId) {
                        elementToRemoveFound = true;
                    }
                    if (elementToRemoveFound) {
                        overrideStatus.stackOfExtensions[i] = overrideStatus.stackOfExtensions[i + 1];
                    }
                }
                if (elementToRemoveFound) {
                    overrideStatus.stackOfExtensions.length = overrideStatus.stackOfExtensions.length - 1;
                }
                if (_this.extensionIsDefault(overrideStatus.stackOfExtensions, chrome.runtime.id) && !overrideStatus.isDefault) {
                    overrideStatus.isDefault = true;
                    return "taken";
                }
            });
        };
        this.onEnabledHandler = function (extensionInfo) {
            Logger.log("WatchExtensionsHandler: enabled extension", extensionInfo);
            _this.iterateOverInstalledExtensions(function (overrideStatus) {
                var enabledExtension = overrideStatus.stackOfExtensions.find(function (info) { return info.id === extensionInfo.id; });
                if (!enabledExtension)
                    return;
                enabledExtension.enabled = true;
                if (!_this.extensionIsDefault(overrideStatus.stackOfExtensions, chrome.runtime.id) && overrideStatus.isDefault) {
                    overrideStatus.isDefault = false;
                    return "lost";
                }
            });
        };
        this.onDisabledHandler = function (extensionInfo) {
            Logger.log("WatchExtensionsHandler: disabled extension", extensionInfo);
            _this.iterateOverInstalledExtensions(function (overrideStatus) {
                var disabledExtension = overrideStatus.stackOfExtensions.find(function (info) { return info.id === extensionInfo.id; });
                if (!disabledExtension)
                    return;
                disabledExtension.enabled = false;
                if (_this.extensionIsDefault(overrideStatus.stackOfExtensions, chrome.runtime.id) && !overrideStatus.isDefault) {
                    overrideStatus.isDefault = true;
                    return "taken";
                }
            });
        };
        this.fireULWithChangeDetails = function (permission, defaultChange) {
            var overrideName = permission === WatchExtensionsHandler.defaultSearchPermission
                ? "defaultSearch"
                : "defaultNewTab";
            var eventData = {
                message: defaultChange,
                topic: overrideName
            };
            ask.apps.ul.fireInfoEvent(_this.extensionConfig.buildVars.unifiedLoggingUrl, eventData, _this.extensionConfig, "WatchExtension").catch(Logger.warn);
            Logger.log("WatchExtensionsHandler: firing UL message:" + eventData.message + " topic:" + eventData.topic);
        };
        this.extensionIsDefault = function (stack, id) {
            for (var i = stack.length - 1; i >= 0; i -= 1) {
                if (stack[i].id === id)
                    return true;
                if (stack[i].enabled)
                    break;
            }
            return false;
        };
        this.iterateOverInstalledExtensions = function (callback) {
            _this.watchExtensionStateStorage.get()
                .then(function (watchExtensions) {
                var defaultChanges = [];
                Object.keys(watchExtensions).forEach(function (permission) {
                    var change = callback(watchExtensions[permission]);
                    if (change) {
                        defaultChanges.push({ permission: permission, change: change });
                    }
                });
                _this.watchExtensionStateStorage.set(watchExtensions);
                defaultChanges.forEach(function (defaultChange) {
                    _this.fireULWithChangeDetails(defaultChange.permission, defaultChange.change);
                });
            });
        };
    }
    WatchExtensionsHandler.defaultSearchPermission = "searchProvider";
    WatchExtensionsHandler.defaultNewTabPermission = "newTabPageOverride";
    WatchExtensionsHandler.permissionsToMonitor = [WatchExtensionsHandler.defaultNewTabPermission];
    return WatchExtensionsHandler;
}());
