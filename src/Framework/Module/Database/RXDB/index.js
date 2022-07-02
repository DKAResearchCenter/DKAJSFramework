import _ from "lodash";

class RxDB {

    #config;

    constructor(config) {
        this.#config = _.merge({
            name : "test",

        }, config);

        import("rxdb")
            .then(async (rxdb) => {
                this.db = await rxdb.createRxDatabase(this.#config);
        }).catch(async (error) => {
            throw Error("MODULE RXDB NOT FOUND");
        });
    }
}

export default RxDB;
