'use strict';
'use warning';
import {Server, Options, Functions} from "./../../index.module.d.js";
import {join} from "path";
import mysqldump from 'mysqldump';
import _ from "lodash";
import moment from "moment";
import {existsSync, mkdirSync} from "fs";

/**
 * Functions Fot Class Mysql Database In Framework
 * All Right Reserved
 * **/

/**
 * @description Ini Adalah Module Library Yang Berisi Konfigurasi Server Untuk Membangun Sebuah Arsitektur Webserver
 * @example
 *     new DKA.Database.MariaDB(options)
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
    #DBInstance;
    #mSearchAdd;
    #options;

    /***
     * @returns {number}
     * @constructor
     */
    static get MARIADB_CREATECONNECTION() {
        return 1;
    };

    /***
     * @returns {number}
     * @constructor
     */
    static get MARIADB_POOL_CLUSTER() {
        return 2
    };

    /***
     *
     * @returns {number}
     */
    static get MARIADB_POOL() {
        return 3;
    };

    /**
     * @constructor
     * @param {Number} options.engine
     * @param {string} options.host
     * @param {string} options.user
     * @param {string} options.password
     * @param {string} options.database
     * @param {Number} options.port
     * @param {Number} options.timezone
     * @param {number} options.connectionLimit
     * @param {Boolean} options.autoBackup
     * @param {Boolean} options.encryption
     */
    constructor(options) {
        this.options = _.extend({
            engine : MariaDB.MARIADB_CREATECONNECTION,
            host : "localhost",
            user : "root",
            password : "",
            database : "test",
            port : 3306,
            connectionLimit : 2,
            timezone : '+08:00',
            autoBackup : false,
            encryption : {
                table : false,
                column : false,
                data : false
            }
        }, options);

        /** **
         *
         * */
        const MariaDBEngine = require("mariadb");
        moment.locale("id");


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
     * @deprecated please use CreateTable.
     * @returns {Promise<void>}
     */
    init = async() => {

    }
    /**
     * @constructor
     * @param {String} TableName
     * @param {JSON} Rule Place Your Model Data
     * @param {String} Rule.typeData Place Your Model Data
     * @param {Boolean} Rule.defaultNotNull Place Your Model Data
     * @returns {Promise<unknown> | JSON}
     * @description
     */
    CreateTable = async (TableName, Rule) => {

        /** Load Encryption**/
        const enc = await new Functions.Encryption.Crypto();

        const mTableName = (this.options.encryption.table) ? enc.encode(TableName).toString() : TableName;

        let arrayColumn = [];

        Object.keys(Rule).forEach((key) => {
            let mKey = (this.options.encryption.column && Rule[key].primaryKey === undefined) ? new enc.encode(key).toString() : key;
            let typeData = (Rule[key].typeData !== undefined) ? `${Rule[key].typeData}` : Options.MARIADB_TYPE_DATA_LONGTEXT;
            let defaultNotNull = (Rule[key].primaryKey !== true ) ?
                (Rule[key].defaultNotNull !== undefined && Rule[key].defaultNotNull) ?
                    `DEFAULT NOT NULL` : `DEFAULT NULL`
                    : ``;
            let autoIncrement = (Rule[key].autoIncrement !== undefined) ? Options.MARIADB_OPT_AUTO_INCREMENT : ``;
            let primaryKey = (Rule[key].primaryKey !== undefined) ? Options.MARIADB_OPT_AUTO_PRIMARY_KEY : ``;

            arrayColumn.push(`\`${mKey}\` ${typeData} ${defaultNotNull} ${autoIncrement} ${primaryKey}`);
        });

        const SqlScript = `CREATE TABLE IF NOT EXISTS \`${mTableName}\` (${arrayColumn});`;

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

        let Rule = _.extend({
            data: false,
        }, Rules)

        /** Load Encryption**/
        const enc = await new Functions.Encryption.Crypto();

        const mTableName = (this.options.encryption.table) ? enc.encode(TableName).toString() : TableName;

        let TypeData = Rule.data instanceof Array;

        if (!TypeData) {
            this.mKey = [];
            this.mVal = [];

            Object.keys(Rule.data).forEach((key) => {
                this.mKey.push(` \`${(this.options.encryption.column) ? enc.encode(key) : key}\` `);
                this.mVal.push(`"${(this.options.encryption.column) ? enc.encode(Rule.data[key]) : Rule.data[key]}"`);
            });

            let SqlScript = `INSERT INTO \`${mTableName}\` (${this.mKey}) VALUES (${this.mVal}) `;

            this.#returnedResult = await this.rawQuerySync(SqlScript, []);
        } else {
            let mVal = [];
            let mKey = [];
            let mSetData = [];
            Rule.data.forEach(function (item, index,) {
                mKey = [];
                mSetData = [];
                Object.keys(item).forEach(function (key) {
                    mKey.push(`${key}`);
                    mSetData.push(`"${Rule.data[index][key]}"`);
                });
                mVal.push(`(${mSetData})`)
            });

            const SqlScript = `INSERT INTO ${mTableName} (${mKey}) VALUES ${mVal} `;

            this.#returnedResult = await this.rawQuerySync(SqlScript, []);

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

        /** lodash Extend JSON COnfig **/
        const Rule = _.extend({
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
        const enc = await new Functions.Encryption.Crypto();

        const mTableName = (this.options.encryption.table) ? enc.encode(TableName).toString() : TableName;

        this.mWhere = [];
        this.mSearchAdd = ``;

        let TypeData = Rule.search instanceof Array;

        if (!TypeData) {
            Object.keys(Rule.search).forEach( (item) => {
                this.mSearchAdd += `\`${item}\`=\'${Rule.search[item]}\' `;
            })
        }else{
            Rule.search.forEach((item) => {
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

        const mSQL = `SELECT ${SelectColumn} FROM \`${mTableName}\` ${selectParentAs} ${UpdateWhere} \n ${SelectOrderBy} ${SelectLimit}`;

        return this.rawQuerySync(mSQL, []);

    }
    Baca = this.Read;
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

        const Rule = _.extend({
            search: false
        }, Rules)

        this.mWhere = [];

        Object.keys(Rule.search).forEach((key) => {
            this.mWhere.push(`${key} = '${Rule.search[key]}' `)
        });

        const DeleteWhere = (Rule.search !== false) ? `WHERE ${this.mWhere}` : ``;

        const SqlScript = `DELETE FROM ${TableName} ${DeleteWhere} `;

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
                            msg : "File Backup is Exist. Skip Save Database"
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
        /** Promise To Task Future **/
        return new Promise(async (resolve, rejected) => {
            /** Declaration Of Variable **/
            switch (this.options.engine) {
                case MariaDB.MARIADB_POOL:
                    this.DBInstance.getConnection()
                        .then(async (conn) => {
                            /**
                             * Checking Auto Backup System
                             */
                            if (this.options.autoBackup){
                                this.Export()
                                    .then(async () => {
                                        /** Create A Query  **/
                                        await conn.query(mSQLString, ArrayParams)
                                            .then(async (rows) => {
                                                if (rows.length > 0 || rows.affectedRows > 0 || rows.warningStatus === 0) {
                                                    await conn.query("SELECT UNIX_TIMESTAMP(CURRENT_TIMESTAMP) AS time_execute")
                                                        .then(async (rowsTime) => {
                                                            this.returnedResult = {
                                                                status: true,
                                                                code: 200,
                                                                msg: `Success`,
                                                                data: rows,
                                                                time_execute : {
                                                                    timestamp : moment.unix(rowsTime[0].time_execute).toISOString(),
                                                                    human : moment.unix(rowsTime[0].time_execute).format('LLL'),
                                                                    unix : rowsTime[0].time_execute
                                                                }
                                                            };
                                                        }).catch(rejected)
                                                    await resolve(this.returnedResult);
                                                } else {
                                                    this.returnedResult = {
                                                        status: false,
                                                        code: 404,
                                                        msg: `Not Found`
                                                    };
                                                    await rejected(this.returnedResult);
                                                }

                                            }).catch(async (err) => {
                                                this.returnedResult = {
                                                    status: false,
                                                    code: 505,
                                                    msg: "Error Detected",
                                                    error: {
                                                        errorMsg : err.text,
                                                        errorCode : err.code,
                                                        errNo : err.errno
                                                    }
                                                }
                                                await rejected(this.returnedResult);
                                            }).finally(() => {
                                                conn.end();
                                            });
                                        /** End Create A Query  **/
                                    })
                                    .catch(async (error) => {
                                        await conn.end();
                                        await rejected(error);
                                    })
                            }else{
                                /** Create A Query  **/
                                await conn.query(mSQLString, ArrayParams)
                                    .then(async (rows) => {
                                        if (rows.length > 0 || rows.affectedRows > 0 || rows.warningStatus === 0) {
                                            await conn.query("SELECT UNIX_TIMESTAMP(CURRENT_TIMESTAMP) AS time_execute")
                                                .then(async (rowsTime) => {
                                                    this.returnedResult = {
                                                        status: true,
                                                        code: 200,
                                                        msg: `Success`,
                                                        data: rows,
                                                        time_execute : {
                                                            timestamp : moment.unix(rowsTime[0].time_execute).toISOString(),
                                                            human : moment.unix(rowsTime[0].time_execute).format('LLL'),
                                                            unix : rowsTime[0].time_execute
                                                        }
                                                    };
                                                }).catch(rejected)
                                            conn.release();
                                            await resolve(this.returnedResult);
                                        }else {
                                            this.returnedResult = {
                                                status: false,
                                                code: 404,
                                                msg: `Not Found`
                                            };
                                            await rejected(this.returnedResult);
                                            conn.release()
                                        }

                                    }).catch(async (err) => {
                                        this.returnedResult = {
                                            status: false,
                                            code: 505,
                                            msg: "Error Detected",
                                            error: {
                                                errorMsg : err.text,
                                                errorCode : err.code,
                                                errNo : err.errno
                                            }
                                        }
                                        conn.release();
                                        await rejected(this.returnedResult);
                                    });
                                /** End Create A Query  **/
                            }

                        })
                        .catch(async (error) => {
                        this.returnedResult = {
                            status: false,
                            code: 505,
                            msg: "Error Detected",
                            error: error
                        };
                        await rejected(this.returnedResult);
                    });
                    break;
                case MariaDB.MARIADB_POOL_CLUSTER:
                    this.DBInstance.getConnection()
                        .then(async (conn) => {
                            if (this.options.autoBackup){
                                this.Export()
                                    .then(async () => {
                                        /** Create A Query  **/
                                        await conn.query(mSQLString, ArrayParams)
                                            .then(async (rows) => {
                                                if (rows.length > 0 || rows.affectedRows > 0 || rows.warningStatus === 0) {
                                                    await conn.query("SELECT UNIX_TIMESTAMP(CURRENT_TIMESTAMP) AS time_execute")
                                                        .then(async (rowsTime) => {
                                                            this.returnedResult = {
                                                                status: true,
                                                                code: 200,
                                                                msg: `Success`,
                                                                data: rows,
                                                                time_execute : {
                                                                    timestamp : moment.unix(rowsTime[0].time_execute).toISOString(),
                                                                    human : moment.unix(rowsTime[0].time_execute).format('LLL'),
                                                                    unix : rowsTime[0].time_execute
                                                                }
                                                            };
                                                        }).catch(rejected)
                                                    await resolve(this.returnedResult);
                                                } else {
                                                    this.returnedResult = {
                                                        status: false,
                                                        code: 404,
                                                        msg: `Not Found`,
                                                        data : rows
                                                    };
                                                    await rejected(this.returnedResult);
                                                }

                                            }).catch(async (err) => {
                                                this.returnedResult = {
                                                    status: false,
                                                    code: 505,
                                                    msg: "Error Detected",
                                                    error: err
                                                }
                                                await rejected(this.returnedResult);
                                            }).finally(() => {
                                                conn.end();
                                            });
                                        /** End Create A Query  **/
                                    })
                                    .catch(async (error) => {
                                        await rejected(error);
                                    })
                            }else{
                                /** Create A Query  **/
                                await conn.query(mSQLString, ArrayParams)
                                    .then(async (rows) => {
                                        if (rows.length > 0 || rows.affectedRows > 0) {
                                            await conn.query("SELECT UNIX_TIMESTAMP(CURRENT_TIMESTAMP) AS time_execute")
                                                .then(async (rowsTime) => {
                                                    this.returnedResult = {
                                                        status: true,
                                                        code: 200,
                                                        msg: `Success`,
                                                        data: rows,
                                                        time_execute : {
                                                            timestamp : moment.unix(rowsTime[0].time_execute).toISOString(),
                                                            human : moment.unix(rowsTime[0].time_execute).format('LLL'),
                                                            unix : rowsTime[0].time_execute
                                                        }
                                                    };
                                                }).catch(rejected)
                                            conn.end();
                                            await resolve(this.returnedResult);
                                        } else {
                                            this.returnedResult = {
                                                status: false,
                                                code: 404,
                                                msg: `Not Found`,
                                                data : rows
                                            };
                                            conn.end();
                                            await rejected(this.returnedResult);
                                        }

                                    }).catch(async (err) => {
                                        this.returnedResult = {
                                            status: false,
                                            code: 505,
                                            msg: "Error Detected",
                                            error: err
                                        }
                                        conn.end();
                                        await rejected(this.returnedResult);
                                    }).finally(() => {
                                        conn.end();
                                    });
                                /** End Create A Query  **/
                            }
                        }).catch(async (error) => {
                        this.returnedResult = {
                            status: false,
                            code: 505,
                            msg: "Error Detected",
                            error: error
                        };
                        await rejected(this.returnedResult);
                    });

                    break;
                default:
                    this.DBInstance
                        .then(async (conn) => {
                            if (this.options.autoBackup){
                                this.Export()
                                    .then(async () => {
                                        /** Create A Query  **/
                                        await conn.query(mSQLString, ArrayParams)
                                            .then(async (rows) => {
                                                if (rows.length > 0 || rows.affectedRows > 0) {
                                                    await conn.query("SELECT UNIX_TIMESTAMP(CURRENT_TIMESTAMP) AS time_execute")
                                                        .then(async (rowsTime) => {
                                                            this.returnedResult = {
                                                                status: true,
                                                                code: 200,
                                                                msg: `Success`,
                                                                data: rows,
                                                                time_execute : {
                                                                    timestamp : moment.unix(rowsTime[0].time_execute).toISOString(),
                                                                    human : moment.unix(rowsTime[0].time_execute).format('LLL'),
                                                                    unix : rowsTime[0].time_execute
                                                                }
                                                            };
                                                        }).catch(rejected)
                                                    await resolve(this.returnedResult);
                                                } else {
                                                    this.returnedResult = {
                                                        status: false,
                                                        code: 404,
                                                        msg: `Not Found`
                                                    };
                                                    await rejected(this.returnedResult);
                                                }

                                            }).catch(async (err) => {
                                                this.returnedResult = {
                                                    status: false,
                                                    code: 505,
                                                    msg: "Error Detected",
                                                    error: {
                                                        errorMsg : err.text,
                                                        errorCode : err.code,
                                                        errNo : err.errno
                                                    }
                                                }
                                                await rejected(this.returnedResult);
                                            }).finally(() => {
                                                conn.end();
                                            });
                                        /** End Create A Query  **/
                                    })
                                    .catch(async (error) => {
                                        await rejected(error);
                                    })
                            }else{
                                /** Create A Query  **/
                                await conn.query(mSQLString, ArrayParams)
                                    .then(async (rows) => {
                                        if (rows.length > 0 || rows.affectedRows > 0) {
                                            await conn.query("SELECT UNIX_TIMESTAMP(CURRENT_TIMESTAMP) AS time_execute")
                                                .then(async (rowsTime) => {
                                                    this.returnedResult = {
                                                        status: true,
                                                        code: 200,
                                                        msg: `Success`,
                                                        data: rows,
                                                        time_execute : {
                                                            timestamp : moment.unix(rowsTime[0].time_execute).toISOString(),
                                                            human : moment.unix(rowsTime[0].time_execute).format('LLL'),
                                                            unix : rowsTime[0].time_execute
                                                        }
                                                    };
                                                }).catch(rejected)
                                            conn.end();
                                            await resolve(this.returnedResult);
                                        } else {
                                            this.returnedResult = {
                                                status: false,
                                                code: 404,
                                                msg: `Not Found`
                                            };
                                            await rejected(this.returnedResult);
                                        }

                                    }).catch(async (err) => {
                                        this.returnedResult = {
                                            status: false,
                                            code: 505,
                                            msg: "Error Detected",
                                            error: {
                                                errorMsg : err.text,
                                                errorCode : err.code,
                                                errNo : err.errno
                                            }
                                        }
                                        await rejected(this.returnedResult);
                                    }).finally(async() => {
                                        await conn.end();
                                    })
                                /** End Create A Query  **/
                            }
                        }).catch(async (error) => {
                        this.returnedResult = {
                            status: false,
                            code: 505,
                            msg: "Error Detected",
                            error: error
                        }
                        await rejected(this.returnedResult);
                    })

                    break;
            }
        });

    };
    Sql = this.rawQuerySync;



}

export default MariaDB;