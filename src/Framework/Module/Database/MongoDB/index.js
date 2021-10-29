'use strict';
'use warning';

import _ from "lodash";
import {MongoClient, Db} from "mongodb"

class MongoDB {


    /**
     *
     * @param {JSON} config
     * @param {String} config.host
     * @param {String} config.port
     * @param {String} config.database
     * @returns {Promise<MongoClient>}
     */
    constructor(config) {

        this.config = _.extend({
            host: "localhost",
            port: 27017,
            database: ""
        }, config);

        this.host = `"mongodb://${this.config.host}:${this.config.port}/${this.config.database}"`;


    }

    /**
     *
     * @returns {Promise<MongoClient>}
     */
    async connect(){
        return MongoClient.connect(this.host);
    }


}

export default MongoDB;