'use strict';
'use warning';
import _ from 'lodash';
import chalk from "chalk";
import {existsSync} from "fs";
import mNgrok from "ngrok";
import localtunnel from "localtunnel";

import HTTPEngine from "./../HTTP";
import ReactEngine from "./../REACT"
import FastifyEngine from "./../FASTIFY";
import ExpressEngine from "./../EXPRESS";
import path from "path";

/**
 * @description Ini Adalah Module Library Yang Berisi Konfigurasi Server Untuk Membangun Sebuah Arsitektur Webserver
 * @example
 *     new Server({
 *         serverEngine : Server.FASTIFY_CORE_ENGINE,
 *           serverState : Server.SERVER_STATE_PRODUCTION,
 *          serverHost : "localhost",
 *           serverPort : 8082,
 *          serverFirebase : mConfig.FirebaseConfig
 *       }, {
 *          entry: (AppEngine, opts, next) => {
 *             AppEngine.register(Themes.Fastify);
 *             AppEngine.register(Api.Fastify, {prefix : "api"});
 *             next();
 *          }
 *    }).start();
 * @see https://facebook.com/dhykavangga
 * @description Class Ini Berisi Tentang Membangun Sebuah Fungsi Web Server Di Dalam DKA Framework
 *
 */
class Server {

    /**
     *
     * @returns {string}
     * @constructor
     * @description Opsi Ini Dipilih Saat Anda AKan Menetapkan Status Server Ke Posisi Pengembangan.
     */
    static get SERVER_STATE_DEVELOPMENT (){
        return "dev";
    }

    /**
     *
     * @returns {string}
     * @constructor
     * @description Opsi Ini Dipilih Saat Anda AKan Menetapkan Status Server Ke Posisi Produksi
     */
    static get SERVER_STATE_PRODUCTION () {
        return "prod";
    }
    /***********************
    /**
     *
     * @returns {number}
     * @constructor
     */
    static get HTTP2_CORE_ENGINE() {
        return 1;
    }

    /**
     *
     * @returns {number}
     * @constructor
     */
    static get EXPRESS_CORE_ENGINE(){
        return 2;
    }

    /**
     * @static
     * @returns {number}
     * @constructor
     */
    static get FASTIFY_CORE_ENGINE(){
        return 3
    }

    /**
     * @static
     * @returns {number}
     * @constructor
     */
    static get RESTIFY_CORE_ENGINE(){
        return 4;
    }

    /**
     *
     * @returns {number}
     * @constructor
     */
    static get REACTJS_CORE_ENGINE(){
        return 5;
    }

    static get VIEW_POV_EJS(){
        return 1;
    }

    static get VIEW_POV_MUSTACHE(){
        return 2;
    }


    static get HOST_LOCALHOST(){
        return 1;
    }

