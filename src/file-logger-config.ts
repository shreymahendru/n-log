import { LoggerConfig } from "./logger-config";


export interface FileLoggerConfig extends LoggerConfig
{
    logDirPath: string;
    retentionDays: number;
}