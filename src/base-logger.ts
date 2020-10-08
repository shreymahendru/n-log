import { Exception } from "@nivinjoseph/n-exception";
import { LogDateTimeZone } from "./log-date-time-zone";
import { Logger } from "./logger";
import * as moment from "moment-timezone";


export abstract class BaseLogger implements Logger
{
    private readonly _logDateTimeZone: LogDateTimeZone;
    

    public constructor(logDateTimeZone?: LogDateTimeZone)
    {
        if (!logDateTimeZone || logDateTimeZone.isEmptyOrWhiteSpace() ||
            ![LogDateTimeZone.utc, LogDateTimeZone.local, LogDateTimeZone.est, LogDateTimeZone.pst].contains(logDateTimeZone))
        {
            this._logDateTimeZone = LogDateTimeZone.utc;
        }
        else
        {
            this._logDateTimeZone = logDateTimeZone;
        }
    }
    
    
    public abstract logDebug(debug: string): Promise<void>;
    public abstract logInfo(info: string): Promise<void>;
    public abstract logWarning(warning: string): Promise<void>;
    public abstract logError(error: string | Exception): Promise<void>;
    
    protected getErrorMessage(exp: Exception | Error | any): string
    {
        let logMessage = "";
        try 
        {
            if (exp instanceof Exception)
                logMessage = exp.toString();
            else if (exp instanceof Error)
                logMessage = exp.stack;
            else
                logMessage = exp.toString();
        }
        catch (error)
        {
            console.warn(error);
            logMessage = "There was an error while attempting to log another error.";
        }

        return logMessage;
    }


    protected getDateTime(): string
    {
        let result: string = null;

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
}