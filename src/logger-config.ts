import { LogDateTimeZone } from "./log-date-time-zone";
import { LogRecord } from "./log-record";


export interface LoggerConfig
{
    logDateTimeZone?: LogDateTimeZone;
    useJsonFormat?: boolean;
    logInjector?(record: LogRecord): LogRecord;
    enableOtelToDatadogTraceConversion?: boolean;
}