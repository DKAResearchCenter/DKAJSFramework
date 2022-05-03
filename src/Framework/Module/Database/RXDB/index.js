import _ from "lodash";
import {createRxDatabase} from "rxdb";

class RxDB {

    #config;

    constructor(config) {
        this.#config = _.merge({
            name : "test",

        }, config);
        this.db = createRxDatabase(this.#config);

    }
}

export default RxDB;
