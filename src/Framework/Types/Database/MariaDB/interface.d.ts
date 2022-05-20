import {PoolConfig, ConnectionConfig, PoolClusterConfig, QueryOptions} from "mariadb";
import internal from "stream";
export interface Data {

}

export interface Rules {
    data : Data | undefined | Array<any> | Object
}

export interface MetadataCallback {
    activeConnections? : number,
    idleConnections? : number,
    totalConnections? : number,
    sqlRaw? : string | undefined,
    timeExecuteinSecond? : string
}

export interface Callback {
    status : boolean,
    code : 404 | 200 | 500 | 503,
    msg : string,
    metadata : MetadataCallback
}

export interface CallbackCreate extends Callback {
    id : number,
}

export interface CallbackRead extends Callback {
    data : Array<any>
}

export interface CallbackUpdate extends Callback {
    rows : number
}


export interface OptionsConstructor extends PoolConfig, ConnectionConfig, PoolClusterConfig {
    engine? : Number
}



export interface Class {

    Create(TableName: String, Rules?: Rules) : CallbackCreate | undefined,
    rawQuerySync(SQLString : string | QueryOptions, arrayParams? : Array<any>) : Promise<Callback | CallbackCreate | CallbackRead | CallbackUpdate>

}


