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

import Functions from "./Functions";
import Server from "./Server";
import Security from "./Security";
import Config from "./Config";
import Database from "./Database";
import Options from "./Options";
import Api from "./Api";

/**
 *
 * @typedef {Object} DKA
 * @property {Functions} DKA.Functions
 */
const DKA = {
    Functions: Functions,
    Security: Security,
    Config: Config,
    Database: Database,
    Server : Server,
    Options : Options,
    Api : Api
};



global.DKA = DKA;
global.Server = Server;
global.DKAnum = 0;
global.DKAServerConfig = [];

export { Functions, Security, Config, Database, Server, Options, Api };
export default DKA;