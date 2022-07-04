import Options from "../../../Options";
import delay from "delay";
import isElectron from "is-electron";
import electronLog from "electron-log";


const Client = async (config) => new Promise(async (resolve, rejected) => {
    try {
        //"development" | "production" | "none"
        let serverState = (config.serverState === Options.SERVER_STATE_DEVELOPMENT) ? "development" :
            (config.serverState === Options.SERVER_STATE_PRODUCTION) ? "production" : "none";

        await mProgressBar.increment({
            state: Options.LOADING_STATE,
            descriptions: "merged setting for socket io engine"
        });
        await delay(Options.DELAY_TIME);
        /** Socket IO */
        //await Server.setMaxListeners(config.settings.maxListeners);
        await (isElectron()) ? electronLog.info({state: Options.LOADING_STATE, descriptions: "http module"}) :
            mProgressBar.increment({state: Options.LOADING_STATE, descriptions: "http module"});
        await delay(Options.DELAY_TIME);

        await (isElectron()) ? electronLog.info({state: Options.LOADED_STATE, descriptions: "http module"}) :
            mProgressBar.increment({state: Options.LOADED_STATE, descriptions: "http module"});
        await delay(Options.DELAY_TIME);

        let socketIo = await import("socket.io-client").catch(async (reason) => {
            await (isElectron()) ? electronLog.info({ state : Options.ERROR_STATE, descriptions : "module socket.io client not exist. please install first for use"}) :
                mProgressBar.increment( { state : Options.ERROR_STATE, descriptions : "module socket.io client not exist. please install first for use"});
            await delay(Options.DELAY_TIME);
            await rejected({ status : false, code : 500, msg : `Engine Socket Client Io error Imported`, error : reason });
        });

        let mIo = await socketIo.io( config.serverHost, config.settings );
        await resolve({ io : mIo });
        //################################################
    }catch (e) {
        await rejected({ status : false, code : 500, msg : `Engine Socket Client Io error`, error : e });
    }
});

export default Client