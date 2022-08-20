import { Exception } from "@nivinjoseph/n-exception";
import { Logger } from "./logger";
import { LoggerConfig } from "./logger-config";
import { LogRecord } from "./log-record";
export declare abstract class BaseLogger implements Logger {
    private readonly _logDateTimeZone;
    private readonly _useJsonFormat;
    private readonly _logInjector;
    protected get useJsonFormat(): boolean;
    protected get logInjector(): ((record: LogRecord) => LogRecord) | null;
    /**
     *
     * @param logDateTimeZone Default is LogDateTimeZone.utc
     * @param useJsonFormat Default is false
     * @param logInjector Only valid when useJsonFormat is true
     */
    constructor(config?: LoggerConfig);
    abstract logDebug(debug: string): Promise<void>;
    abstract logInfo(info: string): Promise<void>;
    abstract logWarning(warning: string | Exception): Promise<void>;
    abstract logError(error: string | Exception): Promise<void>;
    protected getErrorMessage(exp: Exception | Error | any): string;
    protected getDateTime(): string;
}
