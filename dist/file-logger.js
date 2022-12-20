"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileLogger = void 0;
const tslib_1 = require("tslib");
require("@nivinjoseph/n-ext");
const moment = require("moment-timezone");
const n_defensive_1 = require("@nivinjoseph/n-defensive");
const Fs = require("fs");
const Path = require("path");
const n_util_1 = require("@nivinjoseph/n-util");
const base_logger_1 = require("./base-logger");
const log_prefix_1 = require("./log-prefix");
// public
class FileLogger extends base_logger_1.BaseLogger {
    /**
     *
     * @param logDateTimeZone Default is LogDateTimeZone.utc
     * @param useJsonFormat Default is false
     */
    constructor(config) {
        super(config);
        this._mutex = new n_util_1.Mutex();
        this._lastPurgedAt = 0;
        const { logDirPath, retentionDays } = config;
        (0, n_defensive_1.given)(logDirPath, "logDirPath").ensureHasValue().ensureIsString()
            .ensure(t => Path.isAbsolute(t), "must be absolute");
        (0, n_defensive_1.given)(retentionDays, "retentionDays").ensureHasValue().ensureIsNumber().ensure(t => t > 0);
        this._retentionDays = Number.parseInt(retentionDays.toString());
        if (!Fs.existsSync(logDirPath))
            Fs.mkdirSync(logDirPath);
        this._logDirPath = logDirPath;
    }
    logDebug(debug) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.env === "dev")
                yield this._writeToLog(log_prefix_1.LogPrefix.debug, debug);
        });
    }
    logInfo(info) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this._writeToLog(log_prefix_1.LogPrefix.info, info);
        });
    }
    logWarning(warning) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this._writeToLog(log_prefix_1.LogPrefix.warning, this.getErrorMessage(warning));
        });
    }
    logError(error) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this._writeToLog(log_prefix_1.LogPrefix.error, this.getErrorMessage(error));
        });
    }
    _writeToLog(status, message) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            (0, n_defensive_1.given)(status, "status").ensureHasValue().ensureIsEnum(log_prefix_1.LogPrefix);
            (0, n_defensive_1.given)(message, "message").ensureHasValue().ensureIsString();
            const dateTime = this.getDateTime();
            if (this.useJsonFormat) {
                let level = "";
                switch (status) {
                    case log_prefix_1.LogPrefix.debug:
                        level = "Debug";
                        break;
                    case log_prefix_1.LogPrefix.info:
                        level = "Info";
                        break;
                    case log_prefix_1.LogPrefix.warning:
                        level = "Warn";
                        break;
                    case log_prefix_1.LogPrefix.error:
                        level = "Error";
                        break;
                }
                let log = {
                    source: this.source,
                    service: this.service,
                    env: this.env,
                    level: level,
                    message,
                    dateTime,
                    time: new Date().toISOString()
                };
                this.injectTrace(log, level === "Error");
                if (this.logInjector)
                    log = this.logInjector(log);
                message = JSON.stringify(log);
            }
            else {
                message = `${dateTime} ${status} ${message}`;
            }
            const logFileName = `${dateTime.substr(0, 13)}.log`;
            const logFilePath = Path.join(this._logDirPath, logFileName);
            yield this._mutex.lock();
            try {
                yield Fs.promises.appendFile(logFilePath, `\n${message}`);
                yield this._purgeLogs();
            }
            catch (error) {
                console.error(error);
            }
            finally {
                this._mutex.release();
            }
        });
    }
    _purgeLogs() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const now = Date.now();
            if (this._lastPurgedAt && this._lastPurgedAt > (now - n_util_1.Duration.fromDays(this._retentionDays).toMilliSeconds()))
                return;
            const files = yield n_util_1.Make.callbackToPromise(Fs.readdir)(this._logDirPath);
            yield files.forEachAsync((file) => tslib_1.__awaiter(this, void 0, void 0, function* () {
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