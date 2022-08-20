"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsoleLogger = void 0;
const Colors = require("colors");
const n_config_1 = require("@nivinjoseph/n-config");
const base_logger_1 = require("./base-logger");
const log_prefix_1 = require("./log-prefix");
// public
class ConsoleLogger extends base_logger_1.BaseLogger {
    constructor() {
        super(...arguments);
        this._source = "nodejs";
        this._service = n_config_1.ConfigurationManager.getConfig("package.name");
        this._env = n_config_1.ConfigurationManager.getConfig("env");
    }
    logDebug(debug) {
        if (this._env === "dev") {
            if (this.useJsonFormat) {
                const log = {
                    source: this._source,
                    service: this._service,
                    env: this._env,
                    status: "Debug",
                    message: debug,
                    dateTime: this.getDateTime(),
                    time: new Date().toISOString()
                };
                console.log(Colors.grey(JSON.stringify(log)));
            }
            else {
                console.log(Colors.grey(`${this.getDateTime()} ${log_prefix_1.LogPrefix.debug} ${debug}`));
            }
        }
        return Promise.resolve();
    }
    logInfo(info) {
        if (this.useJsonFormat) {
            const log = {
                source: this._source,
                service: this._service,
                env: this._env,
                status: "Info",
                message: info,
                dateTime: this.getDateTime(),
                time: new Date().toISOString()
            };
            console.log(Colors.green(JSON.stringify(log)));
        }
        else {
            console.log(Colors.green(`${this.getDateTime()} ${log_prefix_1.LogPrefix.info} ${info}`));
        }
        return Promise.resolve();
    }
    logWarning(warning) {
        if (this.useJsonFormat) {
            const log = {
                source: this._source,
                service: this._service,
                env: this._env,
                status: "Warn",
                message: warning,
                dateTime: this.getDateTime(),
                time: new Date().toISOString()
            };
            console.warn(Colors.yellow(JSON.stringify(log)));
        }
        else {
            console.warn(Colors.yellow(`${this.getDateTime()} ${log_prefix_1.LogPrefix.warning} ${this.getErrorMessage(warning)}`));
        }
        return Promise.resolve();
    }
    logError(error) {
        if (this.useJsonFormat) {
            const log = {
                source: this._source,
                service: this._service,
                env: this._env,
                status: "Error",
                message: this.getErrorMessage(error),
                dateTime: this.getDateTime(),
                time: new Date().toISOString()
            };
            console.error(Colors.red(JSON.stringify(log)));
        }
        else {
            console.error(Colors.red(`${this.getDateTime()} ${log_prefix_1.LogPrefix.error} ${this.getErrorMessage(error)}`));
        }
        return Promise.resolve();
    }
}
exports.ConsoleLogger = ConsoleLogger;
//# sourceMappingURL=console-logger.js.map