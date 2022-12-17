import { Exception } from "@nivinjoseph/n-exception";
import { LogDateTimeZone } from "./log-date-time-zone";
import { Logger } from "./logger";
import * as moment from "moment-timezone";
import { LoggerConfig } from "./logger-config";
import { LogRecord } from "./log-record";
import { ConfigurationManager } from "@nivinjoseph/n-config";
import { context, trace, isSpanContextValid } from "@opentelemetry/api";


export abstract class BaseLogger implements Logger
{
    private readonly _source = "nodejs";
    private readonly _service = ConfigurationManager.getConfig<string | null>("package_name") ?? ConfigurationManager.getConfig<string | null>("package.name") ?? "n-known";
    private readonly _env = ConfigurationManager.getConfig<string | null>("env")?.toLowerCase() ?? "dev";
    private readonly _logDateTimeZone: LogDateTimeZone;
    private readonly _useJsonFormat: boolean;
    private readonly _logInjector: ((record: LogRecord) => LogRecord) | null;
    
    protected get source(): string { return this._source; }
    protected get service(): string { return this._service; }
    protected get env(): string { return this._env; }
    
    protected get useJsonFormat(): boolean { return this._useJsonFormat; }
    protected get logInjector(): ((record: LogRecord) => LogRecord) | null { return this._logInjector; }
    

    /**
     * 
     * @param logDateTimeZone Default is LogDateTimeZone.utc
     * @param useJsonFormat Default is false
     * @param logInjector Only valid when useJsonFormat is true
     */
    public constructor(config?: LoggerConfig)
    {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        const { logDateTimeZone, useJsonFormat, logInjector } = config ?? {};
        
        if (!logDateTimeZone || logDateTimeZone.isEmptyOrWhiteSpace() ||
            ![LogDateTimeZone.utc, LogDateTimeZone.local, LogDateTimeZone.est, LogDateTimeZone.pst].contains(logDateTimeZone))
        {
            this._logDateTimeZone = LogDateTimeZone.utc;
        }
        else
        {
            this._logDateTimeZone = logDateTimeZone;
        }
        
        this._useJsonFormat = !!useJsonFormat;
        this._logInjector = logInjector ?? null;
    }
    
    
    public abstract logDebug(debug: string): Promise<void>;
    public abstract logInfo(info: string): Promise<void>;
    public abstract logWarning(warning: string | Exception): Promise<void>;
    public abstract logError(error: string | Exception): Promise<void>;
    
    protected getErrorMessage(exp: Exception | Error | any): string
    {
        let logMessage = "";
        try 
        {
            if (exp instanceof Exception)
                logMessage = exp.toString();
            else if (exp instanceof Error)
                logMessage = exp.stack!;
            else
                logMessage = (<object>exp).toString();
        }
        catch (error)
        {
            console.warn(error);
            logMessage = "There was an error while attempting to log another error. Check earlier logs for a warning.";
        }

        return logMessage;
    }

    protected getDateTime(): string
    {
        let result: string | null = null;

        switch (this._logDateTimeZone)
        {
            case LogDateTimeZone.utc:
                result = moment().utc().format();
                break;
            case LogDateTimeZone.local:
                result = moment().format();
                break;
            case LogDateTimeZone.est:
                result = moment().tz("America/New_York").format();
                break;
            case LogDateTimeZone.pst:
                result = moment().tz("America/Los_Angeles").format();
                break;
            default:
                result = moment().utc().format();
                break;
        }

        return result;
    }
    
    protected injectTrace(log: Record<string, any>): void
    {
        const span = trace.getSpan(context.active());

        if (span)
        {
            const spanContext = span.spanContext();

            if (isSpanContextValid(spanContext))
            {
                log["trace_id"] = spanContext.traceId;
                log["span_id"] = spanContext.spanId;
                log["trace_flags"] = `0${spanContext.traceFlags.toString(16)}`;
            }
        }
    }
}