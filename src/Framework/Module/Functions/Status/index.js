import os from "os"


const Status = {
    getServerInfo : {
        RAM : {
            TotalMemory : os.totalmem(),
        },
        CPU : {
            test : os.cpus()

        },
        Uptime : os.uptime(),
    }
};