#!/usr/bin/env node
const mPackage = require("./../../../package.json");
const path = require("path");
const nodemon = require("nodemon");
const { spawn } = require('child_process');
const { Command } = require("commander");
const program = new Command();

(async () => {
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

            if (options.nodemon !== undefined){
                const finalScript = `${watchOpt} --exec${babelOpt}${configBabel} ${file}`;
                if (options.debug !== undefined){
                    console.log(`#### --- nodemon ${finalScript} --- ####`);
                }

                await nodemon(finalScript)
            }else{
                const finalScript = `${watchOpt} --exec${babelOpt}${configBabel} ${file}`;
                if (options.debug !== undefined){
                    console.log(`#### --- node ${finalScript} --- ####`);
                }
                await nodemon(finalScript);
            }
            /*await Base.default().then(async (res) => {
                if (res.status){
                    console.log(res);
                    if (fs.existsSync(configFilePath)){
                        await nodemon(`${watchOpt} --exec ${babelOpt} --config-file ${configFilePath} ${file}`);
                    }else{
                        console.error(`Fatal Error, DKA Framework not Installed Locally. please run "npm install dkaframework@latest" or "yarn add dkaframework@latest" `);
                        process.exit(1);
                    }
                }else{
                    console.log(res)
                    process.exit(1);
                }
            }).catch(async (err) => {
                console.log(err);
                process.exit(1);
            });*/

        });

    await program.parse(process.argv);

    await nodemon.once('start', async () => {
        console.log(`DKA Engine V.${mPackage.version}. Program Starting ...`);
    }).on('crash', function () {
        console.log(`DKA Program Has Detecting Crash ...`);
        process.exit(1);
    }).on('exit', function () {
        console.log(`DKA Program Has Stopped ...`);
        process.exit();
    }).on('quit', function () {
        console.log(`DKA Program V.${mPackage.version} Has Quit ...`);
        process.exit(1);
    }).on('restart', function (files) {
        console.log(`The DKA Program V.${mPackage.version} has Restarted.`);
    });
})();
