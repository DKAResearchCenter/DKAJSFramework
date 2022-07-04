import Options from "../../../Options";
import delay from "delay";
import Config from "../../../Config";
import isElectron from "is-electron";
import electronLog from "electron-log";
import fs from "fs";
import path from "path";
import EngineHook from "./EngineHook";
import StateHook from "./StateHook";
import HookHandler from "./HookHandler";

/**
 *
 * @param {{app: boolean, settings: {localtunnel: boolean, pingInterval: number, reactCompress: boolean, cors: {origin: string}, reactHot: boolean, secretKey: string, perMessageDeflate: boolean, ngrok: {authToken: null, enabled: boolean}, reactOpen: boolean, firewall: [], connectTimeout: number, pingTimeout: number, maxListeners: number}, serverView: number, serverEngine: Number, serverName: *|null, serverPort: number, secure: boolean, serverHost: string, serverEnabled: Boolean, serverState: ("dev"|"prod"), library: {socketIo: {cors: {origin: string}, perMessageDeflate: boolean}}, plugin: {FastifyGracefulShutdown: {options: {}, enabled: boolean}, FastifyCookie: {options: {}, enabled: boolean}, FastifyCors: {options: {origin: string}, enabled: boolean}, FastifyRateLimit: {options: {}, enabled: boolean}, FastifyJwt: {options: {}, enabled: boolean}, FastifyMultipart: {options: {}, enabled: boolean}, FastifyLog: {options: {}, enabled: boolean}, FastifyFormBody: {options: {}, enabled: boolean}, FastifyHelmet: {options: {contentSecurityPolicy: boolean}, enabled: boolean}, FastifyCompress: {options: {global: boolean}, enabled: boolean}, FastifySocketIO: {options: {cors: {origin: string}, perMessageDeflate: boolean}, enabled: boolean}, FastifyPointOfView: {options: {}, enabled: boolean}}, options: {layoutDir: string, distDir: string, backupDir: string, autoloadDir: string, uploadDir: string, appDir: string, srcDir: string, assetsDir: string, publicDir: string}, serverDomain: (Boolean|String), http2: boolean, Webpack: {mode: string, resolve: {extensions: string[]}, module: {rules: [{test: RegExp, use: {loader: string, options: {presets: string[], plugins: string[]}}, exclude: RegExp},{test: RegExp, use: string[]},{test: RegExp, use: [{loader: string},{loader: string}]}]}, target: string}}} config
 * @return {Promise<WebSocket>}
 */
const Server  = async (config = Config.Server) => new Promise(async (resolve, reject) => {
    try {
        //"development" | "production" | "none"
        let serverState = (config.serverState === Options.SERVER_STATE_DEVELOPMENT) ? "development" :
            (config.serverState === Options.SERVER_STATE_PRODUCTION) ? "production" : "none";

        await mProgressBar.increment({state: Options.LOADING_STATE, descriptions: "merged setting for socket io engine"});
        await delay(Options.DELAY_TIME);
        /**
         * Socket IO
         */
        //await Server.setMaxListeners(config.settings.maxListeners);
        await (isElectron()) ? electronLog.info({ state : Options.LOADING_STATE, descriptions : "http module"}) :
            mProgressBar.increment( { state : Options.LOADING_STATE, descriptions : "http module"});
        await delay(Options.DELAY_TIME);

        let http = await import("http");
        await (isElectron()) ? electronLog.info({ state : Options.LOADED_STATE, descriptions : "http module"}) :
            mProgressBar.increment( { state : Options.LOADED_STATE, descriptions : "http module"});
        await delay(Options.DELAY_TIME);
        /**
         *
         * @type {{BroadcastOperator: any, Socket: any, Server: Server, RemoteSocket: any, Event: any, ServerOptions: ServerOptions, Namespace: any}}
         */
        let socketIo = await import("socket.io").catch(async (reason) => {
            await (isElectron()) ? electronLog.info({ state : Options.ERROR_STATE, descriptions : "module socket.io not exist. please install first for use"}) :
                mProgressBar.increment( { state : Options.ERROR_STATE, descriptions : "module socket.io not exist. please install first for use"});
            await delay(Options.DELAY_TIME);
            await rejected({ status : false, code : 500, msg : `Engine Socket Server Io error Imported`, error : reason });
        });
        //################################################
        await (isElectron()) ? electronLog.info({ state : Options.LOADED_STATE, descriptions : "socket.io loaded"}) :
            mProgressBar.increment( { state : Options.LOADED_STATE, descriptions : "socket.io loaded"});
        await delay(Options.DELAY_TIME);

        await (isElectron()) ? electronLog.info({ state : Options.LOADING_STATE, descriptions : "http function create server"}) :
            mProgressBar.increment( { state : Options.LOADING_STATE, descriptions : "http function create server"});
        await delay(Options.DELAY_TIME);
        /**
         *
         * @type {Server}
         */
        let mServer = await http.createServer();

        await (isElectron()) ? electronLog.info({ state : Options.LOADED_STATE, descriptions : "http function create server"}) :
            mProgressBar.increment( { state : Options.LOADED_STATE, descriptions : "http function create server"});
        await delay(Options.DELAY_TIME);
        /**
         *
         * @type {Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>}
         */
        let mIo = new socketIo.Server(mServer, config.settings);
        /** The Global Middleware Module Socket.io **/
        await Promise.all([
            await EngineHook(mIo, config),
            await HookHandler(mIo, config),
            await StateHook(mIo, config),
        ]);
        /** End The Global Middleware Module Socket.io **/
        await resolve({ io : mIo, http : mServer });
    }catch (e) {
        await reject({ status : false, code : 500, msg : `Engine Socket Io error`, error : e });
    }
})

export default Server;