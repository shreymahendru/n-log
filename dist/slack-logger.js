"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlackLogger = void 0;
const tslib_1 = require("tslib");
const base_logger_1 = require("./base-logger");
const bolt_1 = require("@slack/bolt");
const n_config_1 = require("@nivinjoseph/n-config");
const n_defensive_1 = require("@nivinjoseph/n-defensive");
class SlackLogger extends base_logger_1.BaseLogger {
    constructor(config) {
        var _a, _b;
        super(config);
        this._source = "nodejs";
        this._service = n_config_1.ConfigurationManager.getConfig("package.name");
        this._env = n_config_1.ConfigurationManager.getConfig("env").toLowerCase();
        const { slackBotToken, slackBotChannel } = config;
        (0, n_defensive_1.given)(slackBotToken, "slackBotToken").ensureHasValue().ensureIsString();
        this._app = new bolt_1.App({
            receiver: new DummyReceiver(),
            token: slackBotToken
        });
        (0, n_defensive_1.given)(slackBotChannel, "slackBotChannel").ensureHasValue().ensureIsString();
        this._channel = slackBotChannel;
        const allFilters = ["Info", "Warn", "Error"];
        const filter = (_a = config.filter) !== null && _a !== void 0 ? _a : allFilters;
        (0, n_defensive_1.given)(filter, "filter").ensureIsArray().ensure(t => t.every(u => allFilters.contains(u)));
        this._includeInfo = filter.contains("Info");
        this._includeWarn = filter.contains("Warn");
        this._includeError = filter.contains("Error");
        this._fallbackLogger = (_b = config.fallback) !== null && _b !== void 0 ? _b : null;
    }
    logDebug(debug) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this._env === "dev") {
                let log = {
                    source: this._source,
                    service: this._service,
                    env: this._env,
                    level: "Debug",
                    message: debug,
                    dateTime: this.getDateTime(),
                    time: new Date().toISOString(),
                    color: "#F8F8F8"
                };
                if (this.logInjector)
                    log = this.logInjector(log);
                yield this._postMessage(log);
            }
        });
    }
    logInfo(info) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this._includeInfo)
                return;
            let log = {
                source: this._source,
                service: this._service,
                env: this._env,
                level: "Info",
                message: info,
                dateTime: this.getDateTime(),
                time: new Date().toISOString(),
                color: "#259D2F"
            };
            if (this.logInjector)
                log = this.logInjector(log);
            yield this._postMessage(log);
        });
    }
    logWarning(warning) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this._includeWarn)
                return;
            let log = {
                source: this._source,
                service: this._service,
                env: this._env,
                level: "Warn",
                message: this.getErrorMessage(warning),
                dateTime: this.getDateTime(),
                time: new Date().toISOString(),
                color: "#F1AB2A"
            };
            if (this.logInjector)
                log = this.logInjector(log);
            yield this._postMessage(log);
        });
    }
    logError(error) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this._includeError)
                return;
            let log = {
                source: this._source,
                service: this._service,
                env: this._env,
                level: "Error",
                message: this.getErrorMessage(error),
                dateTime: this.getDateTime(),
                time: new Date().toISOString(),
                color: "#EF401D"
            };
            if (this.logInjector)
                log = this.logInjector(log);
            yield this._postMessage(log);
        });
    }
    _postMessage(log) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                yield this._app.client.chat.postMessage({
                    channel: this._channel,
                    text: `${log.level}: *${log.env}* ${log.service}`,
                    attachments: [{
                            color: log.color,
                            blocks: [
                                {
                                    type: "section",
                                    text: {
                                        type: "plain_text",
                                        text: log.message
                                    }
                                },
                                {
                                    type: "context",
                                    elements: [{
                                            type: "plain_text",
                                            text: log.dateTime
                                        }]
                                }
                            ]
                        }]
                });
            }
            catch (error) {
                if (this._fallbackLogger) {
                    yield this._fallbackLogger.logWarning("Error while posting to slack.");
                    yield this._fallbackLogger.logError(error);
                    yield this._fallbackLogger.logWarning("Original error below");
                    yield this._fallbackLogger.logError(log.message);
                }
                else {
                    console.warn("Error while posting to slack.");
                    console.error(error);
                    console.warn("Original error below");
                    console.error(log.message);
                }
            }
        });
    }
}
exports.SlackLogger = SlackLogger;
class DummyReceiver {
    // @ts-expect-error: not used atm
    init(app) {
        // no-op
    }
    // @ts-expect-error: not used atm
    start(...args) {
        return Promise.resolve();
    }
    // @ts-expect-error: not used atm
    stop(...args) {
        return Promise.resolve();
    }
}
//# sourceMappingURL=slack-logger.js.map