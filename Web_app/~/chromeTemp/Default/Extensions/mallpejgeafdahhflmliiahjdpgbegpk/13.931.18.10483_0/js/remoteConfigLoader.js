var RemoteConfigLoader = (function () {
    function RemoteConfigLoader(config, remoteConfigStorageName, onRemoteConfigUpdate) {
        var _this = this;
        this.fetchErrorCount = 0;
        this.initConfigLoader = function (configUrl) {
            Logger.log("RemoteConfigLoader: init called configUrl " + configUrl);
            _this.remoteConfigUrl = configUrl;
            return _this.initRemoteConfig()
                .then(_this.scheduleConfigRequest)
                .then(function () { return Promise.resolve(_this.remoteConfig); })
                .catch(function (err) {
                Logger.warn("RemoteConfigLoader: catched exception: scheduling remote config read");
                _this.fetchErrorCount += 1;
                _this.scheduleConfigRequest();
                return Promise.reject(err);
            });
        };
        this.initRemoteConfig = function () {
            return _this.remoteConfigStorage.get()
                .then(function (state) {
                if (state) {
                    _this.remoteConfig = state;
                    Logger.log("RemoteConfigLoader: this.remoteConfig is set to " + _this.remoteConfig);
                    return Promise.resolve();
                }
                Logger.log("RemoteConfigLoader: remoteConfig is not set.");
                return _this.updateRemoteConfig();
            });
        };
        this.updateRemoteConfig = function () {
            return _this.fetchConfig()
                .then(_this.setRemoteConfig);
        };
        this.fetchConfig = function () {
            return new Promise(function (resolve, reject) {
                if (!_this.remoteConfigUrl) {
                    ask.apps.ul.fireErrorEvent(_this.config.buildVars.unifiedLoggingUrl, {
                        message: "config-on-error",
                        topic: "remote-config-loader",
                        data1: null,
                        data2: "reason-missing-settings-url"
                    }, _this.config, "RemoteConfigLoader").catch(Logger.warn);
                    reject("missing-settings-url");
                    return;
                }
                Logger.log("RemoteConfigLoader: fetchConfig " + _this.remoteConfigUrl);
                AJAX.readConfigJSON(_this.remoteConfigUrl)
                    .then(function (config) {
                    if (!config) {
                        return Promise.reject("file does not exist: " + _this.remoteConfigUrl);
                    }
                    ask.apps.ul.fireInfoEvent(_this.config.buildVars.unifiedLoggingUrl, {
                        message: "config-on-after",
                        topic: "remote-config-loader",
                        data1: _this.remoteConfigUrl
                    }, _this.config, "RemoteConfigLoader").catch(Logger.warn);
                    resolve(config);
                })
                    .catch(function (err) {
                    Logger.warn("RemoteConfigLoader: error reading remote config", err);
                    ask.apps.ul.fireErrorEvent(_this.config.buildVars.unifiedLoggingUrl, {
                        message: "config-on-error",
                        topic: "remote-config-loader",
                        data1: _this.remoteConfigUrl,
                        data2: "reason-" + err
                    }, _this.config, "RemoteConfigLoader").catch(Logger.warn);
                    reject(err);
                });
            });
        };
        this.setRemoteConfig = function (remoteConfig) {
            Logger.log("RemoteConfigLoader: setRemoteConfig to " + JSON.stringify(remoteConfig));
            _this.remoteConfig = remoteConfig;
            _this.remoteConfig.lastFetched = Date.now();
            _this.fetchErrorCount = 0;
            return _this.remoteConfigStorage.set(_this.remoteConfig)
                .then(function () { return Promise.resolve(); });
        };
        this.scheduleConfigRequest = function () {
            var getWhenToFetchInCaseOfError = function () {
                var subsequentFailureMultiplier = Math.pow(2, _this.fetchErrorCount - 1);
                return Date.now() + subsequentFailureMultiplier * RemoteConfigLoader.retryIntervalOnFetchFailure;
            };
            var getWhenToFetchInCaseOfNoError = function () {
                var remoteConfigRefreshInterval = Math.max(RemoteConfigLoader.minFetchInterval, _this.remoteConfig && (_this.remoteConfig.refreshInterval || _this.remoteConfig.refreshIntervalInMS) || 0);
                return remoteConfigRefreshInterval + (_this.remoteConfig && _this.remoteConfig.lastFetched) || Date.now();
            };
            var nextFetch = _this.fetchErrorCount
                ? getWhenToFetchInCaseOfError()
                : getWhenToFetchInCaseOfNoError();
            Logger.log("RemoteConfigLoader: scheduleConfigRequest. Next alarm in in " + ~~(new Date(nextFetch - Date.now()).getTime() / 1000) + " seconds");
            chrome.alarms.create(_this.remoteConfigStorageName, { when: nextFetch });
        };
        this.remoteConfigStorageName = remoteConfigStorageName;
        this.remoteConfigStorage = new ChromeStorage(chrome.storage.local, remoteConfigStorageName);
        this.config = config;
        chrome.alarms.onAlarm.addListener(function (alarm) {
            if (alarm.name !== remoteConfigStorageName)
                return;
            Logger.log("RemoteConfigLoader: alarm " + alarm.name + " fired");
            _this.updateRemoteConfig()
                .then(function () {
                Logger.log("RemoteConfigLoader: remote config was set", _this.remoteConfig);
                _this.scheduleConfigRequest();
                onRemoteConfigUpdate(_this.remoteConfig);
            })
                .catch(function (err) {
                Logger.warn("RemoteConfigLoader: error reading remote config", err);
                _this.fetchErrorCount += 1;
                _this.scheduleConfigRequest();
            });
        });
    }
    RemoteConfigLoader.retryIntervalOnFetchFailure = 5 * 60 * 1000;
    RemoteConfigLoader.minFetchInterval = 24 * 60 * 60 * 1000;
    return RemoteConfigLoader;
}());
