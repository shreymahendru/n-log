import { Exception } from "@nivinjoseph/n-exception";
import { ConfigurationManager } from "@nivinjoseph/n-config";
import * as moment from "moment-timezone";
import { LogDateTimeZone } from "./log-date-time-zone";
import "@nivinjoseph/n-ext";
import { given } from "@nivinjoseph/n-defensive";
import * as Fs from "fs";
import * as Path from "path";
import { Make, Duration, Mutex } from "@nivinjoseph/n-util";
import { BaseLogger } from "./base-logger";
import { LogPrefix } from "./log-prefix";


// public
export class FileLogger extends BaseLogger
{
    private readonly _mutex = new Mutex();
    private readonly _logDirPath: string;
    private readonly _retentionDays: number;
    
    private _lastPurgedAt = 0;

    
    public constructor(logDirPath: string, retentionDays: number, logDateTimeZone?: LogDateTimeZone)
    {
        super(logDateTimeZone);
        
        given(logDirPath, "logDirPath").ensureHasValue().ensureIsString()
            .ensure(t => Path.isAbsolute(t), "must be absolute");
            
        given(retentionDays, "retentionDays").ensureHasValue().ensureIsNumber().ensure(t => t > 0);
        this._retentionDays = Number.parseInt(retentionDays.toString());
        
        if (!Fs.existsSync(logDirPath))
            Fs.mkdirSync(logDirPath);
        
        this._logDirPath = logDirPath;
    }


    public async logDebug(debug: string): Promise<void>
    {
        if (ConfigurationManager.getConfig<string>("env") === "dev")
            await this.writeToLog(`${LogPrefix.debug} ${debug}`);
    }

    public async logInfo(info: string): Promise<void>
    {
        await this.writeToLog(`${LogPrefix.info} ${info}`);
    }

    public async logWarning(warning: string): Promise<void>
    {
        await this.writeToLog(`${LogPrefix.warning} ${warning}`);
    }

    public async logError(error: string | Exception): Promise<void>
    {
        await this.writeToLog(`${LogPrefix.error} ${this.getErrorMessage(error)}`);
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
        if (this._lastPurgedAt && this._lastPurgedAt > (now - Duration.fromDays(this._retentionDays)))
            return;
        
        const files = await Make.callbackToPromise<ReadonlyArray<string>>(Fs.readdir)(this._logDirPath);
        await files.forEachAsync(async (file) =>
        {
            const filePath = Path.join(this._logDirPath, file);
            const stats = await Make.callbackToPromise<Fs.Stats>(Fs.stat)(filePath);
            if (stats.isFile() && moment(stats.birthtime).valueOf() < (now - Duration.fromDays(this._retentionDays)))
                await Make.callbackToPromise<void>(Fs.unlink)(filePath);
        }, 1);
        
        this._lastPurgedAt = now;
    }
}