    /**
     * @param {Number} config.serverName  Jenis Web Server Yang Digunakan Dalam Development
     * @param {Boolean} config.serverEnabled Jika Anda Ingin Mematikan Dan Menyalakan Server
     * @param {Number} config.serverEngine  Jenis Web Server Yang Digunakan Dalam Development
     * * @param {Number} config.serverView  Jenis Web Server Yang Digunakan Dalam Development
     * @param {Number} config.serverState Status Server Apakah Pengerjaan Atau Telah Produksi
     * @param {String} config.serverHost Adalah Alamat IP Atau Domain Server Di Akses
     * @param {String} config.serverPort Adalah Alamat Port Web Server
     *
     * @param {Boolean | Object} config.secure Untuk Mengaktifkan SSL atau HTTPS Protocol
     * @param {Object} config.settings Untuk Melakukan Option Tambahan
     *
     * @param {Object} config.settings.ngrok Untuk Melakukan Option Tambahan
     * @param {Object} config.settings.ngrok.enabled Untuk Melakukan Option Tambahan
     * @param {Object} config.settings.ngrok.authToken Untuk Melakukan Option Tambahan

     * @param {Object} config.settings.localtunnel Untuk Melakukan Option Tambahan
     *
     * @param {Object} config.options Untuk Melakukan Option Tambahan
     * * @param {Object} config.options.layoutDir Untuk Melakukan Option Tambahan
     * @param {Object} config.options.templateDir Untuk Melakukan Option Tambahan
     * @param {Object} config.options.assetsDir Untuk Melakukan Option Tambahan
     * * @param {Object} config.options.appDir Untuk Melakukan Option Tambahan
     * @param {Object} config.app Untuk Memulai App Engine Controller
     *
     */
    constructor(config) {
        /**
         * @const
         * @type {Object}
         */
        this.config = _.extend({
            /** ServerName For Naming App Server **/
            serverName : "",
            /** Server Domain For Naming Service Domain Access **/
            serverDomain : "http://localhost",
            /** Server State Overide Enable and Disabled **/
            serverEnabled : true,
            /** Memilih Jenis Server Engine Yang Ingin Digunakan **/
            serverEngine : Server.FASTIFY_CORE_ENGINE,
            /** Untuk melakukan Set View Template View Di Dalam Framework **/
            serverView : Server.VIEW_POV_EJS,
            /** State Server {Server.SERVER_STATE_DEVELOPMENT | Server.SERVER_STATE_PRODUCTION } **/
            serverState : Server.SERVER_STATE_DEVELOPMENT,
            /** Server Domain Location **/
            serverHost : "localhost",
            /** Server Port **/
            serverPort : 80,
            /** Activated Security System **/
            secure : false,
            /** Memulai System App Controller **/
            app : false,
            /** Setting System Settings **/
            settings : {
                /** Ngrok Tunneling **/
                ngrok : {
                    enabled : false,
                    authToken : null
                },
                localtunnel : false
            },
            /** Fungsi Untuk Melakukan Asset Delarasion Untuk Menentukan Folder Asets Di Dalam System Data **/
            options : {
                /** Deklarasi Menetapkan Lokasi Assets CSS dan JS Dir Dan Gambar Untuk Aplikasi **/
                layoutDir : path.join(require.main.filename,"./../Layout"),
                assetsDir : path.join(require.main.filename, "./../Assets"),
                appDir : path.join(require.main.filename, "./../Controller"),
                /** Fungsi Untuk Melakukan Folder Upload Di dalam aplikasi **/
                uploadDir : path.join(require.main.filename, "./../Upload")
                /** **/

            }
        }, config);


        /**
         *
         * @type {Promise<unknown>}
         */
        this.DKAServer = new Promise(async (resolve) => {
            /** Check Engine Server**/
            switch (this.config.serverEngine) {
                case Server.HTTP2_CORE_ENGINE :
                    //**************************************************/
                    HTTPEngine(this.config).then((AppEngine) => {
                        resolve(AppEngine);
                    });
                    /***************************************************/
                    break;
                case Server.EXPRESS_CORE_ENGINE :
                    //**************************************************/
                    await ExpressEngine(this.config).then(async (AppEngine) => {
                        await resolve(AppEngine);
                    });
                    /***************************************************/
                    break;
                case Server.FASTIFY_CORE_ENGINE :
                    //**************************************************/
                    await FastifyEngine(this.config).then(async (AppEngine) => {
                        await resolve(AppEngine);
                    });
                    /***************************************************/
                    break;
                case Server.RESTIFY_CORE_ENGINE :

                    break;
                case Server.REACTJS_CORE_ENGINE :
                    await ReactEngine(this.config).then(async (AppEngine) => {
                        await resolve(AppEngine);
                    })
                    break;
            }
        }).catch((error) => {
            if (error) throw error;
        });

        /**
         * @Promise Commit The Function To Listening Server Mode Listening;
         */
        new Promise((resolve) => {
            this.DKAServer.then( async (AppEngine) => {
                if (this.config.app != null){
                    switch (this.config.serverEngine) {
                        case Server.EXPRESS_CORE_ENGINE :
                            await AppEngine.use(this.options.app);
                            await resolve(AppEngine);
                            break;
                        case Server.FASTIFY_CORE_ENGINE :
                            if (this.config.app){
                                await AppEngine.register(async (app, opts, next) => {
                                    await app.register(this.config.app);
                                    await next();
                                });
                                await resolve(AppEngine);
                            }else{
                                await console.log(chalk.white("config `app` functionality is missing. do you want to use the `Controller` folder ? "))
                                if (existsSync(this.config.options.appDir)){
                                    await AppEngine.register(async (app, opts, next) => {
                                        await app.register(require(this.config.options.appDir))
                                        await next();
                                    })
                                    await resolve(AppEngine);
                                }else{
                                    await console.log(chalk.white("Directory `Controller` Not Exist. Please Make Dir in " + this.config.options.appDir + " "))
                                    await resolve(AppEngine);
                                }
                            }
                            break;
                        case Server.REACTJS_CORE_ENGINE :
                            await ReactEngine(this.config, this.config.app)
                            await resolve()
                            break;
                        case Server.RESTIFY_CORE_ENGINE :

                            break;
                    }
                }else{
                    await resolve(AppEngine);
                }
            });
        }).then( async (AppEngine) => {
            switch (this.config.serverEngine) {
                case Server.EXPRESS_CORE_ENGINE :

                    if (this.config.serverState === Server.SERVER_STATE_DEVELOPMENT) {
                        await AppEngine.listen(this.config.serverPort);
                    }else if (this.config.serverState === Server.SERVER_STATE_PRODUCTION){
                        await AppEngine.listen(this.config.serverPort);
                    }
                    break;

                /** Aksi Yang Akan Terjadi Jika Jenis Core Engine Adalah Fastify **/
                case Server.FASTIFY_CORE_ENGINE :
                    /** Melakukan Pengecekan Apakah State Server Adalah Development Atau Produksi **/
                    if (this.config.serverEnabled){
                        switch (this.config.serverState) {
                            case Server.SERVER_STATE_DEVELOPMENT:
                                /** Menciptakan Listening Server Agar Dapat Diakses **/
                                await new Promise(async (resolve, rejected) => {
                                    await AppEngine.listen(this.config.serverPort, this.config.serverHost, async (err, address) => {
                                        if (!err) {
                                            /*await open(address, { app: ['google chrome'] });*/
                                            if (this.config.settings.ngrok.enabled === true) {
                                                await mNgrok.connect({
                                                    addr: this.config.serverPort, // port or network address, defaults to 80
                                                    authtoken: this.config.settings.ngrok.authToken, // your authtoken from ngrok.com
                                                    onStatusChange: status => {
                                                        if (status === "connected") {

                                                        }
                                                    }, // 'closed' - connection is lost, 'connected' - reconnected
                                                    onLogEvent: data => {
                                                        console.log(chalk.white(data));
                                                    },

                                                    // 'closed' - connection is lost, 'connected' - reconnected
                                                });
                                            } else if (this.config.settings.localtunnel === true) {
                                                const tunnel = await localtunnel({port: this.config.serverPort});

                                                // the assigned public url for your tunnel
                                                // i.e. https://abcdefgjhij.localtunnel.me

                                                await console.log(chalk.white("=================================================================================================="))
                                                await console.log(chalk.whiteBright((`Berhasil !`)),
                                                    chalk.whiteBright((`Aplikasi "${this.config.serverName}" Server Dengan Alamat ${address}`)), "\n",
                                                    chalk.whiteBright((`LocalTunnel : "${tunnel.url}" Telah Berjalan `)));
                                                await console.log(chalk.white("=================================================================================================="))
                                                tunnel.on('close', () => {
                                                    // tunnels are closed
                                                });
                                            } else {

                                                await console.log(chalk.white("=================================================================================================="))
                                                await console.log(chalk.whiteBright((`Berhasil  !`)),
                                                    chalk.whiteBright((`Aplikasi "${this.config.serverName}" Server Dengan Alamat ${address}`)));
                                                await console.log(chalk.white("=================================================================================================="))
                                            }
                                        } else {
                                            rejected(err)
                                        }
                                    })


                                    //await console.log(chalk.whiteBright((`Aplikasi "${this.config.serverName}" Server Dengan Alamat ${address}  -> "${JSON.parse(tunnels).tunnels[0].public_url}" | "${JSON.parse(tunnels).tunnels[0].public_url}" Telah Berjalan `)));
                                    await resolve();
                                }).catch((e) => {
                                    console.log(chalk.red(` ${e.toString()}`))
                                })
                                break;
                            case Server.SERVER_STATE_PRODUCTION: /*rocess.env.NODE_ENV="production"*/
                                await new Promise(async (resolve, rejected) => {
                                    await AppEngine.listen(this.config.serverPort, "0.0.0.0", async (err, address) => {
                                        if (!err) {
                                            /*await open(address, { app: ['google chrome'] });*/
                                            if (this.config.settings.ngrok.enabled === true) {
                                                await mNgrok.connect({
                                                    addr: this.config.serverPort, // port or network address, defaults to 80
                                                    authtoken: this.config.settings.ngrok.authToken, // your authtoken from ngrok.com
                                                    onStatusChange: status => {
                                                        if (status === "connected") {

                                                        }
                                                    }, // 'closed' - connection is lost, 'connected' - reconnected
                                                    onLogEvent: data => {


                                                    },
                                                    // 'closed' - connection is lost, 'connected' - reconnected
                                                }).catch((e) => {
                                                    console.log(chalk.red(` ${e.toString()}`))
                                                });


                                                var tunnels = await mNgrok.getApi().get('api/tunnels');
                                                await console.log(chalk.whiteBright((`Aplikasi "${this.config.serverName}" Server Dengan Alamat ${address}  -> "${JSON.parse(tunnels).tunnels[0].public_url}" | "${JSON.parse(tunnels).tunnels[1].public_url}" Telah Berjalan `)));
                                                await resolve();
                                            } else if (this.config.settings.localtunnel === true) {
                                                const tunnel = await localtunnel({port: this.config.serverPort});

                                                // the assigned public url for your tunnel
                                                // i.e. https://abcdefgjhij.localtunnel.me
                                                await console.log(chalk.white("=================================================================================================="))
                                                await console.log(chalk.whiteBright((`Berhasil  !`)),
                                                    chalk.whiteBright((`Aplikasi "${this.config.serverName}" Server Dengan Alamat ${address}`)), "\n",
                                                    chalk.whiteBright((`LocalTunnel : "${tunnel.url}" Telah Berjalan `)));
                                                await console.log(chalk.white("=================================================================================================="))

                                                tunnel.on('close', () => {
                                                    // tunnels are closed
                                                });
                                            } else {

                                                await console.log(chalk.white("=================================================================================================="))
                                                await console.log(chalk.whiteBright((`Berhasil  !`)),
                                                    chalk.whiteBright((`Aplikasi "${this.config.serverName}" Server Dengan Alamat ${address}`)));
                                                await console.log(chalk.white("=================================================================================================="))
                                            }

                                        } else {
                                            rejected(err)
                                        }
                                    });
                                }).catch((e) => {
                                    console.log(chalk.red(` Server Error ${e.toString()}`))
                                })
                                break;
                        }
                    }
                    break;
            }
        });
    }
}

export default Server;