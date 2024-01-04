import { BaseLogger } from "./base-logger.js";
import { LogPrefix } from "./log-prefix.js";
// public
export class ConsoleLogger extends BaseLogger {
    constructor() {
        super(...arguments);
        this._stream = process.stdout;
        this._resetColorCode = "\x1b[0m";
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
                this._stream.write(`${this.getDateTime()} ${LogPrefix.debug} ${debug}\n`);
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
            const startColorCode = "\x1b[34m";
            const endColorCode = "\x1b[89m";
            this._stream.write(`${startColorCode}${this.getDateTime()} ${LogPrefix.info} ${info}${endColorCode}${this._resetColorCode}\n`);
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
            const startColorCode = "\x1b[33m";
            const endColorCode = "\x1b[89m";
            this._stream.write(`${startColorCode}${this.getDateTime()} ${LogPrefix.warning} ${this.getErrorMessage(warning)}${endColorCode}${this._resetColorCode}\n`);
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
            this.injectTrace(log, true);
            if (this.logInjector)
                log = this.logInjector(log);
            this._stream.write(JSON.stringify(log) + "\n");
        }
        else {
            const startColorCode = "\x1b[31m";
            const endColorCode = "\x1b[89m";
            this._stream.write(`${startColorCode}${this.getDateTime()} ${LogPrefix.error} ${this.getErrorMessage(error)}${endColorCode}${this._resetColorCode}\n`);
        }
        return Promise.resolve();
    }
}
//# sourceMappingURL=console-logger.js.map