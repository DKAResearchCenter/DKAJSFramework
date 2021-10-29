'use strict';
'use warning';
import _ from 'lodash';
import chalk from "chalk";
import {existsSync} from "fs";
import Options from "./../../Options";

import HTTPEngine from "./../HTTP";
import ReactEngine from "./../REACT"
import FastifyEngine from "./../FASTIFY";
import ExpressEngine from "./../EXPRESS";
import path from "path";
import mNgrok from "ngrok";
import localtunnel from "localtunnel";

const Server = async (config) => {
    /**
     * @const
     * @type {Object}
     */
    const mConfig = await _.extend({
        /** ServerName For Naming App Server **/
        serverName : "",
        /** Server Domain For Naming Service Domain Access **/
        serverDomain : "http://localhost",
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

    const DKAServer = await new Promise(async (resolve, rejected) => {
        switch (mConfig.serverEngine) {
            case Options.HTTP2_CORE_ENGINE :
                //**************************************************/
                await HTTPEngine(mConfig).then((AppEngine) => {
                    resolve(AppEngine);
                });
                /***************************************************/
                break;
            case Options.EXPRESS_CORE_ENGINE :
                //**************************************************/
                await ExpressEngine(mConfig).then(async (AppEngine) => {
                    await resolve(AppEngine);
                });
                /***************************************************/
                break;
            case Options.FASTIFY_CORE_ENGINE :
                //**************************************************/
                FastifyEngine(mConfig).then(async (AppEngine) => {
                    await resolve(AppEngine);
                }).catch(async (error) => {
                    await rejected(error);
                })
                /***************************************************/
                break;
            case Options.RESTIFY_CORE_ENGINE :
                await resolve();
                break;
            case Options.REACTJS_CORE_ENGINE :
                await ReactEngine(mConfig).then(async (AppEngine) => {
                    await resolve(AppEngine);
                })
                break;
            default :
                FastifyEngine(mConfig).then(async (AppEngine) => {
                    await resolve(AppEngine);
                }).catch(async (error) => {
                    await rejected(error);
                })
                break;
        }
    });

    const DKAPointing = await new Promise (async (resolve, rejected) => {
        await DKAServer.then( async (AppEngine) => {
            if (mConfig.app != null){
                switch (mConfig.serverEngine) {
                    case Options.EXPRESS_CORE_ENGINE :
                        await AppEngine.use(mConfig.app);
                        await resolve(AppEngine);
                        break;
                    case Options.FASTIFY_CORE_ENGINE :
                        if (mConfig.app){
                            await AppEngine.register(async (app, opts, next) => {
                                await app.register(mConfig.app);
                                await next();
                            });
                            await resolve(AppEngine);
                        }else{
                            if (existsSync(mConfig.options.appDir)){
                                await AppEngine.register(async (app, opts, next) => {
                                    await app.register(require(mConfig.options.appDir))
                                    await next();
                                })
                                await resolve(AppEngine);
                            }else{
                                await console.log(chalk.white("Directory `Controller` Not Exist. Please Make Dir in " + mConfig.options.appDir + " "))
                                await resolve(AppEngine);
                            }
                        }
                        break;
                    case Options.REACTJS_CORE_ENGINE :
                        await ReactEngine(mConfig, mConfig.app)
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
            switch (mConfig.serverEngine) {
                /** Aksi Yang Akan Terjadi Jika Jenis Core Engine Adalah Fastify **/
                case Options.FASTIFY_CORE_ENGINE :
                    /** Melakukan Pengecekan Apakah State Server Adalah Development Atau Produksi **/
                    await AppEngine.listen(mConfig.serverPort, mConfig.serverHost, async (err, address) => {
                        if (!err) {
                            if (mConfig.settings.ngrok.enabled === true) {
                                await mNgrok.connect({ addr : mConfig.serverPort, authtoken : mConfig.settings.ngrok.authToken, onStatusChange : status => {}, onLogEvent : data => {}}).catch((e) => {
                                    rejected(e.toString())
                                });
                                const tunnels = await mNgrok.getApi().get('api/tunnels');
                                const response = { status : true, msg : "Berhasil", text : `Aplikasi "${mConfig.serverName}" Server Dengan Alamat ${address}`, Ngrok : [
                                        JSON.parse(tunnels).tunnels[0].public_url,
                                        JSON.parse(tunnels).tunnels[1].public_url
                                    ]};
                                await resolve(response);
                            } else if (mConfig.settings.localtunnel === true) {
                                const tunnel = await localtunnel({port: mConfig.serverPort});
                                const response = { status : true, msg : "Berhasil", text : `Aplikasi "${mConfig.serverName}" Server Dengan Alamat ${address}`, Localtunnel : tunnel.url};
                                tunnel.on('close', () => {
                                    // tunnels are closed
                                });
                                await resolve(response);
                            } else {
                                const response = { status : true, msg : "Berhasil", text : `Aplikasi "${mConfig.serverName}" Server Dengan Alamat ${address}`};
                                await resolve(response);
                            }
                        } else {
                            rejected(err)
                        }
                    });
                    break;
                default :
                    rejected("Not Engine Selected");
            }
        });
    });

};


export default Server;