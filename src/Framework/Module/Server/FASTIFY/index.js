import DKA from "../../index.module.d.js";
import {existsSync} from "fs";
import isElectron from "is-electron";
import electronLog from "electron-log";
import delay from "delay";
import path from "path";
import Options from "./../../Options";
import appCookie from "fastify-cookie";

/** Melakukan Setting Export Default Untuk File JS Ini **/
export default async(config) => {
    let mSetting = {};
    /**
     * Melakukan Pengecekan Apakah Server Mode DEVELOPMENT ATAU PRODUCTION
     * Jika True, Maka Server Menampilkan Log System, Jika Tidak Mematikan Mode Logger
     *
     */

    function checkModuleExist(name){
        try {
            require.resolve(name);
            return true;
        }catch (e) {
            return false;
        }
    }

    const ServerInstance = await new Promise(async (resolve, rejected) => {
        switch (config.serverState) {
            case Options.SERVER_STATE_DEVELOPMENT :
                mSetting = {
                    logger : { level: 'warn'},
                    connectionTimeout : 180000,
                    pluginTimeout : 20000,
                    trustProxy: true
                };
                if (config.http2){
                    mSetting.http2 = true;
                }
                if (config.secure !== false){
                    mSetting.https = config.secure;
                }
                if (checkModuleExist("fastify")){
                    await (isElectron()) ? electronLog.info({ state : Options.LOADING_STATE, descriptions : "require [Fastify] core engine Development"}) :
                        mProgressBar.increment( { state : Options.LOADING_STATE, descriptions : "require [Fastify] core engine Development"});
                    await delay(Options.DELAY_TIME);
                    let AppEngine = await require("fastify")(mSetting);
                    await (isElectron()) ? electronLog.info({ state : Options.LOADED_STATE, descriptions : "require [Fastify] core engine Development"}) :
                        mProgressBar.increment( { state : Options.LOADED_STATE, descriptions : "require [Fastify] core engine Development"});
                    await delay(Options.DELAY_TIME);
                    resolve(AppEngine);
                }else{
                    await rejected({ status : false, code : 500, msg : `Module Fastify Server Engine is Not Found`});
                }
                break;
            case Options.SERVER_STATE_PRODUCTION :
                mSetting = {
                    logger : {level: 'warn'},
                    connectionTimeout : 180000,
                    trustProxy : true
                };
                if (config.http2){
                    mSetting.http2 = true;
                }

                if (config.secure !== false){
                    mSetting.https = config.secure;
                }
                if (checkModuleExist("fastify")){
                    await (isElectron()) ? electronLog.info({ state : Options.LOADING_STATE, descriptions : "require [Fastify] core engine Development"}) :
                        mProgressBar.increment( { state : Options.LOADING_STATE, descriptions : "require [Fastify] core engine Development"});
                    await delay(Options.DELAY_TIME);
                    let AppEngine = await require("fastify")(mSetting);
                    await (isElectron()) ? electronLog.info({ state : Options.LOADED_STATE, descriptions : "require [Fastify] core engine Development"}) :
                        mProgressBar.increment( { state : Options.LOADED_STATE, descriptions : "require [Fastify] core engine Development"});
                    await delay(Options.DELAY_TIME);d
                    resolve(AppEngine);
                }else{
                    await rejected({ status : false, code : 500, msg : `Module Fastify Server Engine is Not Found`});
                }
                break;
        }
    });
    const SocketIOInstance = async (AppEngine) => await new Promise(async (resolve, rejected) => {
        let mAppEngine = null;
        if (config.plugin.FastifySocketIO.enabled) {
            await (isElectron()) ? electronLog.info({ state : Options.LOADING_STATE, descriptions : "socket.io plugin"}) :
                mProgressBar.increment( { state : Options.LOADING_STATE, descriptions : "socket.io plugin"});
            await delay(Options.DELAY_TIME);
            if (checkModuleExist('fastify-socket.io')){
                /** Menambahkan Dekorasi Ke App Engin e Socket IO **/
                mAppEngine = await AppEngine.register(require('fastify-socket.io'), config.plugin.FastifySocketIO.options);
                /** Mengembalikan Fungsi App Engine **/
                await (isElectron()) ? electronLog.info({ state : Options.LOADED_STATE, descriptions : "socket.io plugin"}) :
                    mProgressBar.increment( { state : Options.LOADED_STATE, descriptions : "socket.io plugin"});
                await delay(Options.DELAY_TIME);
                await resolve(mAppEngine);
            }else{
                await (isElectron()) ? electronLog.info({ state : Options.ERROR_STATE, descriptions : "socket.io plugin Not Found"}) :
                    mProgressBar.increment( { state : Options.ERROR_STATE, descriptions : "socket.io plugin Not Found"});
                await delay(Options.DELAY_TIME);
                await rejected({ status : false, code : 500, msg : `socket.io enable but, plugin Not Found`});
            }
        }else{
            await resolve(AppEngine);
        }
    });
    const ServerViewInstance = async (AppEngine) => await new Promise(async (resolve, rejected) => {
        let mAppEngine = null;
        /** Mendaftarkan Module Tambahan Untuk Server Fastify **/
        switch (config.serverView){
            default :
                if (existsSync(config.options.layoutDir)){
                    await (isElectron()) ? electronLog.info({ state : Options.LOADING_STATE, descriptions : "view plugin"}) :
                        mProgressBar.increment( { state : Options.LOADING_STATE, descriptions : "view plugin"});
                    await delay(Options.DELAY_TIME);
                    if (checkModuleExist('point-of-view')){
                        mAppEngine = await AppEngine.register(require('point-of-view'), {
                            engine : {
                                ejs : require('ejs')
                            },
                            root : config.options.layoutDir,
                            /*viewExt: 'html'*/
                            includeViewExtension: true
                        });
                        await (isElectron()) ? electronLog.info({ state : Options.LOADED_STATE, descriptions : "view plugin"}) :
                            mProgressBar.increment( { state : Options.LOADED_STATE, descriptions : "view plugin"});
                        await delay(Options.DELAY_TIME);
                        await resolve(mAppEngine);
                    }else{
                        await (isElectron()) ? electronLog.info({ state : Options.WARNING_STATE, descriptions : "view plugin Not Found"}) :
                            mProgressBar.increment( { state : Options.WARNING_STATE, descriptions : "view plugin Not Found"});
                        await delay(Options.DELAY_TIME);
                        await rejected({ status : true, code : 500, msg : `View Plugin Not Found`});
                    }
                }else{
                    await (isElectron()) ? electronLog.info({ state : Options.WARNING_STATE, descriptions : "view plugin Disabled"}) :
                        mProgressBar.increment( { state : Options.WARNING_STATE, descriptions : "view plugin Disabled"});
                    await delay(Options.DELAY_TIME);
                    await resolve(AppEngine);
                }
        }
    });
    const CorsInstance = async (AppEngine) => await new Promise(async (resolve, rejected) => {
        let mAppEngine = null;
        if (config.plugin.FastifyCors.enabled){
            /** Mendaftarkan Module Tambahan Untuk Server Fastify **/
            await (isElectron()) ? electronLog.info({ state : Options.LOADING_STATE, descriptions : "cors plugin"}) :
                    mProgressBar.increment( { state : Options.LOADING_STATE, descriptions : "cors plugin"});
            await delay(Options.DELAY_TIME);
            if (checkModuleExist("@fastify/cors")){
                mAppEngine = await AppEngine.register(require("@fastify/cors"), config.plugin.FastifyCors.options);
                await (isElectron()) ? electronLog.info({ state : Options.LOADED_STATE, descriptions : "cors plugin"}) :
                    mProgressBar.increment( { state : Options.LOADED_STATE, descriptions : "cors plugin"});
                await delay(Options.DELAY_TIME);
                await resolve(mAppEngine);
            }else{
                await (isElectron()) ? electronLog.info({ state : Options.ERROR_STATE, descriptions : "cors plugin Not Found"}) :
                    mProgressBar.increment( { state : Options.ERROR_STATE, descriptions : "cors plugin Not Found"});
                await delay(Options.DELAY_TIME);
                await rejected({ status : false, code : 500, msg : `Plugin Cors Not Found`});
            }
        }else{
            await resolve(AppEngine);
        }
    });
    const RateLimitInstance = async (AppEngine) => await new Promise(async (resolve, rejected) => {
        let mAppEngine = null;
        if (config.plugin.FastifyRateLimit.enabled){
            await (isElectron()) ? electronLog.info({ state : Options.LOADING_STATE, descriptions : "rate limit plugin"}) :
                mProgressBar.increment( { state : Options.LOADING_STATE, descriptions : "rate limit plugin"});
            await delay(Options.DELAY_TIME);

            if(checkModuleExist("@fastify/rate-limit")){
                mAppEngine = await AppEngine.register(require("@fastify/rate-limit"), {
                    global : true,
                    max: 1000,
                    timeWindow: '1 minute'
                });
                await (isElectron()) ? electronLog.info({ state : Options.LOADED_STATE, descriptions : "rate limit plugin"}) :
                    mProgressBar.increment( { state : Options.LOADED_STATE, descriptions : "rate limit plugin"});
                await delay(Options.DELAY_TIME);
                await resolve(mAppEngine);
            }else{
                await (isElectron()) ? electronLog.info({ state : Options.ERROR_STATE, descriptions : "rate limit plugin Not Found"}) :
                    mProgressBar.increment( { state : Options.ERROR_STATE, descriptions : "rate limit plugin Not Found"});
                await delay(Options.DELAY_TIME);
                await rejected({ status : false, code : 500, msg : `Plugin Rate Limit Plugin Not Exist`});
            }
        }else{
            await resolve(AppEngine)
        }
    });
    const MultipartInstance = async (AppEngine) => await new Promise(async (resolve, rejected) => {
        let mAppEngine = null;
        if (config.plugin.FastifyMultipart.enabled){
            await (isElectron()) ? electronLog.info({ state : Options.LOADING_STATE, descriptions : "Multipart format plugin"}) :
                mProgressBar.increment( { state : Options.LOADING_STATE, descriptions : "Multipart format plugin"});
            await delay(Options.DELAY_TIME);
            if (checkModuleExist('@fastify/multipart')){
                mAppEngine = await AppEngine.register(require('@fastify/multipart'), { attachFieldsToBody: true });
                await (isElectron()) ? electronLog.info({ state : Options.LOADED_STATE, descriptions : "Multipart format plugin"}) :
                    mProgressBar.increment( { state : Options.LOADED_STATE, descriptions : "Multipart format plugin"});
                await delay(Options.DELAY_TIME);
                resolve(mAppEngine);
            }else{
                await (isElectron()) ? electronLog.info({ state : Options.ERROR_STATE, descriptions : "Multipart format plugin"}) :
                    mProgressBar.increment( { state : Options.ERROR_STATE, descriptions : "Multipart format plugin"});
                await delay(Options.DELAY_TIME);
                await rejected({ status : false, code : 500, msg : `Plugin Multipart format Not Exist`});
            }
        }else{
            await resolve(AppEngine);
        }
    });
    const CookieInstance = async(AppEngine) => await new Promise(async (resolve, rejected) => {
        let mAppEngine = null;
        if (config.plugin.FastifyCookie.enabled){
            await (isElectron()) ? electronLog.info({ state : Options.LOADING_STATE, descriptions : "Cookie plugin"}) :
                mProgressBar.increment( { state : Options.LOADING_STATE, descriptions : "Cookie plugin"});
            await delay(Options.DELAY_TIME);
            if (checkModuleExist('fastify-cookie')){
                mAppEngine = await AppEngine.register(require('fastify-cookie'), {
                    secret: config.settings.secretKey,
                    path : "/"
                });
                await (isElectron()) ? electronLog.info({ state : Options.LOADED_STATE, descriptions : "Cookie plugin"}) :
                    mProgressBar.increment( { state : Options.LOADED_STATE, descriptions : "Cookie plugin"});
                await delay(Options.DELAY_TIME);
                await resolve(mAppEngine)
            }else{
                await (isElectron()) ? electronLog.info({ state : Options.ERROR_STATE, descriptions : "Cookie plugin Not Found"}) :
                    mProgressBar.increment( { state : Options.ERROR_STATE, descriptions : "Cookie plugin Not Found"});
                await delay(Options.DELAY_TIME);
                await rejected({ status : false, code : 500, msg : `Cookie Plugin enabled, But Module Not Found`});
            }
        }else{
            resolve(AppEngine);
        }
    });
    const CompressInstance = async (AppEngine) => await new Promise(async (resolve, rejected) => {
        let mAppEngine = null;

        if (config.plugin.FastifyCompress.enabled){
            await (isElectron()) ? electronLog.info({ state : Options.LOADING_STATE, descriptions : "Compressing plugin"}) :
                mProgressBar.increment( { state : Options.LOADING_STATE, descriptions : "Compressing plugin"});
            await delay(Options.DELAY_TIME);
            if (checkModuleExist('fastify-compress')){
                mAppEngine = await AppEngine.register(require('fastify-compress'), config.plugin.FastifyCompress.options);
                await (isElectron()) ? electronLog.info({ state : Options.LOADED_STATE, descriptions : "Compressing plugin"}) :
                    mProgressBar.increment( { state : Options.LOADED_STATE, descriptions : "Compressing plugin"});
                await delay(Options.DELAY_TIME);
                await resolve(mAppEngine);
            }else{
                await (isElectron()) ? electronLog.info({ state : Options.ERROR_STATE, descriptions : "Compressing plugin Not Found"}) :
                    mProgressBar.increment( { state : Options.ERROR_STATE, descriptions : "Compressing plugin Not Found"});
                await delay(Options.DELAY_TIME);
                rejected({ status : true, code : 500, msg : `Compressing Plugin Enabled But Not Found`});
            }
        }else{
            await resolve(AppEngine);
        }
    });
    const HelmetInstance = async (AppEngine) => await new Promise(async (resolve, rejected) => {
        let mAppEngine = null;
        if (config.plugin.FastifyHelmet.enabled){
            await (isElectron()) ? electronLog.info({ state : Options.LOADING_STATE, descriptions : "Helmet plugin"}) :
                mProgressBar.increment( { state : Options.LOADING_STATE, descriptions : "Helmet plugin"});
            await delay(Options.DELAY_TIME);
            if (checkModuleExist("@fastify/helmet")){
                mAppEngine = await AppEngine.register(require('@fastify/helmet'), config.plugin.FastifyHelmet.options);
                await (isElectron()) ? electronLog.info({ state : Options.LOADED_STATE, descriptions : "Helmet plugin"}) :
                    mProgressBar.increment( { state : Options.LOADED_STATE, descriptions : "Helmet plugin"});
                await delay(Options.DELAY_TIME);
                await resolve(mAppEngine);
            }else{
                await (isElectron()) ? electronLog.info({ state : Options.ERROR_STATE, descriptions : "Helmet plugin Not Found"}) :
                    mProgressBar.increment( { state : Options.ERROR_STATE, descriptions : "Helmet plugin Not Found"});
                await delay(Options.DELAY_TIME);
                await rejected({ status : false, code : 500, msg : `Helmet Plugin Is Enabled But Not Found`});
            }
        }else{
            await resolve(AppEngine);
        }
    });
    const LoggingInstance = async (AppEngine) => await new Promise(async (resolve, rejected) => {
        let mAppEngine = null;
        if (config.plugin.FastifyLog.enabled){
            await (isElectron()) ? electronLog.info({ state : Options.LOADING_STATE, descriptions : "Logging plugin"}) :
                mProgressBar.increment( { state : Options.LOADING_STATE, descriptions : "Logging plugin"});
            await delay(Options.DELAY_TIME);
            if (checkModuleExist('fastify-log')){
                mAppEngine = await AppEngine.register(require('fastify-log'), config.plugin.FastifyLog.options);
                await (isElectron()) ? electronLog.info({ state : Options.LOADED_STATE, descriptions : "Logging plugin"}) :
                    mProgressBar.increment( { state : Options.LOADED_STATE, descriptions : "Logging plugin"});
                await delay(Options.DELAY_TIME);
                await resolve(mAppEngine);
            }else{
                await (isElectron()) ? electronLog.info({ state : Options.ERROR_STATE, descriptions : "Logging plugin Not Found"}) :
                    mProgressBar.increment( { state : Options.ERROR_STATE, descriptions : "Logging plugin Not Found"});
                await delay(Options.DELAY_TIME);
                await rejected({ status : false, code : 500, msg : `Logging Plugin Is Enabled But Not Found`});
            }
        }else{
            await resolve(AppEngine);
        }
    });
    const GracefulShutdownInstance = async (AppEngine) => await new Promise(async (resolve, rejected) => {
        let mAppEngine = null;
        if (config.plugin.FastifyGracefulShutdown.enabled){
            await (isElectron()) ? electronLog.info({ state : Options.LOADING_STATE, descriptions : "Shutdown plugin"}) :
                mProgressBar.increment( { state : Options.LOADING_STATE, descriptions : "Shutdown plugin"});
            await delay(Options.DELAY_TIME);

            if (checkModuleExist('fastify-graceful-shutdown')){
                mAppEngine = await AppEngine.register(require('fastify-graceful-shutdown'));
                await (isElectron()) ? electronLog.info({ state : Options.LOADED_STATE, descriptions : "Shutdown plugin"}) :
                    mProgressBar.increment( { state : Options.LOADED_STATE, descriptions : "Shutdown plugin"});
                await delay(Options.DELAY_TIME);
                await resolve(mAppEngine);
            }else{
                await (isElectron()) ? electronLog.info({ state : Options.ERROR_STATE, descriptions : "Shutdown plugin Module Not Found"}) :
                    mProgressBar.increment( { state : Options.ERROR_STATE, descriptions : "Shutdown plugin Module Not Found"});
                await delay(Options.DELAY_TIME);
                await rejected({ status : false, code : 500, msg : `Shutdown Plugin Is Enabled But Not Found`});
            }
        }else{
            await resolve(AppEngine);
        }
    });
    const JWTInstance = async (AppEngine) =>  await new Promise(async (resolve, rejected) => {
        let mAppEngine = null;
        if (config.plugin.FastifyJwt.enabled){
            await (isElectron()) ? electronLog.info({ state : Options.LOADING_STATE, descriptions : "JWT Tokens plugin"}) :
                mProgressBar.increment( { state : Options.LOADING_STATE, descriptions : "JWT Tokens plugin"});
            await delay(Options.DELAY_TIME);
            if (checkModuleExist("@fastify/jwt")){
                mAppEngine = await AppEngine.register(require("@fastify/jwt"), { secret : DKA.config.SecretConfig.EncryptSecret });
                await (isElectron()) ? electronLog.info({ state : Options.LOADED_STATE, descriptions : "JWT Tokens plugin"}) :
                    mProgressBar.increment( { state : Options.LOADED_STATE, descriptions : "JWT Tokens plugin"});
                await delay(Options.DELAY_TIME);
                await resolve({ status : false, code : 500, msg : `JWT Plugin Enabled But Not Found`});
            }else{
                await (isElectron()) ? electronLog.info({ state : Options.ERROR_STATE, descriptions : "JWT Tokens plugin Not Found"}) :
                    mProgressBar.increment( { state : Options.ERROR_STATE, descriptions : "JWT Tokens plugin Not Found"});
                await delay(Options.DELAY_TIME);
                await rejected({ status : false, code : 500, msg : `JTW Tokens Plugin Enabled But Not Found`});
            }
        }else{
            await resolve(AppEngine);
        }
    });
    const FormBodyInstance = async (AppEngine) =>  await new Promise(async (resolve, rejected) => {
        let mAppEngine = null;
        if (config.plugin.FastifyFormBody.enabled){
            await (isElectron()) ? electronLog.info({ state : Options.LOADING_STATE, descriptions : "Form Body plugin"}) :
                mProgressBar.increment( { state : Options.LOADING_STATE, descriptions : "Form Body plugin"});
            await delay(Options.DELAY_TIME);
            if (checkModuleExist("@fastify/formbody")){
                mAppEngine = await AppEngine.register(require("@fastify/formbody"));
                await (isElectron()) ? electronLog.info({ state : Options.LOADED_STATE, descriptions : "Form Body plugin"}) :
                    mProgressBar.increment( { state : Options.LOADED_STATE, descriptions : "Form Body plugin"});
                await delay(Options.DELAY_TIME);
                await resolve(mAppEngine);
            }else{
                await (isElectron()) ? electronLog.info({ state : Options.LOADED_STATE, descriptions : "Form Body plugin Not Found"}) :
                    mProgressBar.increment( { state : Options.LOADED_STATE, descriptions : "Form Body plugin Not Found"});
                await delay(Options.DELAY_TIME);
                await rejected({ status : false, code : 500, msg : `Form Body Plugin Enabled But Not Found`});
            }
        }else{
            await resolve(AppEngine);
        }
    });
    const AssetDirInstance = async (AppEngine) => await new Promise(async (resolve, rejected) => {
        let mAppEngine = null;
        if (existsSync(config.options.assetsDir)){

            await (isElectron()) ? electronLog.info({ state : Options.LOADING_STATE, descriptions : "Assets Dir Mounting"}) :
                mProgressBar.increment( { state : Options.LOADING_STATE, descriptions : "Assets Dir Mounting"});
            await delay(Options.DELAY_TIME);

            if (checkModuleExist("@fastify/static")){
                mAppEngine = await AppEngine.register(require("@fastify/static"), {
                    root : config.options.assetsDir,
                    decorateReply: false
                });
                await (isElectron()) ? electronLog.info({ state : Options.LOADED_STATE, descriptions : "Assets Dir Mounting"}) :
                    mProgressBar.increment( { state : Options.LOADED_STATE, descriptions : "Assets Dir Mounting"});
                await delay(Options.DELAY_TIME);
                await resolve(mAppEngine);
            }else{
                await (isElectron()) ? electronLog.info({ state : Options.ERROR_STATE, descriptions : "Assets Dir Mounting Not Found"}) :
                    mProgressBar.increment( { state : Options.ERROR_STATE, descriptions : "Assets Dir Mounting Not Found"});
                await delay(Options.DELAY_TIME);
                await rejected({ status : false, code : 500, msg : `Asset Dir Plugin Enable But Not Found`});
            }
        }else{
            await resolve(AppEngine);
        }
    });
    const UploadDirInstance = async (AppEngine) => await new Promise(async (resolve, rejected) => {
        let mAppEngine = null;
        if (existsSync(config.options.uploadDir)){
            await (isElectron()) ? electronLog.info({ state : Options.LOADING_STATE, descriptions : "Upload Dir Mounting"}) :
                mProgressBar.increment( { state : Options.LOADING_STATE, descriptions : "Upload Dir Mounting"});
            await delay(Options.DELAY_TIME);
            if (checkModuleExist("@fastify/static")){
                mAppEngine = await AppEngine.register(require("@fastify/static"), {
                    root : config.options.uploadDir,
                    prefix: '/upload/',
                    decorateReply: false
                });
                await (isElectron()) ? electronLog.info({ state : Options.LOADED_STATE, descriptions : "Upload Dir Mounting"}) :
                    mProgressBar.increment( { state : Options.LOADED_STATE, descriptions : "Upload Dir Mounting"});
                await delay(Options.DELAY_TIME);
                await resolve(mAppEngine);
            }else{
                await (isElectron()) ? electronLog.info({ state : Options.ERROR_STATE, descriptions : "Upload Dir Mounting Not Found"}) :
                    mProgressBar.increment( { state : Options.ERROR_STATE, descriptions : "Upload Dir Mounting Not Found"});
                await delay(Options.DELAY_TIME);
                await rejected({status : false, code : 500, msg : `Upload Dir Is Enabled, But Not Found`});
            }

        }else{
            await resolve(AppEngine);
        }
    });

    let mAppEngine = null;
    await ServerInstance
        .then(async (AppEngine) => {
            await SocketIOInstance(AppEngine)
                .then(async (AppEngine) => {
                    await ServerViewInstance(AppEngine)
                        .then(async (AppEngine) => {
                            await CorsInstance(AppEngine)
                                .then(async (AppEngine) => {
                                    await RateLimitInstance(AppEngine)
                                        .then(async (AppEngine) => {
                                            await MultipartInstance(AppEngine)
                                                .then(async (AppEngine) => {
                                                    await CookieInstance(AppEngine)
                                                        .then(async (AppEngine) => {
                                                            await CompressInstance(AppEngine)
                                                                .then(async (AppEngine) => {
                                                                    await HelmetInstance(AppEngine)
                                                                        .then(async (AppEngine) => {
                                                                            await LoggingInstance(AppEngine)
                                                                                .then(async (AppEngine) => {
                                                                                    await GracefulShutdownInstance(AppEngine)
                                                                                        .then(async (AppEngine) => {
                                                                                            await JWTInstance(AppEngine)
                                                                                                .then(async (AppEngine) => {
                                                                                                    await FormBodyInstance(AppEngine)
                                                                                                        .then(async (AppEngine) => {
                                                                                                            await AssetDirInstance(AppEngine)
                                                                                                                .then(async (AppEngine) => {
                                                                                                                    await UploadDirInstance(AppEngine)
                                                                                                                        .then(async (AppEngine) => {
                                                                                                                            mAppEngine = AppEngine
                                                                                                                        }).catch(async (error) => {
                                                                                                                            throw error;
                                                                                                                        });
                                                                                                                }).catch(async (error) => {
                                                                                                                    throw error;
                                                                                                                });
                                                                                                        }).catch(async (error) => {
                                                                                                            throw error;
                                                                                                        });
                                                                                                }).catch(async (error) => {
                                                                                                    throw error;
                                                                                                });
                                                                                        }).catch(async (error) => {
                                                                                            throw error;
                                                                                        });
                                                                                }).catch(async (error) => {
                                                                                    throw error;
                                                                                });
                                                                        }).catch(async (error) => {
                                                                            throw error;
                                                                        });
                                                                }).catch(async (error) => {
                                                                    throw error;
                                                                });
                                                        }).catch(async (error) => {
                                                            throw error;
                                                        });
                                                }).catch(async (error) => {
                                                    throw error;
                                                });
                                        }).catch(async (error) => {
                                            throw error;
                                        });
                                }).catch(async (error) => {
                                    throw error;
                                });
                        }).catch(async (error) => {
                            throw error;
                        });
                }).catch(async (error) => {
                    throw error;
                });
        })
        .catch(async (error) => {
            await process.exit(1);
            throw error;
        });
    return mAppEngine;
};

