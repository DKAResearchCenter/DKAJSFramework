import Options from "../../Options";
import delay from "delay";
import Config from "../../Config";

/**
 *
 * @param {{app: boolean, settings: {localtunnel: boolean, pingInterval: number, reactCompress: boolean, cors: {origin: string}, reactHot: boolean, secretKey: string, perMessageDeflate: boolean, ngrok: {authToken: null, enabled: boolean}, reactOpen: boolean, firewall: [], connectTimeout: number, pingTimeout: number, maxListeners: number}, serverView: number, serverEngine: Number, serverName: *|null, serverPort: number, secure: boolean, serverHost: string, serverEnabled: Boolean, serverState: ("dev"|"prod"), library: {socketIo: {cors: {origin: string}, perMessageDeflate: boolean}}, plugin: {FastifyGracefulShutdown: {options: {}, enabled: boolean}, FastifyCookie: {options: {}, enabled: boolean}, FastifyCors: {options: {origin: string}, enabled: boolean}, FastifyRateLimit: {options: {}, enabled: boolean}, FastifyJwt: {options: {}, enabled: boolean}, FastifyMultipart: {options: {}, enabled: boolean}, FastifyLog: {options: {}, enabled: boolean}, FastifyFormBody: {options: {}, enabled: boolean}, FastifyHelmet: {options: {contentSecurityPolicy: boolean}, enabled: boolean}, FastifyCompress: {options: {global: boolean}, enabled: boolean}, FastifySocketIO: {options: {cors: {origin: string}, perMessageDeflate: boolean}, enabled: boolean}, FastifyPointOfView: {options: {}, enabled: boolean}}, options: {layoutDir: string, distDir: string, backupDir: string, autoloadDir: string, uploadDir: string, appDir: string, srcDir: string, assetsDir: string, publicDir: string}, serverDomain: (Boolean|String), http2: boolean, Webpack: {mode: string, resolve: {extensions: string[]}, module: {rules: [{test: RegExp, use: {loader: string, options: {presets: string[], plugins: string[]}}, exclude: RegExp},{test: RegExp, use: string[]},{test: RegExp, use: [{loader: string},{loader: string}]}]}, target: string}}} config
 * @return {Promise<WebSocket>}
 */
export default (config = Config.Server) => new Promise(async (resolve, reject) => {
    try {
        //"development" | "production" | "none"
        let serverState = (config.serverState === Options.SERVER_STATE_DEVELOPMENT) ? "development" :
            (config.serverState === Options.SERVER_STATE_PRODUCTION) ? "production" : "none";

        await mProgressBar.increment({state: Options.LOADING_STATE, descriptions: "merged setting for socket io engine"});
        await delay(Options.DELAY_TIME);
        /**
         * Socket IO
         */
        await import("socket.io")
            .then(async ({ Server }) => {
                await Server.setMaxListeners(config.settings.maxListeners)
                let mIo = await new Server(config.settings);
                await mIo.setMaxListeners(config.settings.maxListeners)
                await resolve(mIo);
            }).catch(async (error) => {
            await reject({ status : false, code : 500, msg : `Engine Socket Io Server Initialization error`, error : error });
        });

    }catch (e) {
        await reject({ status : false, code : 500, msg : `Engine Socket Io error`, error : e });
    }
});
