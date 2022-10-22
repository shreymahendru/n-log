import { Exception } from "@nivinjoseph/n-exception";
import { BaseLogger } from "./base-logger";
import { App, Receiver } from "@slack/bolt";
import { StringIndexed } from "@slack/bolt/dist/types/helpers";
import { given } from "@nivinjoseph/n-defensive";
import { LoggerConfig } from "./logger-config";
import { Logger } from "./logger";
import { LogRecord } from "./log-record";


export type SlackLoggerConfig = Pick<LoggerConfig, "logDateTimeZone" | "logInjector"> & {
    slackBotToken: string;
    slackBotChannel: string;
    filter?: ReadonlyArray<"Info" | "Warn" | "Error">;
    fallback?: Logger;
};

export class SlackLogger extends BaseLogger
{
    private readonly _includeInfo: boolean;
    private readonly _includeWarn: boolean;
    private readonly _includeError: boolean;
    private readonly _fallbackLogger: Logger | null;
    private readonly _app: App;   
    private readonly _channel: string;
    
    
    public constructor(config: SlackLoggerConfig)
    {
        super(config);
        
        const { slackBotToken, slackBotChannel } = config;

        given(slackBotToken, "slackBotToken").ensureHasValue().ensureIsString();
        this._app = new App({
            receiver: new DummyReceiver(),
            token: slackBotToken
        });
        
        given(slackBotChannel, "slackBotChannel").ensureHasValue().ensureIsString();
        this._channel = slackBotChannel;
        
        const allFilters = ["Info", "Warn", "Error"];
        const filter = config.filter ?? allFilters;
        given(filter, "filter").ensureIsArray().ensure(t => t.every(u => allFilters.contains(u)));
        this._includeInfo = filter.contains("Info");
        this._includeWarn = filter.contains("Warn");
        this._includeError = filter.contains("Error");
        
        this._fallbackLogger = config.fallback ?? null;
    }
    
    public async logDebug(debug: string): Promise<void>
    {
        if (this.env === "dev")
        {
            let log: SlackMessage = {
                source: this.source,
                service: this.service,
                env: this.env,
                level: "Debug",
                message: debug,
                dateTime: this.getDateTime(),
                time: new Date().toISOString(),
                color: "#F8F8F8"
            };
            
            if (this.logInjector)
                log = this.logInjector(log) as SlackMessage;
            
            await this._postMessage(log);
        }
    }
    
    public async logInfo(info: string): Promise<void>
    {
        if (!this._includeInfo)
            return;
        
        let log: SlackMessage = {
            source: this.source,
            service: this.service,
            env: this.env,
            level: "Info",
            message: info,
            dateTime: this.getDateTime(),
            time: new Date().toISOString(),
            color: "#259D2F"
        };
        
        if (this.logInjector)
            log = this.logInjector(log) as SlackMessage;

        await this._postMessage(log);
    }
    
    public async logWarning(warning: string | Exception): Promise<void>
    {
        if (!this._includeWarn)
            return;
        
        let log: SlackMessage = {
            source: this.source,
            service: this.service,
            env: this.env,
            level: "Warn",
            message: this.getErrorMessage(warning),
            dateTime: this.getDateTime(),
            time: new Date().toISOString(),
            color: "#F1AB2A"
        };
        
        if (this.logInjector)
            log = this.logInjector(log) as SlackMessage;

        await this._postMessage(log);
    }
    
    public async logError(error: string | Exception): Promise<void>
    {
        if (!this._includeError)
            return;
        
        let log: SlackMessage = {
            source: this.source,
            service: this.service,
            env: this.env,
            level: "Error",
            message: this.getErrorMessage(error),
            dateTime: this.getDateTime(),
            time: new Date().toISOString(),
            color: "#EF401D"
        };
        
        if (this.logInjector)
            log = this.logInjector(log) as SlackMessage;

        await this._postMessage(log);
    }
    
    private async _postMessage(log: SlackMessage): Promise<void>
    {
        try 
        {
            await this._app.client.chat.postMessage({
                channel: this._channel,
                text: `${log.level}: *${log.env}* ${log.service}`,
                attachments: [{
                    color: log.color,
                    blocks: [
                        {
                            type: "section",
                            text: {
                                type: "plain_text",
                                text: log.message
                            }
                        },
                        {
                            type: "context",
                            elements: [{
                                type: "plain_text",
                                text: log.dateTime
                            }]
                        }
                    ]
                }]
            });   
        }
        catch (error)
        {
            if (this._fallbackLogger)
            {
                await this._fallbackLogger.logWarning("Error while posting to slack.");
                await this._fallbackLogger.logError(error as any);
                await this._fallbackLogger.logWarning("Original error below");
                await this._fallbackLogger.logError(log.message);
            }
            else
            {
                console.warn("Error while posting to slack.");
                console.error(error as any);
                console.warn("Original error below");
                console.error(log.message);
            }
        }
    }
}

type SlackMessage = LogRecord & { color: string; };

class DummyReceiver implements Receiver
{
    // @ts-expect-error: not used atm
    public init(app: App<StringIndexed>): void
    {
        // no-op
    }
    
    // @ts-expect-error: not used atm
    public start(...args: Array<any>): Promise<unknown>
    {
        return Promise.resolve();
    }
    
    // @ts-expect-error: not used atm
    public stop(...args: Array<any>): Promise<unknown>
    {
        return Promise.resolve();
    }
}