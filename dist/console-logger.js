"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsoleLogger = void 0;
const Colors = require("colors");
const n_config_1 = require("@nivinjoseph/n-config");
const base_logger_1 = require("./base-logger");
const log_prefix_1 = require("./log-prefix");
// public
class ConsoleLogger extends base_logger_1.BaseLogger {
    logDebug(debug) {
        if (n_config_1.ConfigurationManager.getConfig("env") === "dev")
            console.log(Colors.grey(`${this.getDateTime()} ${log_prefix_1.LogPrefix.debug} ${debug}`));
        return Promise.resolve();
    }
    logInfo(info) {
        console.log(Colors.green(`${this.getDateTime()} ${log_prefix_1.LogPrefix.info} ${info}`));
        return Promise.resolve();
    }
    logWarning(warning) {
        console.warn(Colors.yellow(`${this.getDateTime()} ${log_prefix_1.LogPrefix.warning} ${this.getErrorMessage(warning)}`));
        return Promise.resolve();
    }
    logError(error) {
        console.error(Colors.red(`${this.getDateTime()} ${log_prefix_1.LogPrefix.error} ${this.getErrorMessage(error)}`));
        return Promise.resolve();
    }
}
exports.ConsoleLogger = ConsoleLogger;
//# sourceMappingURL=console-logger.js.map