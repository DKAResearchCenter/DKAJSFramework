'use strict';
'use warning';
import DKA, {Server, Config, Security, Options, Functions} from "./../../index.module.d.js";
import {join} from "path";
import mysqldump from 'mysqldump';
import _ from "lodash";
import moment from "moment";
import bigIntJson from "json-bigint";
import ansiColors from "ansi-colors";
import emojic from "node-emoji";
import {existsSync, mkdirSync} from "fs";
import {error} from "winston";
/**
 * Functions Fot Class Mysql Connector In Framework
 * All Right Reserved
 * **/



/**
 * @description Ini Adalah Module Library Yang Berisi Konfigurasi Server Untuk Membangun Sebuah Arsitektur Webserver
 * @example
 *     new DKA.Connector.MariaDB(options)
 *     .rawQuery()
 * @see https://facebook.com/dhykavangga
 * @description Class Ini Berisi Tentang Membangun Sebuah Fungsi Web Server Di Dalam DKA Framework
 *
 *
 * @class MariaDB
 */

class MariaDB {
    #returnedResult;
    #mWhere;
    #mKey;
    #mVal;
    mOptions;
    DBInstance;
    #mSearchAdd;
    #method;

    /***
     * @returns {number}
     * @constructor
     */
    static get MARIADB_CREATECONNECTION() {
        return Options.MARIADB_CREATECONNECTION;
    };

    /***
     * @returns {number}
     * @constructor
     */
    static get MARIADB_POOL_CLUSTER() {
        return Options.MARIADB_POOL_CLUSTER;
    };

    /***
     *
     * @returns {number}
     */
    static get MARIADB_POOL() {
        return Options.MARIADB_POOL;
    };

    /***
     *
     * @returns {number}
     */
    static get MARIADB_METHOD_CREATE_TABLE() {
        return 0;
    };

    /***
     *
     * @returns {number}
     */
    static get MARIADB_METHOD_CREATE() {
        return 1;
    };

    /***
     *
     * @returns {number}
     */
    static get MARIADB_METHOD_READ() {
        return 2;
    };

    /***
     *
     * @returns {number}
     */
    static get MARIADB_METHOD_UPDATE() {
        return 3;
    };

    /***
     *
     * @returns {number}
     */
    static get MARIADB_METHOD_DELETE() {
        return 4;
    };

    /***
     *
     * @returns {number}
     */
    static get MARIADB_METHOD_RAW() {
        return 5;
    };
    /***
     *
     * @returns {number}
     */
    static get MARIADB_METHOD_PROCEDURE() {
        return 6;
    };


