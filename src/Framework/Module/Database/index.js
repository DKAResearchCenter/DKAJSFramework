'use strict';
'use warning';

import JSONDB from "./JSONDB";
import MySQL from "./MySQL";
import MariaDB from "./MariaDB";
import MongoDB from "./MongoDB";
import Oracle from "./Oracle";
import NeDB from "./NEDB";
import Google from "./Google";

/**
 * @param {{JSONDB : JSONDB, MySQL : MySQL, Google : Google, MariaDB : MariaDB, MongoDB : MongoDB, Oracle : Oracle}} Database
 */
const Database = {
    JSONDB : JSONDB,
    MySQL : MySQL,
    Google : Google,
    NeDB : NeDB,
    MariaDB : MariaDB,
    MongoDB : MongoDB,
    Oracle : Oracle
};

export default Database;
export {JSONDB, MySQL, Google, NeDB, MariaDB, MongoDB, Oracle};