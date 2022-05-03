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
import Document from "./Document";
import Networking from "./Networking";
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
    Document : Document,
    Server : Server,
    Options : Options,
    Networking : Networking,
    Hardware : Hardware,
    Api : Api,
    get config() {
        return Config;
    },
    set config(config) {
        Config = _.merge(Config, config)
    }
};
/** Declalration Global Variable **/
global.DKA = DKA;
global.Server = Server;
global.DKAnum = 0;
global.DKAServerConfig = [];
export { Functions, Helper, Security, Database, Document, Server, Options, Networking, Hardware, Api };
export default DKA;