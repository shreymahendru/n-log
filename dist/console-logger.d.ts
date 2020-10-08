import { Exception } from "@nivinjoseph/n-exception";
import "@nivinjoseph/n-ext";
import { BaseLogger } from "./base-logger";
export declare class ConsoleLogger extends BaseLogger {
    logDebug(debug: string): Promise<void>;
    logInfo(info: string): Promise<void>;
    logWarning(warning: string): Promise<void>;
    logError(error: string | Exception): Promise<void>;
}
