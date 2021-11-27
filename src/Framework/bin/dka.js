#!/usr/bin/env node
const mPackage = require("./../../../package.json");
const Base = require("./../Module/Base");
const path = require("path");
const fs = require('fs');
const winston = require('winston');
const nodemon = require("nodemon");
const yargs = require("yargs");

const { Command } = require("commander");

const program = new Command();

program
    .version(mPackage.version)
    .arguments("<file>")
    .option('-d, --debug', 'Run Debug Mode')
    .option('-w, --watch <dir>', 'directory watch changes')
    .option('-n, --nodemon', 'Use Nodemon With Run')
    .option('-b, --babel', 'Use Babel')
    .action(async (file, options, command) => {
        const configFilePath = path.join(__dirname, "./babel.config.js");
        const watchOpt = (options.watch !== undefined) ? `--watch ${options.watch}` : ``;
        const babelOpt = (options.babel !== undefined) ? `babel-node` : `node`;
        await Base.default().then(async (res) => {
            if (res.status){
                console.log(res);
                await nodemon(`${watchOpt} --exec ${babelOpt} --config-file \"${configFilePath}\" ${file}`);
            }else{
                console.log(res)
                process.exit(1);
            }
        }).catch(async (err) => {
            console.log(err);
            process.exit(1);
        });

    });

program.parse(process.argv);

nodemon.once('start', async () => {
    console.log(`DKA Engine V.${mPackage.version}. Program Starting ...`);
}).on('quit', function () {
    console.log(`DKA Program V.${mPackage.version} Has Terminating ...`);
    process.exit(1);
}).on('restart', function (files) {
    console.log(`The DKA Program V.${mPackage.version} has Restarted.`);
});
