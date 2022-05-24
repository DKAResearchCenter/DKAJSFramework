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






    Create(TableName: String, Rules?: Rules): CallbackCreate | undefined {

        return undefined;
    }

    rawQuerySync(SQLString: string | QueryOptions, arrayParams?: Array<any>) : Promise<Callback | CallbackCreate | CallbackRead | CallbackUpdate> | any {
    }



}