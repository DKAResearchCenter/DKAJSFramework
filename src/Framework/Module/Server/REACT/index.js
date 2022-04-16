import path from "path";
import fs from "fs";
import _ from "lodash";
import Options from "./../../Options";

import jsdom from "jsdom";
import Webpack from "webpack";
import wpCli from "webpack-cli";
import HtmlWebpackPlugin from "html-webpack-plugin";
import WebpackDevServer from "webpack-dev-server";
import CopyWebpackPlugin from "copy-webpack-plugin";
import delay from "delay";

export default (config) => new Promise((resolve, reject) => {
    //"development" | "production" | "none"
    let serverState = (config.serverState === Options.SERVER_STATE_DEVELOPMENT) ? "development" :
        (config.serverState === Options.SERVER_STATE_PRODUCTION) ? "production" : "none";

    mProgressBar.increment( { state : Options.LOADING_STATE, descriptions : "merged setting for react webpack"});
    delay(Options.DELAY_TIME);
    /** Merger Configuration Data Merger Object
     * @param {Number} configuration
     *
     * **/
    let configuration = _.merge( {
        /** Server State Mode Server Less Object Settings **/
        mode: serverState,
        /** Entry Point Path File Loader Builder Native App.js Location Default**/
        entry : path.join(require.main.filename, './../app.js'),
        /** Output Data Engine The Path And JS Output Path **/
        output: {
            /** path Destination After Compile **/
            path: config.options.distDir,
            filename: 'dkabundle.js',
        },
        devServer: {
            contentBase: config.options.publicDir,
            writeToDisk: true
        },
        plugins: [
            /** Generate HTML Webpack Plugin data For Generation Webpack HTML React JS**/
            new HtmlWebpackPlugin(
                {
                    template : path.resolve(config.options.publicDir, "./index.html")
                })
        ]
    }, config.Webpack);

    mProgressBar.increment( { state : Options.LOADED_STATE, descriptions : "merged setting for react webpack"});
    delay(Options.DELAY_TIME);
    /** Checing Sserver Starts Data Start Development **/
    if (config.serverState === Options.SERVER_STATE_DEVELOPMENT){
        console.log(`entry config ${configuration.entry}`);
        console.log(`path config ${configuration.output.path}`);
    }

    return new Promise(async (stepResolve, stepRejected) => {
        /** Check Dist Folder in Target Project **/
        await mProgressBar.increment( { state : Options.LOADING_STATE, descriptions : "checking output path react"});
        await delay(Options.DELAY_TIME);
        if (!fs.existsSync(configuration.output.path)){
            /** Create Fs Mkdir Sytnc Configuration Data in the Path Data Connection **/
            await fs.mkdirSync(configuration.output.path);
            await fs.chmodSync(configuration.output.path,777)
        }

        if (typeof configuration.app === "function"){
            await stepRejected({ status : false, code : 500, msg : `options app must object config { entry, .. args} `})
        }
        await mProgressBar.increment( { state : Options.LOADED_STATE, descriptions : "checking output path react"});
        await delay(Options.DELAY_TIME);
        await stepResolve(configuration);

    }).then(async (res) => {
        await mProgressBar.increment( { state : Options.LOADING_STATE, descriptions : "starting webpack engine"});
        await delay(Options.DELAY_TIME);
        const compiler = await Webpack(res);
        await mProgressBar.increment( { state : Options.LOADED_STATE, descriptions : "started webpack engine"});
        await delay(Options.DELAY_TIME);
        const devServerOptions = {
            static: {
                directory: config.options.publicDir,
            },
            compress: config.settings.reactCompress,
            port: config.serverPort,
            // Enable hot reloading
            hot : config.settings.reactHot,
            open : config.settings.reactOpen
        };
        await mProgressBar.increment( { state : Options.LOADING_STATE, descriptions : "starting webpackDevServer Engine"});
        await delay(Options.DELAY_TIME);
        let webpackInstance = await new WebpackDevServer(devServerOptions, compiler);
        await mProgressBar.increment( { state : Options.LOADED_STATE, descriptions : "started webpackDevServer Engine"});
        await delay(Options.DELAY_TIME);
        await resolve(webpackInstance)
    }).catch(async (error) => {
        await reject(error)
    });

});