#!/usr/bin/env node
const nodemon = require("nodemon");
const yargs = require("yargs");


const options = yargs

    .command("init [name]", "Create a new Project", function (yargs) {
        yargs.positional('name', {
            type: 'string',
            default: 'Cambi',
            describe: 'the name to say hello to'
        })
    })
    .command("dev", "Run Debug Project Serve", function (argv) {

    })
    .command("build", "create Release Project", function (argv) {

    })
    .help()
    .argv;



nodemon({
    script: options.name,
    ext: 'js json'
});

nodemon.on('start', function () {
    console.log('App has started');
}).on('quit', function () {
    console.log('App has quit');
    process.exit();
}).on('restart', function (files) {
    console.log('App restarted due to: ', files);
});
