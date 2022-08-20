export interface LogRecord
{
    source: string;
    service: string;
    env: string;
    status: string;
    message: string;
    dateTime: string;
    time: string;
}