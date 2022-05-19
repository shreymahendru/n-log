import * as Assert from "assert";
import { ConsoleLogger } from "../src/console-logger";
import { LogDateTimeZone } from "../src";
// import * as moment from "moment-timezone";



suite("Date", () =>
{
    test("Epoch to local", async () =>
    {
        // let now = Date.now();
        // console.log("now", now);
        // console.log("now", new Date(now).toString());
        
        // setTimeout(() =>
        // {
        //     let then = Date.now();
        //     console.log("then", then);
        //     console.log("then", new Date(then).toString());
            
        //     console.log("now", now);
        //     console.log("now", new Date(now).toString());
            
        //     // let utcDate = new Date(Date.UTC(96, 11, 1, 0, 0, 0));
            
        //     Assert.ok(true);
        //     done();
            
            
        // }, 1500);
        
        
        // const now = Date.now();
        
        // const now = moment();
        
        // let utc = now.format();
        // console.log("utc", utc);
        
        // const eastern = now.tz("America/New_York").format();
        // console.log("eastern", eastern);
        
        // const pacific = now.tz("America/Los_Angeles").format();
        // console.log("pacific", pacific);
        
        // utc = now.utc().format();
        // console.log("utc", utc);
        
        const defaultLogger = new ConsoleLogger();
        await defaultLogger.logWarning("This is a warning default");
        
        const utcLogger = new ConsoleLogger(LogDateTimeZone.utc);
        await utcLogger.logWarning("This is a warning utc");
        
        const localLogger = new ConsoleLogger(LogDateTimeZone.local);
        await localLogger.logWarning("This is a warning local");
        
        const estLogger = new ConsoleLogger(LogDateTimeZone.est);
        await estLogger.logWarning("This is a warning est");
        
        const pstLogger = new ConsoleLogger(LogDateTimeZone.pst);
        await pstLogger.logWarning("This is a warning pst");
        
        
        
        
        Assert.ok(true);
    });
});