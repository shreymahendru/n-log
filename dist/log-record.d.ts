export interface LogRecord {
    source: string;
    service: string;
    env: string;
    level: string;
    message: string;
    dateTime: string;
    time: string;
}
