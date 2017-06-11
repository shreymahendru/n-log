import * as Assert from "assert";

suite("Date", () =>
{
    test("UTC", (done) =>
    {
        let now = Date.now();
        console.log("now", now);
        console.log("now", new Date(now).toString());
        
        setTimeout(() =>
        {
            let then = Date.now();
            console.log("then", then);
            console.log("then", new Date(then).toString());
            
            console.log("now", now);
            console.log("now", new Date(now).toString());
            
            // let utcDate = new Date(Date.UTC(96, 11, 1, 0, 0, 0));
            
            Assert.ok(true);
            done();
            
            
        }, 1500);
        
        
    });
});