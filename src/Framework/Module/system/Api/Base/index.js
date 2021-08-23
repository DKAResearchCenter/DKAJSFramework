import _ from "lodash";

class Base {

    constructor(config) {
        this.config = _.extend({

        }, config);
    }

    getAccessToken = new Promise(async (resolve, rejected) => {

    });


}

export default Base;