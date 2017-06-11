import { Exception } from "n-exception";


// public
export interface Logger
{
    logDebug(debug: string): Promise<void>;
    logInfo(info: string): Promise<void>;
    logWarning(warning: string): Promise<void>;
    logError(error: string | Exception): Promise<void>;
}