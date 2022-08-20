import { Exception } from "@nivinjoseph/n-exception";
import * as Colors from "colors";
import { ConfigurationManager } from "@nivinjoseph/n-config";
import { BaseLogger } from "./base-logger";
import { LogPrefix } from "./log-prefix";


// public
export class ConsoleLogger extends BaseLogger
{
    private readonly _source = "nodejs";
    private readonly _service = ConfigurationManager.getConfig<string>("package.name");
    private readonly _env = ConfigurationManager.getConfig<string>("env");
    
    
    public logDebug(debug: string): Promise<void>
    {
        if (this._env === "dev")
        {
            if (this.useJsonFormat)
            {
                const log = {
                    source: this._source,
                    service: this._service,
                    env: this._env,
                    status: "Debug",
                    message: debug,
                    dateTime: this.getDateTime(),
                    time: new Date().toISOString()
                };
                
                console.log(Colors.grey(JSON.stringify(log)));    
            }
            else
            {
                console.log(Colors.grey(`${this.getDateTime()} ${LogPrefix.debug} ${debug}`));    
            }
            
            
        }
        return Promise.resolve();
    }
    
    public logInfo(info: string): Promise<void>
    {
        if (this.useJsonFormat)
        {
            const log = {
                source: this._source,
                service: this._service,
                env: this._env,
                status: "Info",
                message: info,
                dateTime: this.getDateTime(),
                time: new Date().toISOString()
            };
            
            console.log(Colors.green(JSON.stringify(log)));    
        }
        else
        {
            console.log(Colors.green(`${this.getDateTime()} ${LogPrefix.info} ${info}`));    
        }
        
        return Promise.resolve();
    }

    public logWarning(warning: string | Exception): Promise<void>
    {
        if (this.useJsonFormat)
        {
            const log = {
                source: this._source,
                service: this._service,
                env: this._env,
                status: "Warn",
                message: warning,
                dateTime: this.getDateTime(),
                time: new Date().toISOString()
            };

            console.warn(Colors.yellow(JSON.stringify(log)));
        }
        else
        {
            console.warn(Colors.yellow(`${this.getDateTime()} ${LogPrefix.warning} ${this.getErrorMessage(warning)}`));
        }
        
        return Promise.resolve();
    }

    public logError(error: string | Exception): Promise<void>
    {
        if (this.useJsonFormat)
        {
            const log = {
                source: this._source,
                service: this._service,
                env: this._env,
                status: "Error",
                message: this.getErrorMessage(error),
                dateTime: this.getDateTime(),
                time: new Date().toISOString()
            };

            console.error(Colors.red(JSON.stringify(log)));
        }
        else
        {
            console.error(Colors.red(`${this.getDateTime()} ${LogPrefix.error} ${this.getErrorMessage(error)}`));
        }
        
        return Promise.resolve();
    }
}