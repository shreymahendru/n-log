import { Logger } from "./logger";
import { Exception } from "n-exception";
import * as Colors from "colors";
import { ConfigurationManager } from "n-config";


// public
export class ConsoleLogger implements Logger
{
    public logDebug(debug: string): Promise<void>
    {
        if (ConfigurationManager.getConfig<string>("mode") === "dev")
            console.log(Colors.grey(`DEBUG: ${debug}`));
        return Promise.resolve();
    }
    
    public logInfo(info: string): Promise<void>
    {
        console.log(Colors.green(`INFO: ${info}`));
        return Promise.resolve();
    }

    public logWarning(warning: string): Promise<void>
    {
        console.log(Colors.yellow(`WARNING: ${warning}`));
        return Promise.resolve();
    }

    public logError(error: string | Exception): Promise<void>
    {
        console.log(Colors.red(`ERROR: ${error.toString()}`));
        return Promise.resolve();
    }
}