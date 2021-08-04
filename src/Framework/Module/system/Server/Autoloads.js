/**
 *
 *Created By Yovangga Anandhika
 * DKA Framework Artificial Intelegencia Console
 * All Right Reserved
 *
 */

'use strict';
'use warning';

/**
 * @TODO Author : Yovangga Ananadhika
 *
 *
 * **/

import {join} from "path";
import {existsSync, lstat, readdirSync} from "fs";
import DKA from "./../index.module.d";
import _ from "lodash";
import chalk from "chalk";

const Autoload = async () => {
    new Promise(async (resolve, rejected) => {
        const mApp = join(require.main.filename, "./../App")
        if (existsSync(mApp)){
            new Promise(async (resolve) => {
                await readdirSync(mApp).forEach((file) => {
                    let AppProjectName = join(mApp, file);
                    lstat(AppProjectName, async (error, stats) => {
                        /* console.log(AppProjectName + stats.isDirectory()) */
                        if (stats.isDirectory()){
                            /** Check Configuration **/
                            let AppFile = join(AppProjectName, "./app.js");

                            if (existsSync(AppFile)){

                                let AppFileModule = require(AppFile).default;

                                if (AppFileModule instanceof Object){

                                    if (AppFileModule.serverEnabled){
                                        await DKA.Server(_.extend({
                                            serverName : file,
                                            serverEnabled : true,
                                            options : {
                                                /** Deklarasi Menetapkan Lokasi Assets CSS dan JS Dir Dan Gambar Untuk Aplikasi **/
                                                layoutDir : join(AppFile,"./../Layout"),
                                                assetsDir : join(AppFile, "./../Assets"),
                                                appDir : join(AppFile, "./../Controller"),
                                                /** Fungsi Untuk Melakukan Folder Upload Di dalam aplikasi **/
                                                uploadDir : join(AppFile, "./../Upload"),
                                                backupDir : join(AppFile, "./../Backup")
                                                /** **/

                                            }
                                        }, AppFileModule)).then((resolve) => {
                                            console.log(resolve)
                                        }).catch((error) => {
                                            console.log(error)
                                        });

                                    }else{
                                        console.log(chalk.white(`Project "${file}" Dinonaktifkan. Set "serverEnabled" ke "true" Untuk Mengaktifkan`));
                                    }

                                }else{
                                    console.log(chalk.redBright(`File "app.js" Format Tidak Dikenali Di Folder "${file}". Harap Periksa File "app.js" Di Dalam Folder "${file}"`));
                                }
                            }else{
                                console.log(chalk.redBright(`File "app.js" Tidak Ditemukan Di Folder "${file}" . Harap Buat File "app.js" Di Dalam Folder "${file}"`));
                            }

                        }
                    });
                });
                await resolve();
            }).catch(async (rejected) => {
                console.log(chalk.redBright(`Terjadi Error Di Project "${file}". Kode Error : ` + rejected));
            });
            await resolve();
        }else{
            rejected(`Folder "App" Tidak Ditemukan Di tingkat root Anda. Harap Buat Folder "App" Di Dalam Project Root Anda`)
        }
    }).catch((e) => {
        console.error(e);
    })
};

export default Autoload;

