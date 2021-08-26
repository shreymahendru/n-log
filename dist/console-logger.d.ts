import "@nivinjoseph/n-ext";
import { Exception } from "@nivinjoseph/n-exception";
import { BaseLogger } from "./base-logger";
export declare class ConsoleLogger extends BaseLogger {
    logDebug(debug: string): Promise<void>;
    logInfo(info: string): Promise<void>;
    logWarning(warning: string | Exception): Promise<void>;
    logError(error: string | Exception): Promise<void>;
}
