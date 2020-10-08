import * as Assert from "assert";
import { FileLogger, LogDateTimeZone } from "../src";


suite("FileLogger tests", () =>
{
    test("Basic tests", async () =>
    {
        const logger = new FileLogger("/Users/nivin/Development/test", 7, LogDateTimeZone.est);
        
        await logger.logInfo("I am an info");
        
        await logger.logWarning("I am a warning");
        
        await logger.logError("I am an error");
        
        Assert.ok(true);
    });
});