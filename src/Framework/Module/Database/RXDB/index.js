import _ from "lodash";
import { createRxDatabase, addRxPlugin } from "rxdb";

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
