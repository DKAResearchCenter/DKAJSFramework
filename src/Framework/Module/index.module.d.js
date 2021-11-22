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
import Security from "./Security";
import Config from "./Config";
import Database from "./Database";
import Options from "./Options";
import Hardware from "./Hardware";
import Api from "./Api";

/**
 *
 * @typedef {Object} DKA
 * @property {Functions} DKA.Functions
 */
const DKA = {
    Functions: Functions,
    Helper : Helper,
    Security: Security,
    Database: Database,
    Server : Server,
    Options : Options,
    Hardware : Hardware,
    Api : Api,
    get config() {
        return Config;
    },
    set config(config) {
        Config = _.extend(Config, config)
    }
};

global.DKA = DKA;
global.Server = Server;
global.DKAnum = 0;
global.DKAServerConfig = [];

export { Functions, Helper, Security, Database, Server, Options, Hardware, Api };
export default DKA;