    /**
     * @constructor
     * @param {Number} options.engine
     * @param {string} options.host
     * @param {string} options.user
     * @param {string} options.password
     * @param {string} options.database
     * @param {Boolean} options.isLogging
     * @param {Number} options.port
     * @param {Number} options.timezone
     * @param {number} options.connectionLimit
     * @param {Boolean} options.autoBackup
     * @param {Object} options.encryption
     * @param {boolean} options.encryption.enabled
     * @param {String} options.encryption.engine
     * @param {String} options.encryption.alg
     * @param {Object} options.encryption.options
     */
    constructor(options) {
        this.options = _.merge(DKA.config.Database.MariaDB, options );
        DKA.config.Database.MariaDB = this.options;
        /** **
         *
         * */
        const MariaDBEngine = require("mariadb");
        moment.locale("id");



        switch (this.options.encryption.engine){
            case Options.ENCRYPTION_ENGINE_CRYPTO :
                this.EncryptionModule = new Security.Encryption.Crypto({
                    alg : Options.ALGORITHM_AES_256_GCM,
                    secretKey : this.options.encryption.secretKey
                });
                break;
            default :
                this.EncryptionModule = new Security.Encryption.Crypto();
        }

        //------------------------------------------------------------------------------------------------------
        emojic.emojify(`:computer ${ansiColors.blue(`Prepare MariaDB Connection`)}`);
        //------------------------------------------------------------------------------------------------------

        switch (this.options.engine){
            case MariaDB.MARIADB_POOL :
                this.DBInstance = MariaDBEngine.createPool(this.options);
                break;
            case MariaDB.MARIADB_POOL_CLUSTER :
                this.DBInstance = MariaDBEngine.createPoolCluster(this.options);
                break;
            case MariaDB.MARIADB_CREATECONNECTION :
                this.DBInstance = MariaDBEngine.createConnection(this.options);
                break;
            default :
                this.DBInstance = MariaDBEngine.createPool(this.options);
                break;
        }
    }
    /**
     * @constructor
     * @param {String} TableName
     * @param {[]} Rule Place Your Model Data
     * @param {String} Rule.typeData Place Your Model Data
     * @param {Boolean} Rule.defaultNotNull Place Your Model Data
     * @param {Boolean} Rule.ifNotExist Create Table If Not Exists
     * @returns {Promise<unknown> | JSON}
     * @description
     */
    CreateTable = async (TableName, Rule) => {
        this.#method = MariaDB.MARIADB_METHOD_CREATE_TABLE;
        /** Load Encryption**/
        let mTableName = (this.options.encryption.enabled) ? await this.EncryptionModule.encodeIvSync(TableName) : TableName;

        let arrayColumn = [];
        await Object.keys(Rule).forEach((key) => {
            const mKey = (this.options.encryption.options.column && this.options.encryption.enabled) ? this.EncryptionModule.encodeIvSync(`${key}`) : key;
            let typeData = (Rule[key].typeData !== undefined) ? `${Rule[key].typeData}` : Options.MARIADB_TYPE_DATA_LONGTEXT;
            let defaultNotNull = (Rule[key].primaryKey !== true ) ? (Rule[key].defaultNotNull !== undefined && Rule[key].defaultNotNull) ? `DEFAULT NOT NULL` : `DEFAULT NULL` : ``;
            let autoIncrement = (Rule[key].autoIncrement !== undefined && Rule[key].autoIncrement !== false) ? Options.MARIADB_OPT_AUTO_INCREMENT : ``;
            let primaryKey = (Rule[key].primaryKey !== undefined && Rule[key].primaryKey !== false) ? Options.MARIADB_OPT_AUTO_PRIMARY_KEY : ``;
            let commentColumn = (Rule[key].comment !== undefined) ? ` COMMENT '${Rule[key].comment}'` : ` `;

            arrayColumn.push(` \`${mKey}\` ${typeData} ${defaultNotNull} ${autoIncrement}${primaryKey}${commentColumn}`);
        });

        const SqlScript = `CREATE TABLE\`${mTableName}\` (${arrayColumn});`;

        return this.rawQuerySync(SqlScript, []);
    }
    /**
     * @constructor
     * @param {String} TableName
     * @param {JSON} Rules Place Your Model Data
     * @param {JSON|Array} Rules.data Place Your Model Data
     * @returns {Promise<unknown> | JSON}
     * @description
     */
    Create = async (TableName, Rules) => {
        this.#method = MariaDB.MARIADB_METHOD_CREATE;
        let Rule = _.extend({
            data: false,
        }, Rules)

        /** Load Encryption**/
        let mTableName = (this.options.encryption.enabled) ? await this.EncryptionModule.encodeIvSync(TableName) : TableName;

        let TypeData = Rule.data instanceof Array;

        if (!TypeData) {

            this.mKey = [];
            this.mVal = [];

            await Object.keys(Rule.data).forEach((key) => {
                this.mKey.push(` \`${(this.options.encryption.enabled && this.options.encryption.options.column) ? this.EncryptionModule.encodeIvSync(`${key}`) : key}\` `);

                this.mVal.push(`"${(this.options.encryption.enabled && this.options.encryption.options.column) ? this.EncryptionModule.encodeIvSync(`${Rule.data[key]}`) : Rule.data[key]}"`);
            });



            let SqlScript = `INSERT INTO \`${mTableName}\` (${this.mKey}) VALUES (${this.mVal}) `;


            this.#returnedResult = await this.rawQuerySync(SqlScript, []);
        } else {
            let mVal = [];
            let mKey = [];
            let mSetData = [];
            await Rule.data.forEach(function (item, index,) {
                mKey = [];
                mSetData = [];
                Object.keys(item).forEach(function (key) {
                    mKey.push(`${key}`);
                    mSetData.push(`"${Rule.data[index][key]}"`);
                });
                mVal.push(`(${mSetData})`)
            });

            const SqlScript = `INSERT INTO ${mTableName} (${mKey}) VALUES ${mVal} `;

            return this.rawQuerySync(SqlScript, []);
        }

        return this.#returnedResult;
    };
    Buat = this.Create;
    /**
     * @param {String} TableName
     * @param {JSON} Rules
     * @Param {Array} Rules.column
     * @param {JSON} Rules.orderBy
     * @param {Array} Rules.orderBy.column
     * @param {String} Rules.orderBy.mode
     * @param {Number} Rules.limit
     * @param {Array} Rules.search
     * @returns {Promise<unknown> | JSON}
     * @constructor
     */
    Read = async (TableName, Rules = {}) => {
        this.#method = MariaDB.MARIADB_METHOD_READ;
        /** lodash Extend JSON COnfig **/
        const Rule = await _.extend({
            as: false,
            column : [],
            orderBy : {
                column : [],
                mode : "ASC"
            },
            search: false,
            limit: 0
        }, Rules);

        /** Load Encryption**/
        const mTableName = `${(this.options.encryption.enabled) ? this.EncryptionModule.encodeIvSync(TableName).toString() : TableName}`;

        this.mWhere = [];
        this.mSearchAdd = ``;

        let TypeData = Rule.search instanceof Array;

        if (!TypeData) {
            await Object.keys(Rule.search).forEach( (item) => {
                this.mSearchAdd += `\'${(this.options.encryption.enabled) ? this.EncryptionModule.encodeIvSync(item).toString() : item}\' = \'${(this.options.encryption.enabled) ? this.EncryptionModule.encodeIvSync(Rule.search[item]) : Rule.search[item]}\' `;
            });
        }else{
            await Rule.search.forEach((item) => {
                if (item instanceof Object) {
                    Object.keys(item).forEach((k) => {
                        this.mSearchAdd += `\`${k}\`=\'${item[k]}\' `;
                    })
                } else {
                    this.mSearchAdd += item;
                }
            })
        }


        const UpdateWhere = (Rule.search !== false) ? `WHERE ${this.mSearchAdd}` : ``;
        const SelectColumn = (Rule.column.length > 0) ? Rule.column : `*`;
        const SelectLimit = (Rule.limit > 0) ? `LIMIT ${Rule.limit}` : ``;
        const SelectOrderBy = (Rule.orderBy.column.length > 0) ? `ORDER BY ${Rule.orderBy.column} ${Rule.orderBy.mode}` : ``;
        const selectParentAs = (Rule.as !== false) ? `as \`${Rule.a}\`` : ``;

        const mSQL = `SELECT ${SelectColumn} FROM \`${mTableName}\`${selectParentAs} ${UpdateWhere} \n ${SelectOrderBy} ${SelectLimit}`;

        return this.rawQuerySync(mSQL, []);
    }
    Baca = this.Read;


