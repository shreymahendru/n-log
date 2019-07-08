import { Logger } from "./logger";
import { Exception } from "@nivinjoseph/n-exception";
import { LogDateTimeZone } from "./log-date-time-zone";
import "@nivinjoseph/n-ext";
export declare class FileLogger implements Logger {
    private readonly _mutex;
    private readonly _logDirPath;
    private readonly _logDateTimeZone;
    private _lastPurgedAt;
    constructor(logDirPath: string, logDateTimeZone?: LogDateTimeZone);
    logDebug(debug: string): Promise<void>;
    logInfo(info: string): Promise<void>;
    logWarning(warning: string): Promise<void>;
    logError(error: string | Exception): Promise<void>;
    private getErrorMessage;
    private getDateTime;
    private writeToLog;
    private purgeLogs;
}
