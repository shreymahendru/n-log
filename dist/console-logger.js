"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Colors = require("colors");
const n_config_1 = require("@nivinjoseph/n-config");
// public
class ConsoleLogger {
    logDebug(debug) {
        if (n_config_1.ConfigurationManager.getConfig("env") === "dev")
            console.log(Colors.grey(`DEBUG: ${debug}`));
        return Promise.resolve();
    }
    logInfo(info) {
        console.log(Colors.green(`INFO: ${info}`));
        return Promise.resolve();
    }
    logWarning(warning) {
        console.log(Colors.yellow(`WARNING: ${warning}`));
        return Promise.resolve();
    }
    logError(error) {
        console.log(Colors.red(`ERROR: ${error.toString()}`));
        return Promise.resolve();
    }
}
exports.ConsoleLogger = ConsoleLogger;
//# sourceMappingURL=console-logger.js.map