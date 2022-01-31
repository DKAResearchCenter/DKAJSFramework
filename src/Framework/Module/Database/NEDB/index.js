import nedb from "nedb";
import _ from "lodash";

class NEDB {

    constructor(config) {
        this.config = _.merge(DKA.config.Database.NeDB, config);
        this.dbInstance = new nedb(this.config);
        return new Promise(async (resolve, rejected) => {
            this.dbInstance.loadDatabase(async (err) => {
                if (!err){
                    await resolve(this.dbInstance);
                }else {
                    await rejected({ status : false, code : 500, msg : `error detected`, error : err});
                }
            });
        })
    }


}

export default NEDB;