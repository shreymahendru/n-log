import { Exception } from "@nivinjoseph/n-exception";


// public
export interface Logger
{
    logDebug(debug: string): Promise<void>;
    logInfo(info: string): Promise<void>;
    logWarning(warning: string | Exception): Promise<void>;
    logError(error: string | Exception): Promise<void>;
}