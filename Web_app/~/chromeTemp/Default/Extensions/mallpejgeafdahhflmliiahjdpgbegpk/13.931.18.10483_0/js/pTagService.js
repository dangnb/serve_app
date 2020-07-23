"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var PTagService = (function () {
    function PTagService(extensionConfig, onSearchParamsUpdate) {
        var _this = this;
        this.getSchedulerOptions = function (nextCall) {
            return {
                maxRetries: 10,
                initialRetryIntervalMS: 1000,
                when: nextCall
            };
        };
        this.onSchedule = function () {
            return _this.requestPTagService()
                .then(_this.handlePTagServiceResponse)
                .catch(function (error) {
                Logger.warn(error);
                ask.apps.ul.fireErrorEvent(_this.extensionConfig.buildVars.unifiedLoggingUrl, {
                    message: "on-error",
                    topic: "ptag-service",
                    data1: _this.getPTagServiceUrl(_this.extensionConfig),
                    data2: error
                }, _this.extensionConfig, "PTagService").catch(Logger.log);
                return Promise.resolve(false);
            });
        };
        this.getPTagServiceUrl = function (config) {
            var cobrand = Util.getCobrandFromPartnerId(config.state.toolbarData.partnerId, config.buildVars.coId);
            var source = PTagService.getSourceValue(config);
            var vendorId = config.state.toolbarData.vendorId || PTagService.getDefaultVendorId();
            var url = config.buildVars.pTagServiceUrl;
            var installDateForPTagService = PTagService.getFormattedInstallDate(config.state.toolbarData.installDate);
            var track = config.buildVars.track;
            return url + "?cobrand=" + cobrand + "&vendor=" + vendorId + "&installDate=" + installDateForPTagService + "&source=" + source + "&track=" + track;
        };
        this.requestPTagService = function () {
            var reqProps = {
                url: _this.getPTagServiceUrl(_this.extensionConfig),
                responseType: "json"
            };
            return AJAX.get(reqProps).then(function (xhr) {
                Logger.log("ptagservice: requestPTagService -- url: " + reqProps.url + " response: " + JSON.stringify(xhr.response));
                return Promise.resolve(xhr.response);
            });
        };
        this.handlePTagServiceResponse = function (pTagServiceResponse) {
            if (!pTagServiceResponse || !pTagServiceResponse.searchParams || typeof pTagServiceResponse.ttl !== 'number') {
                return Promise.reject(new Error("Invalid response from server: \"" + pTagServiceResponse + "\""));
            }
            var newState = {
                nextCall: Date.now() + pTagServiceResponse.ttl * 1000,
                ttl: pTagServiceResponse.ttl
            };
            return _this.stateStorage.get().then(function (savedState) {
                return _this.stateStorage.set(newState).then(function () {
                    var isTTLChanged = savedState ? newState.ttl !== savedState.ttl : true;
                    return _this.onSearchParamsUpdate(pTagServiceResponse.searchParams, pTagServiceResponse.ttl, isTTLChanged).then(function () {
                        _this.scheduler.setAlarm(_this.getSchedulerOptions(newState.nextCall));
                        return Promise.resolve(true);
                    });
                });
            });
        };
        this.extensionConfig = extensionConfig;
        this.onSearchParamsUpdate = onSearchParamsUpdate;
        this.stateStorage = new ChromeStorage(chrome.storage.local, "pTagService");
        this.stateStorage.get().then(function (savedState) {
            if (savedState === void 0) { savedState = PTagService.initialState; }
            _this.scheduler = new Scheduler("pTagServiceCheck", _this.onSchedule, Logger.log);
            _this.scheduler.setAlarm(_this.getSchedulerOptions(savedState.nextCall));
        });
    }
    ;
    PTagService.getSourceValue = function (config) {
        return this.isDSExtension(config) ? 'OMNI' : 'WTT';
    };
    PTagService.getDefaultVendorId = function () {
        return '';
    };
    PTagService.getDefaultSearchParams = function (config) {
        return {
            PC: this.getDefaultPCValue(config),
            FORM: this.getDefaultFormValue(config),
            PTAG: this.getDefaultPTagValue(config)
        };
    };
    PTagService.isDSExtension = function (config) {
        return (typeof config.buildVars['settingsOverrides'] !== 'undefined');
    };
    PTagService.getDefaultFormValue = function (config) {
        return this.isDSExtension(config) ? 'IASE01' : 'IAW000';
    };
    PTagService.getDefaultPTagValue = function (config) {
        return this.isDSExtension(config) ? 'IAC10000000029' : 'IAC10000000019';
    };
    PTagService.getDefaultPCValue = function (config) {
        return this.isDSExtension(config) ? 'IASE' : 'IAWT';
    };
    PTagService.getToolbarDataWithSearchParams = function (config) {
        if (config.state.toolbarData.searchParams && config.state.toolbarData.vendorId) {
            return config.state.toolbarData;
        }
        var defaultVendorId = PTagService.getDefaultVendorId();
        var defaultSearchParams = PTagService.getDefaultSearchParams(config);
        var updatedToolbarData = __assign({}, config.state.toolbarData);
        updatedToolbarData.vendorId = updatedToolbarData.vendorId ? updatedToolbarData.vendorId : defaultVendorId;
        updatedToolbarData.searchParams = this.isValidSearchParamsString(updatedToolbarData.searchParams) ? updatedToolbarData.searchParams : JSON.stringify(defaultSearchParams);
        return updatedToolbarData;
    };
    PTagService.getSearchParamsRedirectUrlAdaptor = function (config, defaultCreateRedirectUrlFunc) {
        return function (config, urlStrIn) {
            var toolbarDataWithSearchParams = PTagService.getToolbarDataWithSearchParams(config);
            var searchParams = JSON.parse(toolbarDataWithSearchParams.searchParams);
            var urlWithoutSearchParams = defaultCreateRedirectUrlFunc(config, urlStrIn);
            return Object.keys(searchParams).reduce(function (prev, searchParamName) {
                return UrlUtils.appendParamToUrl(prev, searchParamName, searchParams[searchParamName]);
            }, urlWithoutSearchParams);
        };
    };
    PTagService.isValidSearchParamsString = function (searchParams) {
        try {
            var o = JSON.parse(searchParams);
            return (o && typeof o === "object" && !Array.isArray(o));
        }
        catch (e) {
            return false;
        }
    };
    PTagService.initialState = {
        nextCall: 0,
        ttl: 0
    };
    PTagService.getFormattedInstallDate = function (installDate) {
        return installDate.slice(0, 8);
    };
    return PTagService;
}());