    Procedure = async (FunctionName = null, ArrayData = []) => {
        this.#method = MariaDB.MARIADB_METHOD_PROCEDURE;
        const mSQL = `CALL ${FunctionName}(${ArrayData})`;
        return this.rawQuerySync(mSQL,[]);
    }
    /**
     * @constructor
     * @param {String} TableName
     * @param {JSON} Rules Place Your Model Data
     * @param {JSON|Array} Rules.data Place Your Model Data
     * @param {JSON} Rules.search Where Clause Column
     * @return {Promise<unknown> | JSON}
     * @description
     */

    Update = async (TableName, Rules) => {
        this.#method = MariaDB.MARIADB_METHOD_UPDATE;
        /** Merge JSON Extend loDash **/
        const Rule = _.extend({
            data: false,
            search: false
        }, Rules);

        this.mKey = [];
        this.mWhere = [];

        Object.keys(Rule.data).forEach((key) => {
            this.mKey.push(` ${key} = '${Rule.data[key]}'`);
        });

        Object.keys(Rule.search).forEach((key) => {
            this.mWhere.push(`${key} = '${Rule.search[key]}'`)
        });

        const UpdateWhere = (Rule.search !== false) ? `WHERE ${this.mWhere}` : ``;

        const mSQL = `UPDATE \`${TableName}\` SET${this.mKey} ${UpdateWhere} `;

        return this.rawQuerySync(mSQL, []);
    }
    Ubah = this.Update;

