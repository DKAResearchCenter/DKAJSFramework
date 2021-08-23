'use strict';
'use warning';
import _ from 'lodash';
import chalk from "chalk";
import {existsSync} from "fs";
import Options from "./../Options";

import HTTPEngine from "./HTTP";
import ReactEngine from "./REACT"
import FastifyEngine from "./FASTIFY";
import ExpressEngine from "./EXPRESS";
import path from "path";
import mNgrok from "ngrok";
import localtunnel from "localtunnel";
import autoload from "./Autoloads";

const Server = async (config) => {

    /**
     * @const
     * @type {Object}
     */
    let configuration = await _.extend({
        /** ServerName For Naming App Server **/
        serverName : "Unknown",
        /** Server Domain For Naming Service Domain Access **/
        serverDomain : false,
        /** Server State Overide Enable and Disabled **/
        serverEnabled : true,
        /** Memilih Jenis Server Engine Yang Ingin Digunakan **/
        serverEngine : Options.FASTIFY_CORE_ENGINE,
        /** Untuk melakukan Set View Template View Di Dalam Framework **/
        serverView : Options.VIEW_POV_EJS,
        /** State Server {Server.SERVER_STATE_DEVELOPMENT | Server.SERVER_STATE_PRODUCTION } **/
        serverState : Options.SERVER_STATE_DEVELOPMENT,
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
            firewall : [],
            /** Ngrok Tunneling **/
            ngrok : {
                enabled : false,
                authToken : null
            },
            localtunnel : false,
            secretKey : "Cyberhack2010Yovangga@nandhika2021"
        },
        /** Fungsi Untuk Melakukan Asset Delarasion Untuk Menentukan Folder Asets Di Dalam System Data **/
        options : {
            /** Deklarasi Menetapkan Lokasi Assets CSS dan JS Dir Dan Gambar Untuk Aplikasi **/
            layoutDir : path.join(require.main.filename,"./../Layout"),
            assetsDir : path.join(require.main.filename, "./../Assets"),
            appDir : path.join(require.main.filename, "./../Controller"),
            /** Fungsi Untuk Melakukan Folder Upload Di dalam aplikasi **/
            autoloadDir : path.join(require.main.filename, "./../App"),
            uploadDir : path.join(require.main.filename, "./../Upload"),
            backupDir : path.join(require.main.filename, "./../Backup")
            /** **/

        }
    }, config);

    Server.CONFIG = configuration

    const DKAServer = await new Promise(async (resolve, rejected) => {
        switch (configuration.serverEngine) {
            case Options.HTTP2_CORE_ENGINE :
                //**************************************************/
                await HTTPEngine(configuration).then((AppEngine) => {
                    resolve(AppEngine);
                });
                /***************************************************/
                break;
            case Options.EXPRESS_CORE_ENGINE :
                //**************************************************/
                await ExpressEngine(configuration).then(async (AppEngine) => {
                    await resolve(AppEngine);
                });
                /***************************************************/
                break;
            case Options.FASTIFY_CORE_ENGINE :
                //**************************************************/
                if (configuration.serverEnabled){
                    FastifyEngine(configuration).then(async (AppEngine) => {
                        await resolve(AppEngine);
                    }).catch(async (error) => {
                        await rejected(error);
                    });
                }else{
                    await rejected(`Project "${configuration.serverName}" Dinonaktifkan. Set "serverEnabled" ke "true" Untuk Mengaktifkan`);
                }
                /***************************************************/
                break;
            case Options.RESTIFY_CORE_ENGINE :
                await resolve();
                break;
            case Options.REACTJS_CORE_ENGINE :
                await ReactEngine(configuration).then(async (AppEngine) => {
                    await resolve(AppEngine);
                })
                break;
            default :
                FastifyEngine(configuration).then(async (AppEngine) => {
                    await resolve(AppEngine);
                }).catch(async (error) => {
                    await rejected(error);
                })
                break;
        }
    });
    const DKAPointing = await new Promise (async (resolve, rejected) => {
        await DKAServer.then( async (AppEngine) => {
            if (configuration.app != null){
                switch (configuration.serverEngine) {
                    case Options.EXPRESS_CORE_ENGINE :
                        await AppEngine.use(configuration.app);
                        await resolve(AppEngine);
                        break;
                    case Options.FASTIFY_CORE_ENGINE :
                        if (configuration.app){
                            await AppEngine.register(async (app, opts, next) => {
                                const mApp = await require("./FASTIFY/GlobHooks").default(app);
                                await mApp.register(require("./FASTIFY/GlobHandler").default);
                                await mApp.register(configuration.app);
                                await next();
                            });
                            await resolve(AppEngine);
                        }else{
                            if (existsSync(configuration.options.appDir)){
                                await AppEngine.register(async (app, opts, next) => {
                                    const mApp = await require("./FASTIFY/GlobHooks").default(app, configuration);
                                    await mApp.register(require("./FASTIFY/GlobHandler").default);
                                    await mApp.register(require(configuration.options.appDir));
                                    await next();
                                })
                                await resolve(AppEngine);
                            }else{
                                await console.log(chalk.white("Directory `Controller` Not Exist. Please Make Dir in " + configuration.options.appDir + " "))
                                await AppEngine.register(async (app, opts, next) => {
                                    const mApp = await require("./FASTIFY/GlobHooks").default(app);
                                    await mApp.register(require("./FASTIFY/GlobHandler").default);
                                    await next();
                                });
                                await resolve(AppEngine);
                            }
                        }
                        break;
                    case Options.REACTJS_CORE_ENGINE :
                        await ReactEngine(configuration, configuration.app)
                        await resolve()
                        break;
                    case Options.RESTIFY_CORE_ENGINE :
                        await resolve()
                        break;
                    default :
                        await resolve()
                        break;
                }
            }else{
                resolve(AppEngine);
            }
        }).catch(async (error) => {
            rejected(error);
        });
    })
    return await new Promise(async (resolve, rejected) => {
        DKAPointing.then(async (AppEngine) => {
            switch (configuration.serverEngine) {
                /** Aksi Yang Akan Terjadi Jika Jenis Core Engine Adalah Fastify **/
                case Options.FASTIFY_CORE_ENGINE :
                    /** Melakukan Pengecekan Apakah State Server Adalah Development Atau Produksi **/
                    await AppEngine.listen(configuration.serverPort, configuration.serverHost, async (err, address) => {
                        if (!err) {
                            if (configuration.settings.ngrok.enabled === true) {
                                const url = await mNgrok.connect({
                                    addr : configuration.serverPort,
                                    authtoken : configuration.settings.ngrok.authToken,
                                    onStatusChange : status => {

                                    }, onLogEvent : data => {

                                    }
                                }).catch((e) => {
                                    rejected(e.toString())
                                });

                                const api = await mNgrok.getApi();
                                const tunnels = api.listTunnels();

                                tunnels.then(async (result) => {
                                    const response = { status : true, msg : "Berhasil", text : `Aplikasi "${configuration.serverName}" Server Dengan Alamat ${address}`, Ngrok : [ result.tunnels[1].public_url, result.tunnels[0].public_url]};
                                    await resolve(response);
                                }).catch(async (error) => {
                                    const response = { status : true, msg : "Berhasil", text : `Aplikasi "${configuration.serverName}" Server Dengan Alamat ${address}`, Ngrok : { error : error }};
                                    await resolve(response);
                                });
                            } else if (configuration.settings.localtunnel === true) {
                                const tunnel = await localtunnel({port: configuration.serverPort});
                                const response = { status : true, msg : "Berhasil", text : `Aplikasi "${configuration.serverName}" Server Dengan Alamat ${address}`, Localtunnel : tunnel.url};
                                await resolve(response);
                            } else {
                                const response = { status : true, msg : "Berhasil", text : `Aplikasi "${configuration.serverName}" Server Dengan Alamat ${address}`};
                                await resolve(response);
                            }
                        } else {
                            rejected(err);
                        }
                    });
                    break;
                default :
                    rejected("Server Engine Not Found");

            }
        });

    });

};

Server.Autoload = autoload;


export default Server;