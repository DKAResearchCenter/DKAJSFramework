#!/usr/bin/env node
const {execSync} = require("child_process");
const path = require("path");
const _ = require("lodash");
const inquirer = require('inquirer');
const fs = require('fs');
const ncp = require('ncp');
const fsExtra = require("fs-extra");

const mainData = `'use strict';
import { Server } from "dkaframework";

(async() => {
    await Server({
        serverPort : 8084,
        app : async(app, opts, next) => {
        
            next();
        }
    }).then(async(res) => {
        console.log(res);
    }).catch(async(err) => {
        console.log(err);
    });
})();
                        `;

const babelConfig = {
  "presets" : [
    "@babel/preset-env",
    "@babel/preset-react"
  ],
  "plugins": ["@babel/plugin-proposal-class-properties"]
};

const lang = {
    indonesia : [
        {
            type : 'input',
            name : 'name',
            message : "Apa Nama Paket Anda (tanpa spasi : ",
            default() {
                return 'halo_dunia';
            }
        },
        {
            type : 'input',
            name : 'version',
            message : "Apa Versi Paket Anda : ",
            default() {
                return '1.0.0';
            }
        },
        {
            type : 'input',
            name : 'description',
            message : "Apa Deskripsi Paket Anda : ",
        },
        {
            type : 'input',
            name : 'main',
            message : "Dimana Lokasi File Point Masuk Anda : ",
            default() {
                return 'index.js';
            }
        },
        {
            type : 'input',
            name : 'repository',
            message : "Alamat Git Repo Anda : ",
        },
        {
            type : 'input',
            name : 'author',
            message : "Apa nama Pemilik Project Ini : ",
        },
        {
            type : 'input',
            name : 'license',
            message : "Apa Jenis Lisensi Yang Diterapkan di project Ini : ",
            default() {
                return 'MIT';
            }
        },
        {
            type : 'input',
            name : 'private',
            message : "Apakah Project Ini Bisa Di akses publik ",
            default() {
                return true;
            }
        }
    ],
    english : [
        {
            type : 'input',
            name : 'name',
            message : "What Your Package Name (without spacing : ",
            default() {
                return 'hello_world';
            }
        },
        {
            type : 'input',
            name : 'version',
            message : "What Your package Version : ",
            default() {
                return '1.0.0';
            }
        },
        {
            type : 'input',
            name : 'description',
            message : "What Your Description Package : ",
        },
        {
            type : 'input',
            name : 'main',
            message : "What The Entry Point : ",
            default() {
                return 'index.js';
            }
        },
        {
            type : 'input',
            name : 'repository',
            message : "What The Repository URL : ",
        },
        {
            type : 'input',
            name : 'author',
            message : "What Author Name This Project : ",
        },
        {
            type : 'input',
            name : 'license',
            message : "What The License Used : ",
            default() {
                return 'MIT';
            }
        },
        {
            type : 'input',
            name : 'private',
            message : "Grant Access Public ",
            default() {
                return true;
            }
        }
    ]
}

inquirer
    .prompt([
        {
            type: 'list',
            name: 'lang',
            message: 'Please Use language used : ',
            choices: ['Indonesia', 'English'],
            filter(val) {
                return val.toLowerCase();
            },
        },
    ])
    .then(async (answers) => {
        await inquirer.prompt(lang[answers.lang])
            .then(async (getResponse) => {
                const res = _.extend(getResponse, {
                    repository : {
                        url : getResponse.repository
                    },
                    scripts : {
                        dev : `dka -b ${getResponse.main}`
                    },
                    "devDependencies": {
                        "dkaframework": "latest"
                    }
                });
                const mPath = path.join(process.cwd(), './package.json');
                const mIndexFile = path.join(process.cwd(), `./${getResponse.main}`);
                const mBabelConfig = path.join(process.cwd(), `./.babelrc`);

                const a = new Promise( async (resolve, rejected) => {
                    await fs.writeFile(mPath, JSON.stringify(res, null,2) , 'utf-8', function (err){
                        if (!err){
                            resolve()
                        }else{
                            rejected({ status : false, msg : "Cannot Create Package JSON"})
                        }
                    });
                });

                const b = new Promise( async (resolve, rejected) => {
                    await fs.writeFile(mBabelConfig, JSON.stringify(babelConfig, null,2) , 'utf-8', function (err){
                        if (!err){
                            resolve()
                        }else{
                            rejected({ status : false, msg : "Cannot Create Babel RC"})
                        }
                    });
                });

                const c = new Promise( async (resolve, rejected) => {
                    await fs.writeFile(mIndexFile, mainData , 'utf-8', function (err){
                        if (!err){
                            resolve()
                        }else{
                            rejected({ status : false, msg : "Cannot Create Index.js"})
                        }
                    });
                });

                await Promise.all([a,b, c]).then(async(res) => {
                    execSync('yarn install', {stdio: 'inherit'});
                    console.log(`Success ! : Happy Codding :))`);
                    console.log(`run Code With "yarn run dev" `)
                }).catch(async(err) => {
                    console.error(err);
                });


            })
    });