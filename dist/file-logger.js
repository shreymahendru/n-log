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
exports.FileLogger = void 0;
const n_config_1 = require("@nivinjoseph/n-config");
const moment = require("moment-timezone");
require("@nivinjoseph/n-ext");
const n_defensive_1 = require("@nivinjoseph/n-defensive");
const Fs = require("fs");
const Path = require("path");
const n_util_1 = require("@nivinjoseph/n-util");
const base_logger_1 = require("./base-logger");
const log_prefix_1 = require("./log-prefix");
// public
class FileLogger extends base_logger_1.BaseLogger {
    constructor(logDirPath, retentionDays, logDateTimeZone) {
        super(logDateTimeZone);
        this._mutex = new n_util_1.Mutex();
        this._lastPurgedAt = 0;
        (0, n_defensive_1.given)(logDirPath, "logDirPath").ensureHasValue().ensureIsString()
            .ensure(t => Path.isAbsolute(t), "must be absolute");
        (0, n_defensive_1.given)(retentionDays, "retentionDays").ensureHasValue().ensureIsNumber().ensure(t => t > 0);
        this._retentionDays = Number.parseInt(retentionDays.toString());
        if (!Fs.existsSync(logDirPath))
            Fs.mkdirSync(logDirPath);
        this._logDirPath = logDirPath;
    }
    logDebug(debug) {
        return __awaiter(this, void 0, void 0, function* () {
            if (n_config_1.ConfigurationManager.getConfig("env") === "dev")
                yield this.writeToLog(`${log_prefix_1.LogPrefix.debug} ${debug}`);
        });
    }
    logInfo(info) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.writeToLog(`${log_prefix_1.LogPrefix.info} ${info}`);
        });
    }
    logWarning(warning) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.writeToLog(`${log_prefix_1.LogPrefix.warning} ${this.getErrorMessage(warning)}`);
        });
    }
    logError(error) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.writeToLog(`${log_prefix_1.LogPrefix.error} ${this.getErrorMessage(error)}`);
        });
    }
    writeToLog(message) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, n_defensive_1.given)(message, "message").ensureHasValue().ensureIsString();
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
            if (this._lastPurgedAt && this._lastPurgedAt > (now - n_util_1.Duration.fromDays(this._retentionDays).toMilliSeconds()))
                return;
            const files = yield n_util_1.Make.callbackToPromise(Fs.readdir)(this._logDirPath);
            yield files.forEachAsync((file) => __awaiter(this, void 0, void 0, function* () {
                const filePath = Path.join(this._logDirPath, file);
                const stats = yield n_util_1.Make.callbackToPromise(Fs.stat)(filePath);
                if (stats.isFile() && moment(stats.birthtime).valueOf() < (now - n_util_1.Duration.fromDays(this._retentionDays).toMilliSeconds()))
                    yield n_util_1.Make.callbackToPromise(Fs.unlink)(filePath);
            }), 1);
            this._lastPurgedAt = now;
        });
    }
}
exports.FileLogger = FileLogger;
//# sourceMappingURL=file-logger.js.map