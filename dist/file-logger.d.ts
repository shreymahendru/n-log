import { Exception } from "@nivinjoseph/n-exception";
import { LogDateTimeZone } from "./log-date-time-zone";
import "@nivinjoseph/n-ext";
import { BaseLogger } from "./base-logger";
export declare class FileLogger extends BaseLogger {
    private readonly _mutex;
    private readonly _logDirPath;
    private readonly _retentionDays;
    private _lastPurgedAt;
    constructor(logDirPath: string, retentionDays: number, logDateTimeZone?: LogDateTimeZone);
    logDebug(debug: string): Promise<void>;
    logInfo(info: string): Promise<void>;
    logWarning(warning: string): Promise<void>;
    logError(error: string | Exception): Promise<void>;
    private writeToLog;
    private purgeLogs;
}
