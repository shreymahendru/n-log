"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsoleLogger = void 0;
const base_logger_1 = require("./base-logger");
const log_prefix_1 = require("./log-prefix");
// public
class ConsoleLogger extends base_logger_1.BaseLogger {
    constructor() {
        super(...arguments);
        this._stream = process.stdout;
    }
    logDebug(debug) {
        if (this.env === "dev") {
            if (this.useJsonFormat) {
                let log = {
                    source: this.source,
                    service: this.service,
                    env: this.env,
                    level: "Debug",
                    message: debug,
                    dateTime: this.getDateTime(),
                    time: new Date().toISOString()
                };
                this.injectTrace(log);
                if (this.logInjector)
                    log = this.logInjector(log);
                this._stream.write(JSON.stringify(log) + "\n");
            }
            else {
                this._stream.write(`${this.getDateTime()} ${log_prefix_1.LogPrefix.debug} ${debug}\n`);
            }
        }
        return Promise.resolve();
    }
    logInfo(info) {
        if (this.useJsonFormat) {
            let log = {
                source: this.source,
                service: this.service,
                env: this.env,
                level: "Info",
                message: info,
                dateTime: this.getDateTime(),
                time: new Date().toISOString()
            };
            this.injectTrace(log);
            if (this.logInjector)
                log = this.logInjector(log);
            this._stream.write(JSON.stringify(log) + "\n");
        }
        else {
            this._stream.write(`${this.getDateTime()} ${log_prefix_1.LogPrefix.info} ${info}\n`);
        }
        return Promise.resolve();
    }
    logWarning(warning) {
        if (this.useJsonFormat) {
            let log = {
                source: this.source,
                service: this.service,
                env: this.env,
                level: "Warn",
                message: this.getErrorMessage(warning),
                dateTime: this.getDateTime(),
                time: new Date().toISOString()
            };
            this.injectTrace(log);
            if (this.logInjector)
                log = this.logInjector(log);
            this._stream.write(JSON.stringify(log) + "\n");
        }
        else {
            this._stream.write(`${this.getDateTime()} ${log_prefix_1.LogPrefix.warning} ${this.getErrorMessage(warning)}\n`);
        }
        return Promise.resolve();
    }
    logError(error) {
        if (this.useJsonFormat) {
            let log = {
                source: this.source,
                service: this.service,
                env: this.env,
                level: "Error",
                message: this.getErrorMessage(error),
                dateTime: this.getDateTime(),
                time: new Date().toISOString()
            };
            this.injectTrace(log);
            if (this.logInjector)
                log = this.logInjector(log);
            this._stream.write(JSON.stringify(log) + "\n");
        }
        else {
            this._stream.write(`${this.getDateTime()} ${log_prefix_1.LogPrefix.error} ${this.getErrorMessage(error)}\n`);
        }
        return Promise.resolve();
    }
}
exports.ConsoleLogger = ConsoleLogger;
//# sourceMappingURL=console-logger.js.map