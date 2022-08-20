import * as Assert from "assert";
import { FileLogger, LogDateTimeZone } from "../src";


suite("FileLogger tests", () =>
{
    test("Basic tests", async () =>
    {
        const logger = new FileLogger({
            logDirPath: "/Users/nivin/Development/test",
            retentionDays: 7,
            logDateTimeZone: LogDateTimeZone.est
        });
        
        await logger.logInfo("I am an info");
        
        await logger.logWarning("I am a warning");
        
        await logger.logError("I am an error");
        
        Assert.ok(true);
    });
});