    /**
     * @constructor
     * @param {String} TableName
     * @param {JSON} Rules Place Your Model Data
     * @param {JSON} Rules.search Place Your Model Data
     * @return {Promise<unknown>}
     * @description
     */
    Delete = async (TableName, Rules) => {
        this.#method = MariaDB.MARIADB_METHOD_DELETE;
        const Rule = _.extend({
            search: false
        }, Rules)

        this.mWhere = [];

        Object.keys(Rule.search).forEach((key) => {
            this.mWhere.push(` \`${key}\` = "${Rule.search[key]}" `)
        });

        const DeleteWhere = (Rule.search !== false) ? `WHERE ${this.mWhere}` : ``;

        const SqlScript = `DELETE FROM \`${TableName}\` ${DeleteWhere} `;
        return this.rawQuerySync(SqlScript, []);
    };
    Hapus = this.Delete;
    /**
     * @constructor
     * @return {Promise<unknown>}
     * @description
     */
    Export = async () => {
        const backupPath = (Server.CONFIG === undefined) ? join(require.main.filename, "./../Backup") : Server.CONFIG.options.backupDir;
        const mDate = new Date();
        const filename = join(backupPath, `./${this.options.host}.${this.options.database}.${mDate.getDate()}-${mDate.getMonth()}-${mDate.getFullYear()}.sql.gz`);
        return await new Promise(async (resolve, rejected) => {
            if (existsSync(backupPath)){
                try {
                    if (!existsSync(filename)){
                        await mysqldump({
                            connection: {
                                host: this.options.host,
                                user: this.options.user,
                                password: this.options.password,
                                database: this.options.database,
                            },
                            dumpToFile: filename
                        });
                        resolve({
                            status : true,
                            code : 200,
                            msg : `Backup SQL Is Successfully in ${backupPath} `
                        })
                    }else{
                        resolve({
                            status : true,
                            code : 200,
                            msg : "File Backup is Exist. Skip Save Connector"
                        })
                    }
                }catch (e) {
                    rejected({
                        status : false,
                        code : 501,
                        msg : "Error Detected",
                        error : e
                    })
                }
            }else{
                rejected({
                    status : false,
                    code : 500,
                    msg : "Error Detected",
                    error : `Folder Backup Not Detected in "${backupPath}". Please Create Folder Backup First`
                });
                /*mkdirSync(backupPath, {
                    mode : '0777'
                })*/

            }



        })
    }
    /**
     * @description this Function Package Is The raw SQL Script To Connect MariaDB
     * @constructor
     * @deprecated move to rawQuerySync
     * @param {String} SQLString - The SQL Script
     * @param {Array} ArrayParams - Array For Inject Data
     * @param {Function} Callback - Function With (error, result, fields)
     */
    rawQuery(SQLString, ArrayParams, Callback) {

        /** Declaration Of Variable **/
        switch (this.options.engine) {
            case MariaDB.MARIADB_POOL:
                /** Module Get Connection For The Library **/
                this.DBInstance.getConnection()
                    .then(async (conn) => {
                        /** Create A Query  **/
                        await conn.query(SQLString, ArrayParams)
                            .then(async (rows, res) => {
                                await Callback(null, rows, res);
                                return true
                            }).then(async (response) =>{
                                await conn.end();
                            }).catch(async (err) => {
                                await Callback(err);
                                await conn.end();
                            });
                    }).catch(async (error) => {
                    console.log(error);
                }).catch(async (error) => {
                    console.log(error);
                });
                break;
            case MariaDB.MARIADB_POOL_CLUSTER:
                /** Module Get Connection For The Library **/
                this.DBInstance.getConnection()
                    .then(async (conn) => {
                        /** Create A Query  **/
                        await conn.query(SQLString, ArrayParams)
                            .then(async (rows, res) => {
                                await conn.end();
                                await Callback(null, rows, res);
                            })
                            .catch(async (err) => {
                                await conn.end();
                                await Callback(err);
                            });
                    }).catch(async (error) => {
                    console.log(error);
                });
                break;
            default:
                /** Module Get Connection For The Library **/
                this.DBInstance.getConnection()
                    .then(async (conn) => {
                        /** Create A Query  **/
                        await conn.query(SQLString, ArrayParams)
                            .then(async (rows, res) => {
                                await conn.end();
                                await Callback(null, rows, res);
                            })
                            .catch(async (err) => {
                                await conn.end();
                                await Callback(err);
                            });
                    }).catch(async (error) => {
                    console.log(error);
                });
                break;
        }
    };

