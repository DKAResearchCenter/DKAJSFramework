'use strict';
'use warning';

import JSONDB from "./JSONDB";
import MySQL from "./MySQL";
import MariaDB from "./MariaDB";
import MongoDB from "./MongoDB";
import Oracle from "./Oracle";
import POSTGRES from "./POSTGRES";

/**
 * @param {{JSONDB : JSONDB, MySQL : MySQL, MariaDB : MariaDB, MongoDB : MongoDB, Oracle : Oracle}} Database
 */
const Database = {
    JSONDB : JSONDB,
    MySQL : MySQL,
    MariaDB : MariaDB,
    MongoDB : MongoDB,
    Oracle : Oracle
};

export default Database;
export {JSONDB, MySQL, MariaDB, MongoDB, Oracle};