#!/usr/bin/env node
const mPackage = require("./../../../package.json");
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
        const watchOpt = (options.watch !== undefined) ? `--watch ${options.watch}` : ``;
        const babelOpt = (options.babel !== undefined) ? `babel-node` : `node`;
        nodemon(`${watchOpt} --exec ${babelOpt} ${file}`);
    });

program.parse(process.argv);

nodemon.once('start', function () {
    console.log('DKA Program Starting ...');
}).on('quit', function () {
    console.log('DKA Program Has Terminating ...');
    process.exit();
}).on('restart', function (files) {
    console.log('The DKA Program has Restarted.');
});
