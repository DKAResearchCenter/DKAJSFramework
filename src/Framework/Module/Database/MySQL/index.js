'use strict';
'use warning';

import {Server as ServerConfig} from "../../Config";
import _ from "lodash";

/**
 * Functions Fot Class Mysql Connector In Framework
 * All Right Reserved
 * **/
class MySQL {


    /***
     * @returns {number}
     * @constructor
     */
    static MYSQL_CREATECONNECTION = 1;

    /***
     * @returns {number}
     * @constructor
     */
    static MYSQL_POOL_CLUSTER = 2;

    /***
     *
     * @returns {number}
     */
    static MYSQL_POOL = 3;

    /**
     *
     * @param {JSON} options
     */
    constructor(options) {
        this.options = _.extend(ServerConfig.DBConfig, options);
    }

    Create (DBInstance) {
        this.DBInstance = DBInstance;
        const MySQLEngine = require("mysql");
        return DBInstance === MySQL.MYSQL_POOL_CLUSTER ? MySQLEngine.createPoolCluster(this.options):
            DBInstance === MySQL.MYSQL_POOL ? MySQLEngine.createPool(this.options):
                DBInstance === MySQL.MYSQL_CREATECONNECTION ? MySQLEngine.createConnection(this.options):
                MySQLEngine.createConnection(this.options);
    };

    /**
     * @param {Connection|Pool} MySQLConnect
     * @param SQLString
     * @param {Array} ArrayParams
     * @param Callback
     */
    /**
     *
     * @param {Connection|Pool|boolean} MySQLConnect
     * @param SQLString
     * @param {Array} ArrayParams
     * @param Callback
     */
    rawQuery(MySQLConnect, SQLString, ArrayParams, Callback) {
        /** Declaration Of Variable **/
        if(this.DBInstance === MySQL.MYSQL_POOL){
            MySQLConnect.getConnection(function (error, connection) {
                if (error) throw error;
                connection.query(SQLString, ArrayParams, (error, results, fields) => {
                    connection.release();
                    if (error) throw error;
                    Callback(error, results, fields);
                });
            });
        }else if (this.DBInstance === MySQL.MYSQL_POOL_CLUSTER){

        }else if (this.DBInstance === MySQL.MYSQL_CREATECONNECTION){
            MySQLConnect.connect(function (error) {
                if (error) throw error;
                MySQLConnect.query(SQLString, ArrayParams, (error, results, fields) => {
                    MySQLConnect.end();
                    if (error) throw error;
                    Callback(error, results, fields);
                });
            });
        }
    }

    /**
     *
     * @param {Connection|Pool|boolean} MySQLConnect
     * @param SQLString
     * @param Callback
     */
    rawQuery(MySQLConnect, SQLString, Callback) {
        /** Declaration Of Variable **/
        if(this.DBInstance === MySQL.MYSQL_POOL){
            MySQLConnect.getConnection(function (error, connection) {
                if (error) throw error;
                connection.query(SQLString, (error, results, fields) => {
                    connection.release();
                    if (error) throw error;
                    Callback(error, results, fields);
                });
            });
        }else if (this.DBInstance === MySQL.MYSQL_POOL_CLUSTER){

        }else if (this.DBInstance === MySQL.MYSQL_CREATECONNECTION){
            MySQLConnect.connect(function (error) {
                if (error) throw error;
                MySQLConnect.query(SQLString, (error, results, fields) => {
                    MySQLConnect.end();
                    if (error) throw error;
                    Callback(error, results, fields);
                });
            });
        }
    }

    setDatabase(){

    }

}

export default MySQL;