    /**
     * @constructor
     * @param SQLString
     * @param ArrayParams
     * @returns {Promise<unknown> | JSON}
     */
    rawQuerySync = async (SQLString, ArrayParams) => {
        const mSQLString = SQLString;
        const timeStart = new Date().getTime();
        /** Promise To Task Future **/
        return new Promise(async (resolve, rejected) => {
            /** Declaration Of Variable **/
            switch (this.options.engine) {
                case MariaDB.MARIADB_POOL:
                    this.DBInstance.getConnection()
                        .then(async (conn) => {
                            //console.log(err)
                            /** Create A Query  **/
                            //------------------------------------------------------------------------------------------------------
                            emojic.emojify(`:computer ${ansiColors.blue(`Ready Connection Database`)}`);
                            //------------------------------------------------------------------------------------------------------
                            await conn.query(mSQLString, ArrayParams)
                                .then(async (rows) => {
                                    let timeEnd = await new Date().getTime();
                                    //------------------------------------------------------------------------------------------------------
                                    await emojic.emojify(`:computer ${ansiColors.blue(`Getting Data from Database`)}`);
                                    //------------------------------------------------------------------------------------------------------
                                    let metadata = { activeConnections : this.DBInstance.activeConnections(), idleConnections : this.DBInstance.idleConnections(), totalConnections : this.DBInstance.totalConnections(), sqlRaw : SQLString, timeExecuteinSecond : `${(timeEnd- timeStart)} ms` };
                                    switch (this.#method){
                                        /** **
                                         * @description
                                         * this Is Action For Method Create Tables
                                         */
                                        case MariaDB.MARIADB_METHOD_CREATE_TABLE :
                                            //###########################################################################
                                            await (rows.warningStatus < 1) ?
                                                await resolve({ status: true, code: 200, msg: `successful, your data has been created`, metadata : metadata}) :
                                                await rejected({ status: false, code: 201, msg: `warning status detected. Check Warning Message`, metadata : metadata});
                                            await conn.release();
                                            //------------------------------------------------------------------------------------------------------
                                            await emojic.emojify(`:computer ${ansiColors.blue(`Release Connection Database Instance`)}`);
                                            //------------------------------------------------------------------------------------------------------
                                            //###########################################################################
                                            break;
                                        case MariaDB.MARIADB_METHOD_CREATE :
                                            //###########################################################################
                                            await (rows.affectedRows > 0) ?
                                                await (rows.warningStatus < 1) ?
                                                    await resolve({ status: true, code: 200, msg: `successful, your data has been created`, id : rows.insertId, metadata : metadata}) :
                                                    await rejected({status: false, code: 201, msg: `warning status detected. Check Warning Message`, id : rows.insertId, metadata : metadata})
                                                : await rejected({status: false, code: 404, msg: `Succeeded, But No Data Changed`, metadata : metadata});
                                            await conn.release();
                                            //------------------------------------------------------------------------------------------------------
                                            await emojic.emojify(`:computer ${ansiColors.blue(`Release Connection Database Instance`)}`);
                                            //------------------------------------------------------------------------------------------------------
                                            //###########################################################################
                                            break;
                                        case MariaDB.MARIADB_METHOD_READ :
                                            //###########################################################################
                                            if (rows.length > 0) {
                                                if (this.options.encryption.enabled && this.options.encryption.options.column){
                                                    let dataArray = [];
                                                    await rows.forEach((res) => {
                                                        let dataJSON = {};
                                                        Object.keys(res).forEach((key) => {
                                                            dataJSON[this.EncryptionModule.decodeIvSync(key)] = this.EncryptionModule.decodeIvSync(res[key]);
                                                        });
                                                        dataArray.push(dataJSON);
                                                    })
                                                    await resolve({ status: true, code: 200, msg: `successful, your data has been read`, data : dataArray, metadata : metadata});
                                                    await conn.release();
                                                    //------------------------------------------------------------------------------------------------------
                                                    await emojic.emojify(`:computer ${ansiColors.blue(`Release Connection Database Instance`)}`);
                                                    //------------------------------------------------------------------------------------------------------
                                                }else{
                                                    await resolve({ status: true, code: 200, msg: `successful, your data has been read`, data : rows, metadata : metadata});
                                                    await conn.release();
                                                    //------------------------------------------------------------------------------------------------------
                                                    await emojic.emojify(`:computer ${ansiColors.blue(`Release Connection Database Instance`)}`);
                                                    //------------------------------------------------------------------------------------------------------
                                                }

                                            }else{
                                                await rejected({status: false, code: 404, msg: `Succeeded, But No Data Found`, metadata : metadata});
                                                await conn.release();
                                                //------------------------------------------------------------------------------------------------------
                                                await emojic.emojify(`:computer ${ansiColors.blue(`Release Connection Database Instance`)}`);
                                                //------------------------------------------------------------------------------------------------------
                                            }
                                            //###########################################################################
                                            break;
                                        case MariaDB.MARIADB_METHOD_PROCEDURE :
                                            //###########################################################################
                                            const mergerData = _.merge({ status : false, code : 505, metadata : metadata}, rows[0][0].response);
                                            if (mergerData.status){
                                                await resolve(mergerData);
                                            }else{
                                                rejected(mergerData)
                                            }
                                            await conn.release();
                                            //------------------------------------------------------------------------------------------------------
                                            await emojic.emojify(`:computer ${ansiColors.blue(`Release Connection Database Instance`)}`);
                                            //------------------------------------------------------------------------------------------------------
                                            //###########################################################################
                                            break;
                                        case MariaDB.MARIADB_METHOD_UPDATE :
                                            await (rows.affectedRows > 0) ?
                                                await (rows.warningStatus < 1) ?
                                                    await resolve({ status: true, code: 200, msg: `successful, your data has been update`, rows : rows.affectedRows, metadata : metadata}) :
                                                    await rejected({status: false, code: 201, msg: `warning status detected. Check Warning Message`, rows : rows.affectedRows, metadata : metadata}) :
                                                await rejected({status: false, code: 404, msg: `Succeeded, But No Data Changed`, metadata : metadata});
                                            await conn.release();
                                            //------------------------------------------------------------------------------------------------------
                                            await emojic.emojify(`:computer ${ansiColors.blue(`Release Connection Database Instance`)}`);
                                            //------------------------------------------------------------------------------------------------------
                                            break;
                                        case MariaDB.MARIADB_METHOD_DELETE :
                                            await (rows.affectedRows > 0) ?
                                                await (rows.warningStatus < 1) ?
                                                    await resolve({ status: true, code: 200, msg: `successful, your data has been deleted`, rows : rows.affectedRows, metadata : metadata}) :
                                                    await rejected({status: false, code: 201, msg: `warning status detected. Check Warning Message`, rows : rows.affectedRows, metadata : metadata}) :
                                                await rejected({status: false, code: 404, msg: `Succeeded, But No Data Changed`, metadata : metadata});
                                            await conn.release();
                                            //------------------------------------------------------------------------------------------------------
                                            await emojic.emojify(`:computer ${ansiColors.blue(`Release Connection Database Instance`)}`);
                                            //------------------------------------------------------------------------------------------------------
                                            break;
                                        default :
                                            //###########################################################################
                                            await (rows.length > 0) ?
                                                await resolve({ status: true, code: 200, msg: `successful, your data has been execute`, data : rows, metadata : metadata}) :
                                                await rejected({status: false, code: 404, msg: `Succeeded, But No Data Found`, metadata : metadata});
                                            await conn.release();
                                            //------------------------------------------------------------------------------------------------------
                                            await emojic.emojify(`:computer ${ansiColors.blue(`Release Connection Database Instance`)}`);
                                            //------------------------------------------------------------------------------------------------------
                                            //###########################################################################
                                            break;
                                    }
                                }).catch(async (err) => {
                                    switch (err.code){
                                        case 'ER_TABLE_EXISTS_ERROR' :
                                            await rejected({ status: false, code: 500, msg: "Failed, Table Name Is Exists", error: { errorMsg : err.text, errorCode : err.code, errNo : err.errno }});
                                            await conn.release();
                                            //------------------------------------------------------------------------------------------------------
                                            await emojic.emojify(`:computer ${ansiColors.blue(`Release Connection Database Instance`)}`);
                                            //------------------------------------------------------------------------------------------------------
                                            break;
                                        default :
                                            await rejected({ status: false, code: 500, msg: "Error Detected", error: { errorMsg : err.text, errorCode : err.code, errNo : err.errno }});
                                            await conn.release();
                                            //------------------------------------------------------------------------------------------------------
                                            await emojic.emojify(`:computer ${ansiColors.blue(`Release Connection Database Instance`)}`);
                                        //------------------------------------------------------------------------------------------------------
                                    }

                                });
                            /** End Create A Query  **/
                        }).catch(async (error) => {
                        switch (error.code){
                            case 'ER_BAD_DB_ERROR' :
                                await rejected( { status: false, code: 505, msg: "database name is not resolved. check database name in constructor configuration", error: { fatal : error.fatal, text : error.text, sqlState : error.sqlState, code : error.code}});
                                break;
                            case 'ER_GET_CONNECTION_TIMEOUT' :
                                await rejected({ status: false, code: 505, msg: "connection to database server timed out", error: { fatal : error.fatal, text : error.text, sqlState : error.sqlState, code : error.code}});
                                break;
                            default :
                                await rejected({ status: false, code: 505, msg: "An unknown error occurred", error: error});

                        }
                    });
                    break;
                case MariaDB.MARIADB_POOL_CLUSTER:
                    this.DBInstance.getConnection()
                        .then(async (conn) => {
                            /** Create A Query  **/
                            await conn.query(mSQLString, ArrayParams)
                                .then(async (rows) => {
                                    let metadata = { activeConnections : this.DBInstance.activeConnections(), idleConnections : this.DBInstance.idleConnections(), totalConnections : this.DBInstance.totalConnections()};
                                    switch (this.#method){
                                        case MariaDB.MARIADB_METHOD_CREATE :
                                            //###########################################################################
                                            await (rows.affectedRows > 0) ?
                                                await (rows.warningStatus < 1) ?
                                                    await resolve({ status: true, code: 200, msg: `successful, your data has been created`, id : rows.insertId, metadata : metadata}) :
                                                    await rejected({status: false, code: 201, msg: `warning status detected. Check Warning Message`, id : rows.insertId, metadata : metadata})
                                                : await rejected({status: false, code: 404, msg: `Succeeded, But No Data Changed`, metadata : metadata});
                                            await conn.release();
                                            //###########################################################################
                                            break;
                                        case MariaDB.MARIADB_METHOD_READ :
                                            //###########################################################################
                                            await (rows.length > 0) ?
                                                await resolve({ status: true, code: 200, msg: `successful, your data has been read`, data : rows, metadata : metadata}) :
                                                await rejected({status: false, code: 404, msg: `Succeeded, But No Data Found`, metadata : metadata});
                                            await conn.release();
                                            //###########################################################################
                                            break;
                                        case MariaDB.MARIADB_METHOD_UPDATE :
                                            await (rows.affectedRows > 0) ?
                                                await (rows.warningStatus < 1) ?
                                                    await resolve({ status: true, code: 200, msg: `successful, your data has been update`, rows : rows.affectedRows, metadata : metadata}) :
                                                    await rejected({status: false, code: 201, msg: `warning status detected. Check Warning Message`, rows : rows.affectedRows, metadata : metadata}) :
                                                await rejected({status: false, code: 404, msg: `Succeeded, But No Data Changed`, metadata : metadata});
                                            await conn.release();
                                            break;
                                        case MariaDB.MARIADB_METHOD_DELETE :
                                            await (rows.affectedRows > 0) ?
                                                await (rows.warningStatus < 1) ?
                                                    await resolve({ status: true, code: 200, msg: `successful, your data has been deleted`, rows : rows.affectedRows, metadata : metadata}) :
                                                    await rejected({status: false, code: 201, msg: `warning status detected. Check Warning Message`, rows : rows.affectedRows, metadata : metadata}) :
                                                await rejected({status: false, code: 404, msg: `Succeeded, But No Data Changed`, metadata : metadata});
                                            await conn.release();
                                            break;
                                        default :
                                            //###########################################################################
                                            await (rows.length > 0) ?
                                                await resolve({ status: true, code: 200, msg: `successful, your data has been execute`, data : rows, metadata : metadata}) :
                                                await rejected({status: false, code: 404, msg: `Succeeded, But No Data Found`, metadata : metadata});
                                            await conn.release();
                                            //###########################################################################
                                            break;
                                    }
                                }).catch(async (err) => {
                                    await rejected({ status: false, code: 500, msg: "Error Detected", error: { errorMsg : err.text, errorCode : err.code, errNo : err.errno }});
                                    await conn.release();
                                });
                            /** End Create A Query  **/
                        }).catch(async (error) => {
                        switch (error.code){
                            case 'ER_BAD_DB_ERROR' :
                                await rejected( { status: false, code: 505, msg: "database name is not resolved. check database name in constructor configuration", error: { fatal : error.fatal, text : error.text, sqlState : error.sqlState, code : error.code}});
                                break;
                            case 'ER_GET_CONNECTION_TIMEOUT' :
                                await rejected({ status: false, code: 505, msg: "connection to database server timed out", error: { fatal : error.fatal, text : error.text, sqlState : error.sqlState, code : error.code}});
                                break;
                            default :
                                await rejected({ status: false, code: 505, msg: "An unknown error occurred", error: error});

                        }
                    });

                    break;
                default:
                    this.DBInstance
                        .then(async (conn) => {
                            //console.log(err)
                            /** Create A Query  **/
                            await conn.query(mSQLString, ArrayParams)
                                .then(async (rows) => {
                                    let metadata = { };
                                    switch (this.#method){
                                        case MariaDB.MARIADB_METHOD_CREATE :
                                            //###########################################################################
                                            await (rows.affectedRows > 0) ?
                                                await (rows.warningStatus < 1) ?
                                                    await resolve({ status: true, code: 200, msg: `successful, your data has been created`, id : rows.insertId, metadata : metadata}) :
                                                    await rejected({status: false, code: 201, msg: `warning status detected. Check Warning Message`, id : rows.insertId, metadata : metadata})
                                                : await rejected({status: false, code: 404, msg: `Succeeded, But No Data Changed`, metadata : metadata});
                                            await conn.end();
                                            //###########################################################################
                                            break;
                                        case MariaDB.MARIADB_METHOD_READ :
                                            //###########################################################################
                                            await (rows.length > 0) ?
                                                await resolve({ status: true, code: 200, msg: `successful, your data has been read`, data : rows, metadata : metadata}) :
                                                await rejected({status: false, code: 404, msg: `Succeeded, But No Data Found`, metadata : metadata});
                                            await conn.end();
                                            //###########################################################################
                                            break;
                                        case MariaDB.MARIADB_METHOD_UPDATE :
                                            await (rows.affectedRows > 0) ?
                                                await (rows.warningStatus < 1) ?
                                                    await resolve({ status: true, code: 200, msg: `successful, your data has been update`, rows : rows.affectedRows, metadata : metadata}) :
                                                    await rejected({status: false, code: 201, msg: `warning status detected. Check Warning Message`, rows : rows.affectedRows, metadata : metadata}) :
                                                await rejected({status: false, code: 404, msg: `Succeeded, But No Data Changed`, metadata : metadata});
                                            await conn.end();
                                            break;
                                        case MariaDB.MARIADB_METHOD_DELETE :
                                            await (rows.affectedRows > 0) ?
                                                await (rows.warningStatus < 1) ?
                                                    await resolve({ status: true, code: 200, msg: `successful, your data has been deleted`, rows : rows.affectedRows, metadata : metadata}) :
                                                    await rejected({status: false, code: 201, msg: `warning status detected. Check Warning Message`, rows : rows.affectedRows, metadata : metadata}) :
                                                await rejected({status: false, code: 404, msg: `Succeeded, But No Data Changed`, metadata : metadata});
                                            await conn.end();
                                            break;
                                        default :
                                            //###########################################################################
                                            await (rows.length > 0) ?
                                                await resolve({ status: true, code: 200, msg: `successful, your data has been execute`, data : rows, metadata : metadata}) :
                                                await rejected({status: false, code: 404, msg: `Succeeded, But No Data Found`, metadata : metadata});
                                            await conn.end();
                                            //###########################################################################
                                            break;
                                    }
                                }).catch(async (err) => {
                                    await rejected({ status: false, code: 500, msg: "Error Detected", error: { errorMsg : err.text, errorCode : err.code, errNo : err.errno }});
                                    await conn.end();
                                });
                            /** End Create A Query  **/
                        }).catch(async (error) => {
                        switch (error.code){
                            case 'ER_BAD_DB_ERROR' :
                                await rejected( { status: false, code: 505, msg: "database name is not resolved. check database name in constructor configuration", error: { fatal : error.fatal, text : error.text, sqlState : error.sqlState, code : error.code}});
                                break;
                            case 'ER_GET_CONNECTION_TIMEOUT' :
                                await rejected({ status: false, code: 505, msg: "connection to database server timed out", error: { fatal : error.fatal, text : error.text, sqlState : error.sqlState, code : error.code}});
                                break;
                            default :
                                await rejected({ status: false, code: 505, msg: "An unknown error occurred", error: error});

                        }
                    });

                    break;
            }
        });

    };
    Sql = this.rawQuerySync;

}

export default MariaDB;