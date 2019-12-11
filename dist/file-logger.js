"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const n_exception_1 = require("@nivinjoseph/n-exception");
const n_config_1 = require("@nivinjoseph/n-config");
const moment = require("moment-timezone");
const log_date_time_zone_1 = require("./log-date-time-zone");
require("@nivinjoseph/n-ext");
const n_defensive_1 = require("@nivinjoseph/n-defensive");
const Fs = require("fs");
const Path = require("path");
const n_util_1 = require("@nivinjoseph/n-util");
class FileLogger {
    constructor(logDirPath, logDateTimeZone) {
        this._mutex = new n_util_1.Mutex();
        n_defensive_1.given(logDirPath, "logDirPath").ensureHasValue().ensureIsString()
            .ensure(t => Path.isAbsolute(t), "must be absolute");
        if (!Fs.existsSync(logDirPath))
            Fs.mkdirSync(logDirPath);
        this._logDirPath = logDirPath;
        if (!logDateTimeZone || logDateTimeZone.isEmptyOrWhiteSpace() ||
            ![log_date_time_zone_1.LogDateTimeZone.utc, log_date_time_zone_1.LogDateTimeZone.local, log_date_time_zone_1.LogDateTimeZone.est, log_date_time_zone_1.LogDateTimeZone.pst].contains(logDateTimeZone)) {
            this._logDateTimeZone = log_date_time_zone_1.LogDateTimeZone.utc;
        }
        else {
            this._logDateTimeZone = logDateTimeZone;
        }
        this._lastPurgedAt = 0;
    }
    logDebug(debug) {
        return __awaiter(this, void 0, void 0, function* () {
            if (n_config_1.ConfigurationManager.getConfig("env") === "dev")
                yield this.writeToLog(`DEBUG: ${debug}`);
        });
    }
    logInfo(info) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.writeToLog(`INFO: ${info}`);
        });
    }
    logWarning(warning) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.writeToLog(`WARNING: ${warning}`);
        });
    }
    logError(error) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.writeToLog(`ERROR: ${this.getErrorMessage(error)}`);
        });
    }
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
            logMessage = "There was an error while attempting to log another error.";
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
    writeToLog(message) {
        return __awaiter(this, void 0, void 0, function* () {
            n_defensive_1.given(message, "message").ensureHasValue().ensureIsString();
            const dateTime = this.getDateTime();
            const logFileName = `${dateTime.substr(0, 13)}.log`;
            const logFilePath = Path.join(this._logDirPath, logFileName);
            yield this._mutex.lock();
            try {
                yield n_util_1.Make.callbackToPromise(Fs.appendFile)(logFilePath, `\n${dateTime} ${message}`);
                yield this.purgeLogs();
            }
            catch (error) {
                console.error(error);
            }
            finally {
                this._mutex.release();
            }
        });
    }
    purgeLogs() {
        return __awaiter(this, void 0, void 0, function* () {
            const now = Date.now();
            if (this._lastPurgedAt && this._lastPurgedAt > (now - n_util_1.Duration.fromDays(7)))
                return;
            const files = yield n_util_1.Make.callbackToPromise(Fs.readdir)(this._logDirPath);
            yield files.forEachAsync((file) => __awaiter(this, void 0, void 0, function* () {
                const filePath = Path.join(this._logDirPath, file);
                const stats = yield n_util_1.Make.callbackToPromise(Fs.stat)(filePath);
                if (stats.isFile() && moment(stats.birthtime).valueOf() < (now - n_util_1.Duration.fromDays(7)))
                    yield n_util_1.Make.callbackToPromise(Fs.unlink)(filePath);
            }), 1);
            this._lastPurgedAt = now;
        });
    }
}
exports.FileLogger = FileLogger;
//# sourceMappingURL=file-logger.js.map