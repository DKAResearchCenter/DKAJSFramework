import _ from "lodash";

class POSTGRES {

    /***
     * @returns {number}
     * @constructor
     */
    static get PSQL_CONNECTION() {
        return 1;
    };

    static get PSQL_POOL() {
        return 2;
    };

    /**
     * Function For Data System
     *
     * @param config
     */
    constructor(config) {
        this.config = _.extend({
            engine : POSTGRES.PSQL_CONNECTION,
            user: 'me',
            host: 'localhost',
            database: 'api',
            password: 'password',
            port: 5432
        }, config);

        const PSQLEngine = require("pg");
        switch (this.config.engine){
            case POSTGRES.PSQL_CONNECTION :
                this.DBInstance = new PSQLEngine.Connection(this.config);
                break;
            case POSTGRES.PSQL_POOL :
                this.DBInstance = new PSQLEngine.Pool(this.config);
                break;
            default :

                break;
        }
    }


}

export default POSTGRES;