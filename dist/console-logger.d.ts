import { Logger } from "./logger";
import { Exception } from "@nivinjoseph/n-exception";
export declare class ConsoleLogger implements Logger {
    logDebug(debug: string): Promise<void>;
    logInfo(info: string): Promise<void>;
    logWarning(warning: string): Promise<void>;
    logError(error: string | Exception): Promise<void>;
}
