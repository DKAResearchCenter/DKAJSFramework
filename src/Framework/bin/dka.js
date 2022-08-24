#!/usr/bin/env node
const mPackage = require("./../../../package.json");
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");
const nodemon = require("nodemon");
const { Command } = require("commander");
const moment = require("moment-timezone");
const program = new Command();

(async () => {
    let nodemonInst = null;
    let debug = false;
    await program
        .version(mPackage.version)
        .arguments("<file>")
        .option('-d, --debug', 'Run Debug Mode')
        .option('-w, --watch <dir>', 'directory watch changes')
        .option('-n, --nodemon', 'Use Nodemon With Run')
        .option('-b, --babel', 'Use Babel')
        .option('-bc, --babelconfig <fileconfig>','use costum babel config')
        .option('-c, --compile','Compile <react> and <babel> to Production')
        .action(async (file, options, command) => {
            let pushOptions = [];

            const watchOpt = (options.watch !== undefined) ? `--watch ${options.watch}` : `--watch false`;
            pushOptions.push(watchOpt);

            const babelOpt = (options.babel !== undefined) ? ` babel-node` : ` node`;
            pushOptions.push(babelOpt);

            const configFilePath = (options.babelconfig !== undefined) ? `${options.babelconfig}` : await path.join(process.cwd(), "./node_modules/dkaframework/dist/Framework/bin/babel.config.js");
            const configBabel = (options.babel !== undefined) ? ` --config-file ${configFilePath}` : ``;
            pushOptions.push(configBabel)

            await new Promise(async (resolve, rejected) => {
                if (options.nodemon !== undefined){
                    const finalScript = `${watchOpt} --exec${babelOpt}${configBabel} ${file}`;
                    if (options.debug !== undefined){
                        debug = true
                        console.log(`#### --- nodemon ${finalScript} --- ####`);
                    }

                    //Spawn Proccess
                    spawn("nodemon", )
                    nodemonInst = await nodemon(finalScript);

                    resolve()
                }else{
                    const finalScript = `${watchOpt} --exec${babelOpt}${configBabel} ${file}`;
                    if (options.debug !== undefined){
                        debug = true;
                        console.log(`#### --- node ${finalScript} --- ####`);
                    }
                    nodemonInst = await nodemon(finalScript)
                    resolve()
                }
            }).finally(async () => {
                let mNodemon = await nodemon;

                await mNodemon.once('start', async () => {
                    console.log(`DKA V.${mPackage.version} :: Program Starting ...`);
                });

                await mNodemon.on('crash', async (e) => {
                    let mJSON = {};
                    mJSON[moment().unix()] = e.toString();
                    switch (process.platform) {
                        case "linux":
                            await fs.writeFileSync(path.join(require.main.filename,"./../error.json"), JSON.stringify(mJSON), { encoding : "utf-8", mode : 0o777})
                            break;
                        case "win32" :
                            await fs.writeFileSync(path.join(require.main.filename,"./../error.json"), JSON.stringify(mJSON), { encoding : "utf-8", mode : 0o777})
                            break;
                    }
                    console.log(`DKA :: Has Detecting Crash ...`);
                    console.log(e);
                });

                await mNodemon.on('quit', function () {
                    console.log(`DKA V.${mPackage.version} :: Has Quit ...`);
                    process.exit();
                });

                await mNodemon.on('restart', function (files) {
                    console.log(`DKA :: V.${mPackage.version} a code changes. has restarted ...`);
                });

            });

        });

    await process.on("SIGINT", async () => {
        if (debug) { console.log("DKA Program In Signint"); }
        process.exit();
    });

    await program.parse(process.argv,{

    })
})();
