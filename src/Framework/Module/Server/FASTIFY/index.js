import DKA from "../../index.module.d.js";
import {existsSync} from "fs";
import isElectron from "is-electron";
import electronLog from "electron-log";
import delay from "delay";
import Options from "./../../Options";

/** Melakukan Setting Export Default Untuk File JS Ini **/
export default async(config) => {
    let AppEngine;
    /**
     * Melakukan Pengecekan Apakah Server Mode DEVELOPMENT ATAU PRODUCTION
     * Jika True, Maka Server Menampilkan Log System, Jika Tidak Mematikan Mode Logger
     *
     */
    if (config.serverState === Options.SERVER_STATE_DEVELOPMENT){
        /** Memuat Fastify Module Dengan logger True **/
        const mSetting = {
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
        await (isElectron()) ? electronLog.info({ state : Options.LOADING_STATE, descriptions : "require [Fastify] core engine Development"}) :
            mProgressBar.increment( { state : Options.LOADING_STATE, descriptions : "require [Fastify] core engine Development"});
        await delay(Options.DELAY_TIME);
        AppEngine = await require("fastify")(mSetting);
        await (isElectron()) ? electronLog.info({ state : Options.LOADED_STATE, descriptions : "require [Fastify] core engine Development"}) :
            mProgressBar.increment( { state : Options.LOADED_STATE, descriptions : "require [Fastify] core engine Development"});
        await delay(Options.DELAY_TIME);
        /** Melakukan Resolve Chain Promise **/

    }else if (config.serverState === Options.SERVER_STATE_PRODUCTION) {
        /** Memuat Fastify Module Dengan logger True **/
        const mSetting = {
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

        await (isElectron()) ? electronLog.info({ state : Options.LOADING_STATE, descriptions : "require [Fastify] core engine Production"}) :
            mProgressBar.increment( { state : Options.LOADING_STATE, descriptions : "require [Fastify] core engine Production"});
        await delay(Options.DELAY_TIME);
        AppEngine = await require("fastify")(mSetting);
        await (isElectron()) ? electronLog.info({ state : Options.LOADED_STATE, descriptions : "require [Fastify] core engine Production"}) :
            mProgressBar.increment( { state : Options.LOADED_STATE, descriptions : "require [Fastify] core engine Production"});
        await delay(Options.DELAY_TIME);
        /** Melakukan Resolve Chain Promise **/
    }
    /**
     * Akhir Dari Melakukan Pengecekan Apakah Server Mode DEVELOPMENT ATAU PRODUCTION
     * Jika True, Maka Server Menampilkan Log System, Jika Tidak Mematikan Mode Logger
     *
     */
    await (isElectron()) ? electronLog.info({ state : Options.LOADING_STATE, descriptions : "socket.io library"}) :
        mProgressBar.increment( { state : Options.LOADING_STATE, descriptions : "socket.io library"});
    await delay(Options.DELAY_TIME);
    /** Menambahkan Dekorasi Ke App Engin e Socket IO **/
    await AppEngine.register(require('fastify-socket.io'), config.library.socketIo);
    /** Mengembalikan Fungsi App Engine **/
    await (isElectron()) ? electronLog.info({ state : Options.LOADED_STATE, descriptions : "socket.io library"}) :
        mProgressBar.increment( { state : Options.LOADED_STATE, descriptions : "socket.io library"});
    await delay(Options.DELAY_TIME);
    /** Mendaftarkan Module Tambahan Untuk Server Fastify **/
    switch (config.serverView){
        default :
            if (existsSync(config.options.layoutDir)){
                await (isElectron()) ? electronLog.info({ state : Options.LOADING_STATE, descriptions : "view library"}) :
                    mProgressBar.increment( { state : Options.LOADING_STATE, descriptions : "view library"});
                await delay(Options.DELAY_TIME);
                await AppEngine.register(require('point-of-view'), {
                    engine : {
                        ejs : require('ejs')
                    },
                    root : config.options.layoutDir,
                    /*viewExt: 'html'*/
                    includeViewExtension: true
                });
                await (isElectron()) ? electronLog.info({ state : Options.LOADED_STATE, descriptions : "view library"}) :
                    mProgressBar.increment( { state : Options.LOADED_STATE, descriptions : "view library"});
                await delay(Options.DELAY_TIME);
            }else{
                await (isElectron()) ? electronLog.info({ state : Options.ERROR_STATE, descriptions : "view library"}) :
                    mProgressBar.increment( { state : Options.ERROR_STATE, descriptions : "view library"});
                await delay(Options.DELAY_TIME);
                console.info(` Pengaturan "options.layoutDir" Tidak Ditemukan. Harap Mendeklarasikan "options.layoutDir" Di Dalam Project "${ config.serverName}" Atau Membuat Folder "Layout" di Folder Project `);
            }
    }
    /** Mendaftarkan Module Tambahan Untuk Server Fastify **/
    await (isElectron()) ? electronLog.info({ state : Options.LOADING_STATE, descriptions : "cors library"}) :
        mProgressBar.increment( { state : Options.LOADING_STATE, descriptions : "cors library"});
    await delay(Options.DELAY_TIME);
    await AppEngine.register(require("@fastify/cors"), config.library.fastifyCors);
    await (isElectron()) ? electronLog.info({ state : Options.LOADED_STATE, descriptions : "cors library"}) :
        mProgressBar.increment( { state : Options.LOADED_STATE, descriptions : "cors library"});
    await delay(Options.DELAY_TIME);

    await (isElectron()) ? electronLog.info({ state : Options.LOADING_STATE, descriptions : "rate limit library"}) :
        mProgressBar.increment( { state : Options.LOADING_STATE, descriptions : "rate limit library"});
    await delay(Options.DELAY_TIME);
    await AppEngine.register(require("@fastify/rate-limit"), {
        global : true,
        max: 1000,
        timeWindow: '1 minute'
    });
    await (isElectron()) ? electronLog.info({ state : Options.LOADED_STATE, descriptions : "rate limit library"}) :
        mProgressBar.increment( { state : Options.LOADED_STATE, descriptions : "rate limit library"});
    await delay(Options.DELAY_TIME);

    await (isElectron()) ? electronLog.info({ state : Options.LOADING_STATE, descriptions : "Multipart format library"}) :
        mProgressBar.increment( { state : Options.LOADING_STATE, descriptions : "Multipart format library"});
    await delay(Options.DELAY_TIME);
    await AppEngine.register(require('@fastify/multipart'), { attachFieldsToBody: true });
    await (isElectron()) ? electronLog.info({ state : Options.LOADED_STATE, descriptions : "Multipart format library"}) :
        mProgressBar.increment( { state : Options.LOADED_STATE, descriptions : "Multipart format library"});
    await delay(Options.DELAY_TIME);

    await (isElectron()) ? electronLog.info({ state : Options.LOADING_STATE, descriptions : "Cookie library"}) :
        mProgressBar.increment( { state : Options.LOADING_STATE, descriptions : "Cookie library"});
    await delay(Options.DELAY_TIME);
    const appCookie = require('fastify-cookie');
    await AppEngine.register(appCookie, {
        secret: config.settings.secretKey,
        path : "/"
    });
    await (isElectron()) ? electronLog.info({ state : Options.LOADED_STATE, descriptions : "Cookie library"}) :
        mProgressBar.increment( { state : Options.LOADED_STATE, descriptions : "Cookie library"});
    await delay(Options.DELAY_TIME);

    if (config.plugin.FastifyCompress.enabled){
        await (isElectron()) ? electronLog.info({ state : Options.LOADING_STATE, descriptions : "Compressing library"}) :
            mProgressBar.increment( { state : Options.LOADING_STATE, descriptions : "Compressing library"});
        await delay(Options.DELAY_TIME);
        if (existsSync(require('fastify-compress'))){
            await AppEngine.register(require('fastify-compress'), config.plugin.FastifyCompress.options);
            await (isElectron()) ? electronLog.info({ state : Options.LOADED_STATE, descriptions : "Compressing library"}) :
                mProgressBar.increment( { state : Options.LOADED_STATE, descriptions : "Compressing library"});
            await delay(Options.DELAY_TIME);
        }else{
            await (isElectron()) ? electronLog.info({ state : Options.ERROR_STATE, descriptions : "Compressing library Not Found"}) :
                mProgressBar.increment( { state : Options.ERROR_STATE, descriptions : "Compressing library Not Found"});
            await delay(Options.DELAY_TIME);
        }

    }
    if (config.plugin.FastifyHelmet.enabled){
        await (isElectron()) ? electronLog.info({ state : Options.LOADING_STATE, descriptions : "Helmet library"}) :
            mProgressBar.increment( { state : Options.LOADING_STATE, descriptions : "Helmet library"});
        await delay(Options.DELAY_TIME);
        if (existsSync(require("@fastify/helmet"))){
            await AppEngine.register(require('@fastify/helmet'), config.plugin.FastifyHelmet.options);
            await (isElectron()) ? electronLog.info({ state : Options.LOADED_STATE, descriptions : "Helmet library"}) :
                mProgressBar.increment( { state : Options.LOADED_STATE, descriptions : "Helmet library"});
            await delay(Options.DELAY_TIME);
        }else{
            await (isElectron()) ? electronLog.info({ state : Options.ERROR_STATE, descriptions : "Helmet library Not Found"}) :
                mProgressBar.increment( { state : Options.ERROR_STATE, descriptions : "Helmet library Not Found"});
            await delay(Options.DELAY_TIME);
        }

    }
    if (config.plugin.FastifyLog.enabled){
        await (isElectron()) ? electronLog.info({ state : Options.LOADING_STATE, descriptions : "Logging library"}) :
            mProgressBar.increment( { state : Options.LOADING_STATE, descriptions : "Logging library"});
        await delay(Options.DELAY_TIME);
        if (existsSync(require('fastify-log'))){
            await AppEngine.register(require('fastify-log'), config.plugin.FastifyLog.options);
            await (isElectron()) ? electronLog.info({ state : Options.LOADED_STATE, descriptions : "Logging library"}) :
                mProgressBar.increment( { state : Options.LOADED_STATE, descriptions : "Logging library"});
            await delay(Options.DELAY_TIME);
        }else{
            await (isElectron()) ? electronLog.info({ state : Options.ERROR_STATE, descriptions : "Logging library Not Found"}) :
                mProgressBar.increment( { state : Options.ERROR_STATE, descriptions : "Logging library Not Found"});
            await delay(Options.DELAY_TIME);
        }
    }
    if (config.plugin.FastifyGracefulShutdown.enabled){
        await (isElectron()) ? electronLog.info({ state : Options.LOADING_STATE, descriptions : "Shutdown library"}) :
            mProgressBar.increment( { state : Options.LOADING_STATE, descriptions : "Shutdown library"});
        await delay(Options.DELAY_TIME);

        if (existsSync(require('fastify-graceful-shutdown'))){
            await AppEngine.register(require('fastify-graceful-shutdown'));
            await (isElectron()) ? electronLog.info({ state : Options.LOADED_STATE, descriptions : "Shutdown library"}) :
                mProgressBar.increment( { state : Options.LOADED_STATE, descriptions : "Shutdown library"});
            await delay(Options.DELAY_TIME);
        }else{
            await (isElectron()) ? electronLog.info({ state : Options.ERROR_STATE, descriptions : "Shutdown library Module Not Found"}) :
                mProgressBar.increment( { state : Options.ERROR_STATE, descriptions : "Shutdown library Module Not Found"});
            await delay(Options.DELAY_TIME);
        }

    }
    if (config.plugin.FastifyJwt.enabled){
        await (isElectron()) ? electronLog.info({ state : Options.LOADING_STATE, descriptions : "JWT Tokens library"}) :
            mProgressBar.increment( { state : Options.LOADING_STATE, descriptions : "JWT Tokens library"});
        await delay(Options.DELAY_TIME);
        if (existsSync(require("@fastify/jwt"))){
            await AppEngine.register(require("@fastify/jwt"), { secret : DKA.config.SecretConfig.EncryptSecret });
            await (isElectron()) ? electronLog.info({ state : Options.LOADED_STATE, descriptions : "JWT Tokens library"}) :
                mProgressBar.increment( { state : Options.LOADED_STATE, descriptions : "JWT Tokens library"});
            await delay(Options.DELAY_TIME);
        }else{
            await (isElectron()) ? electronLog.info({ state : Options.ERROR_STATE, descriptions : "JWT Tokens library Not Found"}) :
                mProgressBar.increment( { state : Options.ERROR_STATE, descriptions : "JWT Tokens library Not Found"});
            await delay(Options.DELAY_TIME);
        }
    }
    if (config.plugin.FastifyFormBody.enabled){
        await (isElectron()) ? electronLog.info({ state : Options.LOADING_STATE, descriptions : "Form Body library"}) :
            mProgressBar.increment( { state : Options.LOADING_STATE, descriptions : "Form Body library"});
        await delay(Options.DELAY_TIME);

        if (existsSync(require("@fastify/formbody"))){
            await AppEngine.register(require("@fastify/formbody"));
            await (isElectron()) ? electronLog.info({ state : Options.LOADED_STATE, descriptions : "Form Body library"}) :
                mProgressBar.increment( { state : Options.LOADED_STATE, descriptions : "Form Body library"});
            await delay(Options.DELAY_TIME);
        }else{
            await (isElectron()) ? electronLog.info({ state : Options.LOADED_STATE, descriptions : "Form Body library Not Found"}) :
                mProgressBar.increment( { state : Options.LOADED_STATE, descriptions : "Form Body library Not Found"});
            await delay(Options.DELAY_TIME);
        }

    }
    if (existsSync(config.options.assetsDir)){
        await (isElectron()) ? electronLog.info({ state : Options.LOADING_STATE, descriptions : "Assets Dir Mounting"}) :
            mProgressBar.increment( { state : Options.LOADING_STATE, descriptions : "Assets Dir Mounting"});
        await delay(Options.DELAY_TIME);

        if (existsSync(require("@fastify/static"))){
            await AppEngine.register(require("@fastify/static"), {
                root : config.options.assetsDir,
                decorateReply: false
            });
            await (isElectron()) ? electronLog.info({ state : Options.LOADED_STATE, descriptions : "Assets Dir Mounting"}) :
                mProgressBar.increment( { state : Options.LOADED_STATE, descriptions : "Assets Dir Mounting"});
            await delay(Options.DELAY_TIME);
        }else{
            await (isElectron()) ? electronLog.info({ state : Options.ERROR_STATE, descriptions : "Assets Dir Mounting Not Found"}) :
                mProgressBar.increment( { state : Options.ERROR_STATE, descriptions : "Assets Dir Mounting Not Found"});
            await delay(Options.DELAY_TIME);
        }
    }else{
        await (isElectron()) ? electronLog.info({ state : Options.WARNING_STATE, descriptions : "Assets Dir Mounting"}) :
            mProgressBar.increment( { state : Options.WARNING_STATE, descriptions : "Assets Dir Mounting"});
        await delay(Options.DELAY_TIME);
    }


    if (existsSync(config.options.uploadDir)){

        await (isElectron()) ? electronLog.info({ state : Options.LOADING_STATE, descriptions : "Upload Dir Mounting"}) :
            mProgressBar.increment( { state : Options.LOADING_STATE, descriptions : "Upload Dir Mounting"});
        await delay(Options.DELAY_TIME);

        if (existsSync(require("@fastify/static"))){
            await AppEngine.register(require("@fastify/static"), {
                root : config.options.uploadDir,
                prefix: '/upload/',
                decorateReply: false
            });
            await (isElectron()) ? electronLog.info({ state : Options.LOADED_STATE, descriptions : "Upload Dir Mounting"}) :
                mProgressBar.increment( { state : Options.LOADED_STATE, descriptions : "Upload Dir Mounting"});
            await delay(Options.DELAY_TIME);
        }else{
            await (isElectron()) ? electronLog.info({ state : Options.ERROR_STATE, descriptions : "Upload Dir Mounting Not Found"}) :
                mProgressBar.increment( { state : Options.ERROR_STATE, descriptions : "Upload Dir Mounting Not Found"});
            await delay(Options.DELAY_TIME);
        }

    }else{
        await (isElectron()) ? electronLog.info({ state : Options.WARNING_STATE, descriptions : "Upload Dir Mounting"}) :
            mProgressBar.increment( { state : Options.WARNING_STATE, descriptions : "Upload Dir Mounting"});
        await delay(Options.DELAY_TIME);
    }

    return AppEngine;
};

