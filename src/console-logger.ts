import "@nivinjoseph/n-ext";
import { Exception } from "@nivinjoseph/n-exception";
import * as Colors from "colors";
import { ConfigurationManager } from "@nivinjoseph/n-config";
import { BaseLogger } from "./base-logger";
import { LogPrefix } from "./log-prefix";


// public
export class ConsoleLogger extends BaseLogger
{
    public logDebug(debug: string): Promise<void>
    {
        if (ConfigurationManager.getConfig<string>("env") === "dev")
            console.log(Colors.grey(`${this.getDateTime()} ${LogPrefix.debug} ${debug}`));
        return Promise.resolve();
    }
    
    public logInfo(info: string): Promise<void>
    {
        console.log(Colors.green(`${this.getDateTime()} ${LogPrefix.info} ${info}`));
        return Promise.resolve();
    }

    public logWarning(warning: string | Exception): Promise<void>
    {
        console.warn(Colors.yellow(`${this.getDateTime()} ${LogPrefix.warning} ${this.getErrorMessage(warning)}`));
        return Promise.resolve();
    }

    public logError(error: string | Exception): Promise<void>
    {
        console.error(Colors.red(`${this.getDateTime()} ${LogPrefix.error} ${this.getErrorMessage(error)}`));
        return Promise.resolve();
    }
}