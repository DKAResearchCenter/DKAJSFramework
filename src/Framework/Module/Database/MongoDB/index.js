'use strict';
'use warning';

import _ from "lodash";
import {MongoClient} from "mongodb"

class MongoDB {


    /**
     *
     * @param {JSON} config
     * @param {String} config.host
     * @param {String} config.port
     * @param {String} config.database
     * @returns {Promise}
     */
    constructor(config) {

        this.config = _.extend({
            host: "localhost",
            port: 27017,
            database: undefined
        }, config);


        this.host = `"mongodb://${this.config.host}:${this.config.port}/"`;

        return new Promise(async (resolve, rejected) => {
            MongoClient.connect(this.host, async (err, MongoClient) => {
                if (!err){
                    this.MongoClient = MongoClient;
                    const MongoDbInstance = (this.config.database !== undefined) ? MongoClient.db(this.config.database) : MongoClient;
                    resolve(MongoClient);
                }else{
                    rejected(err.code);
                }
            });
        })
    }

    CreateUser = async () => {

    }


}

export default MongoDB;