import {Config} from "./../../../system/index.module.d";
import {existsSync} from "fs";
import Options from "./../../Options"
import chalk from "chalk";

/** Melakukan Setting Export Default Untuk File JS Ini **/
export default (config) => new Promise(async (resolve, rejected) => {
    /**
     * Melakukan Pengecekan Apakah Server Mode DEVELOPMENT ATAU PRODUCTION
     * Jika True, Maka Server Menampilkan Log System, Jika Tidak Mematikan Mode Logger
     *
     */
    if (config.serverState === Options.SERVER_STATE_DEVELOPMENT){
        /** Memuat Fastify Module Dengan logger True **/
        const AppEngine = require("fastify")({
            logger : {level: 'info'},
            trustProxy: true
        });
        /** Melakukan Resolve Chain Promise **/
        resolve(AppEngine);
    }else if (config.serverState === Options.SERVER_STATE_PRODUCTION) {
        /** Memuat Fastify Module Dengan logger True **/
        const AppEngine = require("fastify")({
            logger : {level: 'warn'},
            trustProxy : true
        });
        /** Melakukan Resolve Chain Promise **/
        resolve(AppEngine);
    }
    /**
     * Akhir Dari Melakukan Pengecekan Apakah Server Mode DEVELOPMENT ATAU PRODUCTION
     * Jika True, Maka Server Menampilkan Log System, Jika Tidak Mematikan Mode Logger
     *
     */
}).then( async (AppEngine) => {
    /** Menambahkan Dekorasi Ke App Engin e Socket IO **/
    await AppEngine.register(require('fastify-socket.io'), {
        cors: {
            origin: '*',
        }
    })
    /** Mengembalikan Fungsi App Engine **/
    return AppEngine;

}).then( async (AppEngine) => {
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
            return AppEngine;
    }
}).then( async (AppEngine) => {
    /*const fCaching = await require('fastify-caching')
    await AppEngine.register(fCaching,
        {privacy: fCaching.privacy.PUBLIC},
        (err) => { if (err) throw err });
    return AppEngine;*/
    return AppEngine;
}).then(async (AppEngine) => {
    await AppEngine.register(require("fastify-cors"));
    return AppEngine;
}).then(async (AppEngine) => {
    await AppEngine.register(require('fastify-multipart'), { attachFieldsToBody: true })
    return AppEngine;
}).then( async (AppEngine) => {
    const appCookie = require('fastify-cookie');
    await AppEngine.register(appCookie, {
        secret: config.settings.secretKey,
        path : "/"
    });
    return AppEngine;
}).then( async (AppEngine) => {
    await AppEngine.register(require('fastify-compress'), { global: true })
    return AppEngine;
}).then( async (AppEngine) => {
    await AppEngine.register(require('fastify-helmet'), { contentSecurityPolicy: false })
    return AppEngine;
}).then( async (AppEngine) => {
    await AppEngine.register(require('fastify-log'));
    return AppEngine;
}).then( async (AppEngine) => {
    await AppEngine.register(require("fastify-jwt"), { secret : Config.Server.SecretConfig.EncryptSecret });
    return AppEngine;
}).then(async (AppEngine) => {
    await AppEngine.register(require("fastify-formbody"));
    return AppEngine;
}).then(async (AppEngine) => {
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
});