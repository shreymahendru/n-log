import { Logger } from "./logger";
import { Exception } from "@nivinjoseph/n-exception";
import { LogDateTimeZone } from "./log-date-time-zone";
import "@nivinjoseph/n-ext";
export declare class ConsoleLogger implements Logger {
    private readonly _logDateTimeZone;
    constructor(logDateTimeZone?: LogDateTimeZone);
    logDebug(debug: string): Promise<void>;
    logInfo(info: string): Promise<void>;
    logWarning(warning: string): Promise<void>;
    logError(error: string | Exception): Promise<void>;
    private getDateTime;
}
