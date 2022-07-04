'use strict';
'use warning';

/**
 * DKA JS FRAMEWORK
 * @author Yovangga Anandhika
 * @email dhikaprivate@gmail.com
 * @version 1.0
 * @description
 * All Right Reserved.
 * */
import _ from "lodash";

import Functions from "./Functions";
import Helper from "./Helper";
import Server from "./Server";
import Base from "./Base";
import Security from "./Security";
import Config from "./Config";
import Database from "./Database";
import Document from "./Document";
import Networking from "./Networking";
import Options from "./Options";
import Hardware from "./Hardware";
import Api from "./Api";
import Utils from "./Utils";
import {throws} from "assert";
import path from "path";

let status = {};
let mVersion = version();

function version() {
    const fs = require('fs');
    const path = require('path');
    const pg = path.join(__dirname,"./../../../package.json");
    if (fs.existsSync(pg)){
        let mPckage = require(pg);
        return `${mPckage.version}`;
    }else{
        return "package_json_not_found";
    }
}

/**
 *
 * @typedef {Object} DKA
 * @property {Functions} DKA.Functions
 * @property { Hardware } DKA.Hardware
 */
const DKA = {
    Functions: Functions,
    Helper : Helper,
    Security: Security,
    Database: Database,
    Document : Document,
    Server : Server,
    Options : Options,
    Networking : Networking,
    Hardware : Hardware,
    Api : Api,
    Version : mVersion,
    Config : Config,
    Utils : Utils,
    get config() {
        return Config;
    },
    set config(config) {
        let Config = _.merge(Config, config)
    }
};
/** Declalration Global Variable **/
global.DKA = DKA;
global.Server = Server;
global.DKAnum = 0;
global.DKAServerConfig = [];

export { Functions, Helper, Security, Database, Document, Server, Options, Networking, Hardware, Api, Utils, Config, mVersion as Version };
export default DKA;