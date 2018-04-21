import { Logger } from "./logger";
import { Exception } from "@nivinjoseph/n-exception";
import * as Colors from "colors";
import { ConfigurationManager } from "@nivinjoseph/n-config";
// @ts-ignore
import * as moment from "moment-timezone";
import { LogDateTimeZone } from "./log-date-time-zone";
import "@nivinjoseph/n-ext";


// public
export class ConsoleLogger implements Logger
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
    
    
    public logDebug(debug: string): Promise<void>
    {
        if (ConfigurationManager.getConfig<string>("env") === "dev")
            console.log(Colors.grey(`${this.getDateTime()} DEBUG: ${debug}`));
        return Promise.resolve();
    }
    
    public logInfo(info: string): Promise<void>
    {
        console.log(Colors.green(`${this.getDateTime()} INFO: ${info}`));
        return Promise.resolve();
    }

    public logWarning(warning: string): Promise<void>
    {
        console.log(Colors.yellow(`${this.getDateTime()} WARNING: ${warning}`));
        return Promise.resolve();
    }

    public logError(error: string | Exception): Promise<void>
    {
        console.log(Colors.red(`${this.getDateTime()} ERROR: ${error.toString()}`));
        return Promise.resolve();
    }
    
    
    private getDateTime(): string
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