import {Config} from "./../../../system/index.module.d";
import {existsSync} from "fs";
import Options from "./../../Options"
import chalk from "chalk";

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
            logger : { level: 'info'},
            trustProxy: true
        };

        if (config.http2){
            mSetting.http2 = true;
        }

        if (config.secure !== false){
            mSetting.https = config.secure;
        }

        AppEngine = require("fastify")(mSetting);
        /** Melakukan Resolve Chain Promise **/

    }else if (config.serverState === Options.SERVER_STATE_PRODUCTION) {
        /** Memuat Fastify Module Dengan logger True **/
        const mSetting = {
            logger : {level: 'warn'},
            trustProxy : true
        };

        if (config.http2){
            mSetting.http2 = true;
        }

        if (config.secure !== false){
            mSetting.https = config.secure;
        }

        AppEngine = require("fastify")(mSetting);
        /** Melakukan Resolve Chain Promise **/
    }
    /**
     * Akhir Dari Melakukan Pengecekan Apakah Server Mode DEVELOPMENT ATAU PRODUCTION
     * Jika True, Maka Server Menampilkan Log System, Jika Tidak Mematikan Mode Logger
     *
     */

    /** Menambahkan Dekorasi Ke App Engin e Socket IO **/
    await AppEngine.register(require('fastify-socket.io'), {
        cors: {
            origin: '*',
        }
    });
    /** Mengembalikan Fungsi App Engine **/

    /** Mendaftarkan Module Tambahan Untuk Server Fastify **/
    switch (config.serverView){
        default :
            if (existsSync(config.options.layoutDir)){
                await AppEngine.register(require('point-of-view'), {
                    engine : {
                        ejs : require('ejs')
                    },
                    root : config.options.layoutDir,
                    /*viewExt: 'html'*/
                    includeViewExtension: true
                });
            }else{
                console.log(chalk.red(` Pengaturan "options.layoutDir" Tidak Ditemukan. Harap Mendeklarasikan "options.layoutDir" Di Dalam Project "${ config.serverName}" `));

            }
    }
    /** Mendaftarkan Module Tambahan Untuk Server Fastify **/
    await AppEngine.register(require("fastify-cors"));
    await AppEngine.register(require("fastify-rate-limit"), {
        global : true,
        max: 1000,
        timeWindow: '1 minute'
    });

    await AppEngine.register(require('fastify-multipart'), { attachFieldsToBody: true })

    const appCookie = require('fastify-cookie');
    await AppEngine.register(appCookie, {
        secret: config.settings.secretKey,
        path : "/"
    });
    //await AppEngine.register(require('fastify-compress'), { global: true });
    await AppEngine.register(require('fastify-helmet'), { contentSecurityPolicy: false });
    await AppEngine.register(require('fastify-log'));
    await AppEngine.register(require("fastify-jwt"), { secret : Config.Server.SecretConfig.EncryptSecret });
    await AppEngine.register(require("fastify-formbody"));

    if (existsSync(config.options.assetsDir)){
        await AppEngine.register(require("fastify-static"), {
            root : config.options.assetsDir,
            decorateReply: false
        });
    }else{
        console.log(chalk.red(` Folder "assetsDir" Tidak Ditemukan. Harap Mendeklarasikan "options.assetsDir" Di Dalam Project "${ config.serverName}" Atau Membuat Folder "Assets" di Folder Project`))
    }
    if (existsSync(config.options.assetsDir)){
        await AppEngine.register(require("fastify-static"), {
            root : config.options.uploadDir,
            prefix: '/upload/',
            decorateReply: false
        });
    }else{
        console.log(chalk.red(` Folder "uploadDir" Tidak Ditemukan. Harap Mendeklarasikan "options.uploadDir" Di Dalam Project "${ config.serverName}" Atau Membuat Folder "Upload" di Folder Project`));
    }

    return AppEngine;
};

