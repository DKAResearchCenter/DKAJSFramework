import os from "os";


const DevicesManager = {
    getOS : async () => {
        return {
            platform : os.platform(),
            release : os.release(),
            type : os.type(),
            arch : os.arch()
        }
    }
}


export default DevicesManager;