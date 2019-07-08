import { Logger } from "./logger";
import { Exception } from "@nivinjoseph/n-exception";
import { ConfigurationManager } from "@nivinjoseph/n-config";
import * as moment from "moment-timezone";
import { LogDateTimeZone } from "./log-date-time-zone";
import "@nivinjoseph/n-ext";
import { given } from "@nivinjoseph/n-defensive";
import * as Fs from "fs";
import * as Path from "path";
import { Make, Duration, Mutex } from "@nivinjoseph/n-util";


// public
export class FileLogger implements Logger
{
    private readonly _mutex = new Mutex();
    private readonly _logDirPath: string;
    private readonly _logDateTimeZone: LogDateTimeZone;
    private _lastPurgedAt: number;

    
    public constructor(logDirPath: string, logDateTimeZone?: LogDateTimeZone)
    {
        given(logDirPath, "logDirPath").ensureHasValue().ensureIsString()
            .ensure(t => Path.isAbsolute(t), "must be absolute");
        
        if (!Fs.existsSync(logDirPath))
            Fs.mkdirSync(logDirPath);
        
        this._logDirPath = logDirPath;
        
        if (!logDateTimeZone || logDateTimeZone.isEmptyOrWhiteSpace() ||
            ![LogDateTimeZone.utc, LogDateTimeZone.local, LogDateTimeZone.est, LogDateTimeZone.pst].contains(logDateTimeZone))
        {
            this._logDateTimeZone = LogDateTimeZone.utc;
        }
        else
        {
            this._logDateTimeZone = logDateTimeZone;
        }
        
        this._lastPurgedAt = 0;
    }


    public async logDebug(debug: string): Promise<void>
    {
        if (ConfigurationManager.getConfig<string>("env") === "dev")
            await this.writeToLog(`DEBUG: ${debug}`);
    }

    public async logInfo(info: string): Promise<void>
    {
        await this.writeToLog(`INFO: ${info}`);
    }

    public async logWarning(warning: string): Promise<void>
    {
        await this.writeToLog(`WARNING: ${warning}`);
    }

    public async logError(error: string | Exception): Promise<void>
    {
        await this.writeToLog(`ERROR: ${this.getErrorMessage(error)}`);
    }

    private getErrorMessage(exp: Exception | Error | any): string
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
    
    private async writeToLog(message: string): Promise<void>
    {
        given(message, "message").ensureHasValue().ensureIsString();
        
        const dateTime = this.getDateTime();
        const logFileName = `${dateTime.substr(0, 13)}.log`;
        const logFilePath = Path.join(this._logDirPath, logFileName);
        
        await this._mutex.lock();
        try 
        {
            await Make.callbackToPromise<void>(Fs.appendFile)(logFilePath, `\n${dateTime} ${message}`);

            await this.purgeLogs();   
        }
        catch (error)
        {
            console.error(error);
        }
        finally
        {
            this._mutex.release();
        }
    }
    
    private async purgeLogs(): Promise<void>
    {
        const now = Date.now();
        if (this._lastPurgedAt && this._lastPurgedAt > (now - Duration.fromDays(7)))
            return;
        
        const files = await Make.callbackToPromise<ReadonlyArray<string>>(Fs.readdir)(this._logDirPath);
        await files.forEachAsync(async (file) =>
        {
            const filePath = Path.join(this._logDirPath, file);
            const stats = await Make.callbackToPromise<Fs.Stats>(Fs.stat)(filePath);
            if (stats.isFile() && moment(stats.birthtime).valueOf() < (now - Duration.fromDays(7)))
                await Make.callbackToPromise<void>(Fs.unlink)(filePath);
        }, 1);
        
        this._lastPurgedAt = now;
    }
}