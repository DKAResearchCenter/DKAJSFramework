'use strict';
'use warnings';

import {spawn} from "child_process";

export default async (config) => new Promise(async (resolve, reject) => {
    /** get fs command
     * **/
    const { existsSync } = require("fs");
    const path = require("path");
    const { spawn } = require("child_process");

    if (existsSync(config.app)){
        const PHPInterpreter = await spawn("php.exe", [
                '-S',
                `${config.serverHost}:${config.serverPort}`,
                '-t',
                `${config.app}`
            ]
        );

        await PHPInterpreter.on("error", async (error) => {
            console.log(``);
            console.error(`DKA PHP INTERPRETER :: MODULE php.exe not Installed Default Enviroment Variable. please Install First`);
            console.log(error)
            PHPInterpreter.kill(0);
            process.exit(0)
        });

        await PHPInterpreter.stdout.on("data", async(data) => {
            console.log(`DKA PHP Interpreter Console Debug ....`);
            console.log(`${data}`);

        });

        await PHPInterpreter.stderr.on("data", async (data) => {
            console.log(`${data}`);
        });

        await PHPInterpreter.on("close", async (code) => {
            await process.exit(code);
        });

        await resolve(PHPInterpreter);

    }else{
        reject({ status : false, code : 500, msg : ` "config.app" doesnt not exist.`})
    }


});