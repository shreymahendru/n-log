import { Exception } from "@nivinjoseph/n-exception";
import { LogDateTimeZone } from "./log-date-time-zone";
import { Logger } from "./logger";
export declare abstract class BaseLogger implements Logger {
    private readonly _logDateTimeZone;
    constructor(logDateTimeZone?: LogDateTimeZone);
    abstract logDebug(debug: string): Promise<void>;
    abstract logInfo(info: string): Promise<void>;
    abstract logWarning(warning: string | Exception): Promise<void>;
    abstract logError(error: string | Exception): Promise<void>;
    protected getErrorMessage(exp: Exception | Error | any): string;
    protected getDateTime(): string;
}
