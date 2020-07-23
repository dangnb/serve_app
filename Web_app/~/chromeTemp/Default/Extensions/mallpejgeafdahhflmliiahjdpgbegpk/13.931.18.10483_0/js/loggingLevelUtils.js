var LoggingLevelUtils = (function () {
    function LoggingLevelUtils() {
    }
    LoggingLevelUtils.extensionState = new ChromeStorage(chrome.storage.local, "state");
    LoggingLevelUtils.setLogginLevel = function (config, remoteLoggingConfig) {
        Logger.log("LoggingLevelUtils: loadRemoteConfig: remote logging config " + JSON.stringify(remoteLoggingConfig));
        if (!remoteLoggingConfig || !remoteLoggingConfig.default) {
            ask.apps.ul.fireInfoEvent(config.buildVars.unifiedLoggingUrl, {
                message: "could not read URL. Fallback to default logging level from config",
                topic: "remote logging level set up",
                data1: TextTemplate.parse(config.buildVars.loggingLevelConfigUrl, config.state.replaceableParams)
            }, config, "LoggingLevel");
        }
        else {
            if (!config.state.loggingLevel) {
                config.state.loggingLevel = {};
            }
            config.state.loggingLevel.default = remoteLoggingConfig.default;
            config.state.loggingLevel.features = remoteLoggingConfig.features;
        }
        LoggingLevelUtils.extensionState.update(config.state);
    };
    LoggingLevelUtils.loadRemoteConfig = function (config) {
        var remoteLoggingConfigUrl = TextTemplate.parse(config.buildVars.loggingLevelConfigUrl, config.state.replaceableParams);
        new RemoteConfigLoader(config, "loggingConfig", function (remoteLoggingConfig) { return LoggingLevelUtils.setLogginLevel(config, remoteLoggingConfig); })
            .initConfigLoader(remoteLoggingConfigUrl)
            .then(function (remoteLoggingConfig) { return LoggingLevelUtils.setLogginLevel(config, remoteLoggingConfig); })
            .catch(function (err) {
            Logger.warn("LoggingLevelUtils: loadRemoteConfig ", err);
            LoggingLevelUtils.setLogginLevel(config, null);
        });
        return Promise.resolve(config);
    };
    return LoggingLevelUtils;
}());
