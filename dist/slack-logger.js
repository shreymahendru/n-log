"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlackLogger = void 0;
const tslib_1 = require("tslib");
const base_logger_1 = require("./base-logger");
const bolt_1 = require("@slack/bolt");
const n_defensive_1 = require("@nivinjoseph/n-defensive");
const n_util_1 = require("@nivinjoseph/n-util");
class SlackLogger extends base_logger_1.BaseLogger {
    constructor(config) {
        var _a, _b;
        super(config);
        this._userImage = ":robot_face:";
        this._messages = new Array();
        this._isDisposed = false;
        this._disposePromise = null;
        // eslint-disable-next-line @typescript-eslint/unbound-method
        const { slackBotToken, slackBotChannel, slackUserName, slackUserImage, logFilter } = config;
        (0, n_defensive_1.given)(slackBotToken, "slackBotToken").ensureHasValue().ensureIsString();
        this._app = new bolt_1.App({
            receiver: new DummyReceiver(),
            token: slackBotToken
        });
        (0, n_defensive_1.given)(slackBotChannel, "slackBotChannel").ensureHasValue().ensureIsString();
        this._channel = slackBotChannel;
        (0, n_defensive_1.given)(slackUserName, "slackUserName").ensureIsString();
        if (slackUserName != null && slackUserName.isNotEmptyOrWhiteSpace())
            this._userName = slackUserName;
        else
            this._userName = this.service;
        (0, n_defensive_1.given)(slackUserImage, "slackUserImage").ensureIsString();
        if (slackUserImage != null && slackUserImage.isNotEmptyOrWhiteSpace())
            this._userImage = slackUserImage.trim();
        this._userImageIsEmoji = this._userImage.startsWith(":") && this._userImage.endsWith(":");
        const allFilters = ["Info", "Warn", "Error"];
        const filter = (_a = config.filter) !== null && _a !== void 0 ? _a : allFilters;
        (0, n_defensive_1.given)(filter, "filter").ensureIsArray().ensure(t => t.every(u => allFilters.contains(u)));
        this._includeInfo = filter.contains("Info");
        this._includeWarn = filter.contains("Warn");
        this._includeError = filter.contains("Error");
        (0, n_defensive_1.given)(logFilter, "logFilter").ensureIsFunction();
        this._logFilter = logFilter !== null && logFilter !== void 0 ? logFilter : ((_) => true);
        this._fallbackLogger = (_b = config.fallback) !== null && _b !== void 0 ? _b : null;
        this._timer = setInterval(() => {
            this._flushMessages()
                .catch(e => { var _a, _b; return (_b = (_a = this._fallbackLogger) === null || _a === void 0 ? void 0 : _a.logError(e).catch(e => console.error(e))) !== null && _b !== void 0 ? _b : console.error(e); });
        }, n_util_1.Duration.fromSeconds(30).toMilliSeconds());
    }
    logDebug(debug) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.env === "dev") {
                let log = {
                    source: this.source,
                    service: this.service,
                    env: this.env,
                    level: "Debug",
                    message: debug,
                    dateTime: this.getDateTime(),
                    time: new Date().toISOString(),
                    color: "#F8F8F8"
                };
                if (this.logInjector)
                    log = this.logInjector(log);
                this._messages.push(log);
            }
        });
    }
    logInfo(info) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this._includeInfo)
                return;
            let log = {
                source: this.source,
                service: this.service,
                env: this.env,
                level: "Info",
                message: info,
                dateTime: this.getDateTime(),
                time: new Date().toISOString(),
                color: "#259D2F"
            };
            if (!this._logFilter(log))
                return;
            if (this.logInjector)
                log = this.logInjector(log);
            this._messages.push(log);
        });
    }
    logWarning(warning) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this._includeWarn)
                return;
            let log = {
                source: this.source,
                service: this.service,
                env: this.env,
                level: "Warn",
                message: this.getErrorMessage(warning),
                dateTime: this.getDateTime(),
                time: new Date().toISOString(),
                color: "#F1AB2A"
            };
            if (!this._logFilter(log))
                return;
            if (this.logInjector)
                log = this.logInjector(log);
            this._messages.push(log);
        });
    }
    logError(error) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this._includeError)
                return;
            let log = {
                source: this.source,
                service: this.service,
                env: this.env,
                level: "Error",
                message: this.getErrorMessage(error),
                dateTime: this.getDateTime(),
                time: new Date().toISOString(),
                color: "#EF401D"
            };
            if (!this._logFilter(log))
                return;
            if (this.logInjector)
                log = this.logInjector(log);
            this._messages.push(log);
        });
    }
    dispose() {
        if (!this._isDisposed) {
            this._isDisposed = true;
            clearInterval(this._timer);
            this._disposePromise = this._flushMessages();
        }
        return this._disposePromise;
    }
    _flushMessages() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this._messages.isEmpty)
                return;
            const messagesToFlush = this._messages;
            this._messages = new Array();
            yield this._postMessages(messagesToFlush);
        });
    }
    _postMessages(messages) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                yield this._app.client.chat.postMessage({
                    username: this._userName,
                    icon_emoji: this._userImageIsEmoji ? this._userImage : undefined,
                    icon_url: !this._userImageIsEmoji ? this._userImage : undefined,
                    channel: this._channel,
                    text: `${this.service} [${this.env}]`,
                    attachments: messages.map(log => {
                        return {
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
                        };
                    })
                });
            }
            catch (error) {
                if (this._fallbackLogger != null) {
                    yield this._fallbackLogger.logWarning("Error while posting to slack.");
                    yield this._fallbackLogger.logError(error);
                    yield this._fallbackLogger.logWarning("Original messages below");
                    yield messages.forEachAsync((log) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                        switch (log.level) {
                            case "Debug":
                                yield this._fallbackLogger.logDebug(log.message);
                                break;
                            case "Info":
                                yield this._fallbackLogger.logInfo(log.message);
                                break;
                            case "Warn":
                                yield this._fallbackLogger.logWarning(log.message);
                                break;
                            case "Error":
                                yield this._fallbackLogger.logError(log.message);
                                break;
                            default:
                                yield this._fallbackLogger.logError(log.message);
                        }
                    }), 1);
                }
                else {
                    console.warn("Error while posting to slack.");
                    console.error(error);
                    console.warn("Original messages below");
                    messages.forEach(log => {
                        switch (log.level) {
                            case "Debug":
                                console.info(log.message);
                                break;
                            case "Info":
                                console.info(log.message);
                                break;
                            case "Warn":
                                console.warn(log.message);
                                break;
                            case "Error":
                                console.error(log.message);
                                break;
                            default:
                                console.error(log.message);
                        }
                    });
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