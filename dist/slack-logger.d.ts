import { Exception } from "@nivinjoseph/n-exception";
import { BaseLogger } from "./base-logger";
import { LoggerConfig } from "./logger-config";
import { Logger } from "./logger";
export declare type SlackLoggerConfig = Pick<LoggerConfig, "logDateTimeZone" | "logInjector"> & {
    slackBotToken: string;
    slackBotChannel: string;
    filter?: ReadonlyArray<"Info" | "Warn" | "Error">;
    fallback?: Logger;
};
export declare class SlackLogger extends BaseLogger {
    private readonly _includeInfo;
    private readonly _includeWarn;
    private readonly _includeError;
    private readonly _fallbackLogger;
    private readonly _app;
    private readonly _channel;
    constructor(config: SlackLoggerConfig);
    logDebug(debug: string): Promise<void>;
    logInfo(info: string): Promise<void>;
    logWarning(warning: string | Exception): Promise<void>;
    logError(error: string | Exception): Promise<void>;
    private _postMessage;
}
