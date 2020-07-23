"use strict";
var Scheduler = (function () {
    function Scheduler(alarmName, onSchedule, onInfoEvent) {
        var _this = this;
        this.retryCounter = 0;
        this.setAlarm = function (options) {
            _this.options = options;
            if (!chrome.alarms.onAlarm.hasListener(_this.onChromeAlarm)) {
                chrome.alarms.onAlarm.addListener(_this.onChromeAlarm);
            }
            _this.scheduleAlarm();
        };
        this.onChromeAlarm = function (alarm) {
            if (alarm.name === _this.alarmName) {
                _this.onAlarm();
            }
        };
        this.onAlarm = function () {
            _this.onSchedule().then(function (isSuccess) {
                if (!isSuccess) {
                    _this.onActionFailure();
                    return;
                }
                _this.onActionSuccess();
            });
        };
        this.scheduleAlarm = function () {
            var retryInterval = _this.getRetryInterval(_this.retryCounter, _this.options.initialRetryIntervalMS, Scheduler.MAX_RETRY_INTERVAL_IN_MS);
            var when = _this.isValidDateInFuture(_this.options.when) ? _this.options.when : Date.now() + retryInterval;
            chrome.alarms.get(_this.alarmName, function (alarm) {
                if (alarm) {
                    Logger.log("scheduler: " + _this.alarmName + " will fire in " + _this.getDurationTillNextCheck(alarm.scheduledTime));
                    return;
                }
                if (when - Date.now() > 60000) {
                    _this.scheduleChromeAlarm(when);
                    return;
                }
                _this.schedulerTimeoutAlarm(when);
            });
        };
        this.schedulerTimeoutAlarm = function (when) {
            Logger.log("scheduler: Setting the " + _this.alarmName + " to " + when + " (" + _this.getDurationTillNextCheck(when) + ")");
            if (when - Date.now() <= 0) {
                _this.onAlarm();
                return;
            }
            clearTimeout(_this.timeout);
            _this.timeout = window.setTimeout(function () {
                _this.onAlarm();
            }, when - Date.now());
            _this.onInfoEvent({
                message: "timeout-alarm-scheduled",
                topic: "scheduler-" + _this.alarmName,
                data1: (new Date()).toISOString(),
                data2: "" + _this.getDurationTillNextCheck(when),
            });
        };
        this.scheduleChromeAlarm = function (when) {
            Logger.log("scheduler: Setting the " + _this.alarmName + " to " + when + " (" + _this.getDurationTillNextCheck(when) + ")");
            chrome.alarms.create(_this.alarmName, {
                when: when
            });
            _this.onInfoEvent({
                message: "chrome-alarm-scheduled",
                topic: "scheduler-" + _this.alarmName,
                data1: (new Date()).toISOString(),
                data2: "" + _this.getDurationTillNextCheck(when),
            });
        };
        this.isValidDateInFuture = function (when) {
            return when && (when - Date.now() >= 0);
        };
        this.getRetryInterval = function (retryCounter, initialRetryIntervalMS, maxRetryInterval) {
            if (retryCounter === 0) {
                return 0;
            }
            return Math.min(initialRetryIntervalMS * Math.pow(2, retryCounter), maxRetryInterval);
        };
        this.getDurationTillNextCheck = function (nextCheck) {
            if (nextCheck && nextCheck > Date.now()) {
                return DateTimeUtils.millisecondsToDuration(nextCheck - Date.now());
            }
            return "0s";
        };
        this.onActionFailure = function () {
            _this.retryCounter += 1;
            _this.scheduleAlarm();
        };
        this.onActionSuccess = function () {
            _this.retryCounter = 0;
        };
        this.alarmName = alarmName;
        this.onSchedule = onSchedule;
        this.onInfoEvent = onInfoEvent;
    }
    ;
    Scheduler.MAX_RETRY_INTERVAL_IN_MS = 3600 * 24 * 1000;
    return Scheduler;
}());
