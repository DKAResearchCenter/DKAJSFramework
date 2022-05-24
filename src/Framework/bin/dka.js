#!/usr/bin/env node
const mPackage = require("./../../../package.json");
const path = require("path");
const babel = require("@babel/core");
const nodemon = require("nodemon");
const { spawn } = require('child_process');
const { Command } = require("commander");
const net = require("net");
const program = new Command();

(async () => {
    let nodemonInst = null;

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
            const configFilePath = (options.babelconfig !== undefined) ? `${options.babelconfig}` : await path.join(process.cwd(), "./node_modules/dkaframework/dist/Framework/bin/babel.config.js");
            const watchOpt = (options.watch !== undefined) ? `--watch ${options.watch}` : `--watch false`;
            const babelOpt = (options.babel !== undefined) ? ` babel-node` : ` node`;
            const configBabel = (options.babel !== undefined) ? ` --config-file ${configFilePath}` : ``;

            await new Promise(async (resolve, rejected) => {
                if (options.nodemon !== undefined){
                    const finalScript = `${watchOpt} --exec${babelOpt}${configBabel} ${file}`;
                    if (options.debug !== undefined){
                        console.log(`#### --- nodemon ${finalScript} --- ####`);
                    }

                    nodemonInst = await nodemon(finalScript);
                    resolve()
                }else{
                    const finalScript = `${watchOpt} --exec${babelOpt}${configBabel} ${file}`;
                    if (options.debug !== undefined){
                        console.log(`#### --- node ${finalScript} --- ####`);
                    }
                    nodemonInst = await nodemon(finalScript)
                    resolve()
                }
            }).finally(async () => {
                await nodemon.once('start', async () => {
                    console.log(`DKA Engine V.${mPackage.version}. Program Starting ...`);
                }).on('crash', function (e) {
                    console.log(`DKA Program Has Detecting Crash ...`);
                    //process.exit(1);
                }).on('quit', function () {
                    console.log(`DKA Program V.${mPackage.version} Has Quit ...`);
                    process.exit();
                }).on('restart', function (files) {
                    console.log(`The DKA Program V.${mPackage.version} has Restarted.`);
                });
            });

        });

    await program.parse(process.argv);
})();
