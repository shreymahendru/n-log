import { ConfigurationManager } from "@nivinjoseph/n-config";
import * as Assert from "assert";
import { SlackLogger } from "../src";


function doSomethingStupid(): void
{
    const s = 1 as any;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    console.log(s.trim());
}

suite.only("SlackLogger tests", () =>
{
    test("Basic tests", async () =>
    {
        const logger = new SlackLogger({
            slackBotToken: ConfigurationManager.getConfig("slackBotToken"),
            slackBotChannel: ConfigurationManager.getConfig("slackBotChannel")
        });
        
        await logger.logDebug("Hello world");
        
        await logger.logInfo("I am an info");

        await logger.logWarning("I am a warning");

        await logger.logError("I am an error");
        
        try 
        {
            doSomethingStupid();
        }
        catch (error)
        {
            await logger.logError(error as any);
        }
        
        

        Assert.ok(true);
    });
});