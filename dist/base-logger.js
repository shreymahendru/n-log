"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseLogger = void 0;
const n_exception_1 = require("@nivinjoseph/n-exception");
const log_date_time_zone_1 = require("./log-date-time-zone");
const moment = require("moment-timezone");
const n_config_1 = require("@nivinjoseph/n-config");
class BaseLogger {
    /**
     *
     * @param logDateTimeZone Default is LogDateTimeZone.utc
     * @param useJsonFormat Default is false
     * @param logInjector Only valid when useJsonFormat is true
     */
    constructor(config) {
        var _a;
        this._source = "nodejs";
        this._service = (_a = n_config_1.ConfigurationManager.getConfig("package.name")) !== null && _a !== void 0 ? _a : n_config_1.ConfigurationManager.getConfig("package_name");
        this._env = n_config_1.ConfigurationManager.getConfig("env").toLowerCase();
        // eslint-disable-next-line @typescript-eslint/unbound-method
        const { logDateTimeZone, useJsonFormat, logInjector } = config !== null && config !== void 0 ? config : {};
        if (!logDateTimeZone || logDateTimeZone.isEmptyOrWhiteSpace() ||
            ![log_date_time_zone_1.LogDateTimeZone.utc, log_date_time_zone_1.LogDateTimeZone.local, log_date_time_zone_1.LogDateTimeZone.est, log_date_time_zone_1.LogDateTimeZone.pst].contains(logDateTimeZone)) {
            this._logDateTimeZone = log_date_time_zone_1.LogDateTimeZone.utc;
        }
        else {
            this._logDateTimeZone = logDateTimeZone;
        }
        this._useJsonFormat = !!useJsonFormat;
        this._logInjector = logInjector !== null && logInjector !== void 0 ? logInjector : null;
    }
    get source() { return this._source; }
    get service() { return this._service; }
    get env() { return this._env; }
    get useJsonFormat() { return this._useJsonFormat; }
    get logInjector() { return this._logInjector; }
    getErrorMessage(exp) {
        let logMessage = "";
        try {
            if (exp instanceof n_exception_1.Exception)
                logMessage = exp.toString();
            else if (exp instanceof Error)
                logMessage = exp.stack;
            else
                logMessage = exp.toString();
        }
        catch (error) {
            console.warn(error);
            logMessage = "There was an error while attempting to log another error. Check earlier logs for a warning.";
        }
        return logMessage;
    }
    getDateTime() {
        let result = null;
        switch (this._logDateTimeZone) {
            case log_date_time_zone_1.LogDateTimeZone.utc:
                result = moment().utc().format();
                break;
            case log_date_time_zone_1.LogDateTimeZone.local:
                result = moment().format();
                break;
            case log_date_time_zone_1.LogDateTimeZone.est:
                result = moment().tz("America/New_York").format();
                break;
            case log_date_time_zone_1.LogDateTimeZone.pst:
                result = moment().tz("America/Los_Angeles").format();
                break;
            default:
                result = moment().utc().format();
                break;
        }
        return result;
    }
}
exports.BaseLogger = BaseLogger;
//# sourceMappingURL=base-logger.js.map