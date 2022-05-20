import * as _ from "lodash";
import moment from "moment";
import GlobalConfig from "./../../Config/index"
import {
    Pool,
    PoolCluster,
    Connection,
    createConnection,
    createPool,
    createPoolCluster,
    PoolConnection,
    QueryOptions
} from "mariadb"
import {
    Class,
    OptionsConstructor,
    Callback,
    Rules,
    MetadataCallback,
    CallbackCreate,
    CallbackRead,
    CallbackUpdate
} from "./interface"
import ansiColors from "ansi-colors";


export default class MariaDB implements Class  {

    DBInstance? : Pool | Promise<Connection> | PoolCluster
    option : OptionsConstructor
    method : number | undefined
    mKey : Array<any> = [];
    mVal : Array<any> = [];
    returnedResult : Promise<Callback | CallbackCreate | CallbackRead | CallbackUpdate> | undefined

    /***
     * @returns {number}
     * @constructor
     */
    static get MARIADB_CREATECONNECTION() : number {
        return 1;
    };

    /***
     * @returns {number}
     * @constructor
     */
    static get MARIADB_POOL_CLUSTER()  : number {
        return 2;
    };

    /***
     *
     * @returns {number}
     */
    static get MARIADB_POOL() : number  {
        return 3;
    };

    static get MARIADB_METHOD_CREATE() : number {
        return 1;
    }

    static get MARIADB_METHOD_READ() : number {
        return 2
    }

    static get MARIADB_METHOD_UPDATE() : number {
        return 3;
    }

    static get MARIADB_METHOD_DELETE() : number {
        return 4
    }

    constructor(option : OptionsConstructor) {

        this.option  = _.merge({
            engine : GlobalConfig.Database.MariaDB.engine
        }, option);

        moment.locale("id");


    }




    public rawQuerySync(SQLString : string | QueryOptions, arrayParams?: Array<any>): Promise<Callback | CallbackCreate | CallbackRead | CallbackUpdate> {
        const mSQLString = SQLString;
        const timeStart = new Date().getTime();
        return new Promise(async (resolve, rejected) => {
            //################### CHECKED ENGINE TYPE ###################################
            switch (this.option.engine) {
                case MariaDB.MARIADB_POOL :
                    /** Create Pool Instance **/
                    let DBInstance = await createPool(this.option)
                    /** get Connection From Instance **/
                    await DBInstance.getConnection()
                        .then(async (PoolConnection) => {
                            /** Build And Create Query From Instance **/
                            await PoolConnection.query(mSQLString, arrayParams)
                                .then(async (rows) => {
                                    //############ DEFINED VARIABLE ###############################################
                                    let timeEnd = new Date().getTime();
                                    let metadata : MetadataCallback = {
                                        activeConnections : DBInstance.activeConnections(),
                                        idleConnections : DBInstance.idleConnections(),
                                        totalConnections : DBInstance.totalConnections(),
                                        sqlRaw : `${mSQLString}`,
                                        timeExecuteinSecond : `${(timeEnd- timeStart)} ms`
                                    };
                                    //############ END DEFINED VARIABLE ###########################################
                                    //############ CHECK METHOD CRUD ##############################################
                                    switch (this.method) {
                                        case MariaDB.MARIADB_METHOD_CREATE :
                                            //###########################################################################
                                            await (rows.affectedRows > 0) ?
                                                await (rows.warningStatus < 1) ?
                                                    await resolve({ status: true, code: 200, msg: `successful, your data has been created`, id : rows.insertId, metadata : metadata }) :
                                                    await rejected({status: false, code: 201, msg: `warning status detected. Check Warning Message`, id : rows.insertId, metadata : metadata})
                                                : await rejected({status: false, code: 404, msg: `Succeeded, But No Data Changed`, metadata : metadata});
                                            await PoolConnection.release();
                                            //###########################################################################
                                            break;
                                        case MariaDB.MARIADB_METHOD_READ :
                                            //###########################################################################
                                            if (rows.length > 0) {
                                                await resolve({ status: true, code: 200, msg: `successful, your data has been read`, data : rows, metadata : metadata});
                                                await PoolConnection.release();
                                            }else{
                                                await rejected({status: false, code: 404, msg: `Succeeded, But No Data Found`, metadata : metadata});
                                                await PoolConnection.release();
                                            }
                                            //###########################################################################
                                            break;
                                        case MariaDB.MARIADB_METHOD_UPDATE :
                                            await (rows.affectedRows > 0) ?
                                                await (rows.warningStatus < 1) ?
                                                    await resolve({ status: true, code: 200, msg: `successful, your data has been update`, rows : rows.affectedRows, metadata : metadata}) :
                                                    await rejected({status: false, code: 201, msg: `warning status detected. Check Warning Message`, rows : rows.affectedRows, metadata : metadata}) :
                                                await rejected({status: false, code: 404, msg: `Succeeded, But No Data Changed`, metadata : metadata});
                                            await PoolConnection.release();
                                            break;
                                        case MariaDB.MARIADB_METHOD_DELETE :
                                            await (rows.affectedRows > 0) ?
                                                await (rows.warningStatus < 1) ?
                                                    await resolve({ status: true, code: 200, msg: `successful, your data has been deleted`, rows : rows.affectedRows, metadata : metadata}) :
                                                    await rejected({status: false, code: 201, msg: `warning status detected. Check Warning Message`, rows : rows.affectedRows, metadata : metadata}) :
                                                await rejected({status: false, code: 404, msg: `Succeeded, But No Data Changed`, metadata : metadata});
                                            await PoolConnection.release();
                                            break;
                                        default :
                                            //###########################################################################
                                            await (rows.length > 0) ?
                                                await resolve({ status: true, code: 200, msg: `successful, your data has been execute`, data : rows, metadata : metadata}) :
                                                await rejected({status: false, code: 404, msg: `Succeeded, But No Data Found`, metadata : metadata});
                                            await PoolConnection.release();
                                            //###########################################################################
                                            break;
                                    }
                                })
                                .catch(async (error) => {

                                })
                        })
                        .catch(async (error) => {

                        });
                    break;
                case MariaDB.MARIADB_CREATECONNECTION :
                    this.DBInstance = createConnection(this.option)
                    await this.DBInstance
                        .then(async (connection) => {

                        })
                        .catch(async (error) => {

                        })
                    break;
                case MariaDB.MARIADB_POOL_CLUSTER :
                    this.DBInstance = createPoolCluster(this.option)

            }
            //################### END CHECKED ENGINE TYPE ###################################
        })
    }

    Create(TableName: String, Rules?: Rules): CallbackCreate | undefined {

        return undefined;
    }



}