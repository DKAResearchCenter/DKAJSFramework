import fs from "fs";
import path from "path";
import isElectron from "is-electron";
import electronLog from "electron-log";
import Options from "../../Options";
import delay from "delay";

const hookHandler = async (app, config) => {
    await app.addHook('onRequest', async (request, response) => {
        /** Set Variable data Config Header **/
        let mHeader = {};
        if (fs.existsSync(path.join(__dirname, "./../../../../../package.json"))){
            const packages = require(path.join(__dirname, "./../../../../../package.json"));
            mHeader = {
                FrameworkName: packages.name,
                FrameworkVersion: packages.version,
                FrameworkAuthor: packages.author
            };
        }
        /** Header Key Configuration data For All get hook **/
        await Object.keys(mHeader).forEach(function (keys) {
            response.header(keys, mHeader[keys]);
        });
        await Object.keys(mHeader).forEach(function (keys) {
            request.headers[keys] = mHeader[keys];
        });

        const IP = request.ip;

        await config.settings.firewall.forEach(function (key){
            if (request.method === key.method && IP === key.ip_address && key.action === "DENY"){
                response
                    .code(401)
                    .send({ code : 401, msg : `Not Authorization. Firewall Rules`});
            }

        })
        //console.log(PublicIP);

    });
    await app.addHook('preParsing', async (request, response) => {

    });
    await app.addHook('preValidation', async (request, response) => {

    });
    await app.addHook('preHandler', async (request, response) => {
        /** Mendaftarkan Module Tambahan Untuk Server Fastify **/

    });
    await app.addHook('preSerialization', async (request, response) => {

    });
    await app.addHook('onError', async (request, response) => {

    });
    await app.addHook('onSend', async (request, response) => {
        let mHeader = {};
        if (fs.existsSync(path.join(__dirname, "./../../../../../package.json"))){
            const packages = require(path.join(__dirname, "./../../../../../package.json"));
            mHeader = {
                FrameworkName: packages.name,
                FrameworkVersion: packages.version,
                FrameworkAuthor: packages.author
            };
        }
        /** Header Key Configuration data For All get hook **/
        await Object.keys(mHeader).forEach(function (keys) {
            response.header(keys, mHeader[keys]);
        });
        await Object.keys(mHeader).forEach(function (keys) {
            request.headers[keys] = mHeader[keys];
        });
    });
    await app.addHook('onResponse', async (request, response) => {

    });
    await app.addHook('onTimeout', async (request, response) => {

    });

    return app;
}
export default hookHandler;