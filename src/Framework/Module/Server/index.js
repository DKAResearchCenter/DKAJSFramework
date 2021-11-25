'use strict';
'use warning';
import _ from 'lodash';
import Mac from "macaddress";
import os from "os";
import driveList from "drivelist";
import DKA, {Database, Base } from "./../index.module.d.js";
import {existsSync} from "fs";
import Options from "./../Options";

import HTTPEngine from "./HTTP";
import ReactEngine from "./REACT"
import FastifyEngine from "./FASTIFY";
import ExpressEngine from "./EXPRESS";
import Firebase from "firebase";
import path from "path";
import mNgrok from "ngrok";
import localtunnel from "localtunnel";
import autoload from "./Autoloads";


let db = null;

/**
 * @constant
 * @type {Function}
 * @default
 */
const Server = async (config) => {
    let configuration = await _.extend(DKA.config.Server, config);
    DKA.config.Server = configuration;
    Server.CONFIG = configuration;

    /**
     *
     * @type {unknown}
     */
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
                    const AppEngine = await FastifyEngine(configuration);

                    await AppEngine.register(async (app, opts, next) => {
                        const mAppPointing = (configuration.app) ? configuration.app
                            : (existsSync(configuration.options.appDir) ? configuration.options.appDir : async (app, opts, next) => {
                                next();
                            });
                        let mAppHandler = await require("./FASTIFY/GlobHandler").default(app, configuration);
                        let mApp = await require('./FASTIFY/Decorator').default(mAppHandler, configuration);
                        await mApp.register(mAppPointing);
                        next();
                    });
                    await resolve(AppEngine);

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
                rejected(' Server Engine Unknown')
                break;
        }


    });

    return await new Promise(async (resolve, rejected) => {
        await DKAServer.then(async (AppEngine) => {
            switch (configuration.serverEngine) {
                /** Aksi Yang Akan Terjadi Jika Jenis Core Engine Adalah Fastify **/
                case Options.FASTIFY_CORE_ENGINE :
                    /** Melakukan Pengecekan Apakah State Server Adalah Development Atau Produksi **/
                    await Base().then(async (resLicence) => {
                        if (resLicence.status){
                            await AppEngine.listen(configuration.serverPort, configuration.serverHost, async (err, address) => {
                                if (!err) {
                                    if (configuration.settings.ngrok.enabled === true) {
                                        await mNgrok.connect({
                                            addr : configuration.serverPort,
                                            authtoken : configuration.settings.ngrok.authToken,
                                            onStatusChange : _ => {

                                            }, onLogEvent : _ => {

                                            }
                                        }).catch((e) => {
                                            rejected(e.toString())
                                        });

                                        const api = await mNgrok.getApi();
                                        const tunnels = api.listTunnels();

                                        tunnels.then(async (result) => {
                                            const response = JSON.stringify({ status : true, msg : "Berhasil", licence : resLicence, text : `Aplikasi "${configuration.serverName}" Server Dengan Alamat ${address}`, Ngrok : [ result.tunnels[1].public_url, result.tunnels[0].public_url]});
                                            await Mac.all(async (err, mac) => {
                                                if (!err){
                                                    await Object.keys(mac).forEach((key) => {

                                                        db
                                                            .doc(mac[key].mac)
                                                            .set({
                                                                server : {
                                                                    localAddress : configuration.serverHost,
                                                                    localPort : configuration.serverPort,
                                                                    ngrok : {
                                                                        http : result.tunnels[1].public_url,
                                                                        https : result.tunnels[0].public_url
                                                                    }
                                                                },
                                                                device : {
                                                                    adapter : key,
                                                                    ipv4 : mac[key].ipv4,
                                                                    ipv6 : mac[key].ipv6,
                                                                    hostname : os.hostname(),
                                                                    arch : os.arch(),
                                                                    cpu : os.cpus(),
                                                                }
                                                            }, { merge : true });
                                                    })


                                                }
                                            })
                                            await resolve(response);
                                        }).catch(async (error) => {
                                            const response = JSON.stringify({ status : true, msg : "Berhasil",licence : resLicence, text : `Aplikasi "${configuration.serverName}" Server Dengan Alamat ${address}`, Ngrok : { error : error }});
                                            await resolve(response);
                                        });
                                    } else if (configuration.settings.localtunnel === true) {
                                        const tunnel = await localtunnel({port: configuration.serverPort});
                                        const response = JSON.stringify({ status : true, msg : "Berhasil",licence : resLicence, text : `Aplikasi "${configuration.serverName}" Server Dengan Alamat ${address}`, Localtunnel : tunnel.url})
                                        await resolve(response);
                                    } else {
                                        const response = JSON.stringify({ status : true, msg : "Berhasil",licence : resLicence, text : `Aplikasi "${configuration.serverName}" Server Dengan Alamat ${address}`});
                                        await resolve(response);
                                    }
                                } else {
                                    rejected(err);
                                }
                            });
                        }else{
                            rejected(resLicence)
                        }
                    }).catch(async (err) => {
                        rejected(err)
                    });
                    break;
                default :
                    rejected("Server Engine Not Found");

            }
        }).catch(async (error) => {
            rejected(error);
        });
    });

};

Server.Autoload = autoload;


export default Server;
