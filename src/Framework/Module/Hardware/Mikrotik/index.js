import _ from "lodash";

class Mikrotik {

    constructor(config) {
        this.config = _.extend({
            host : "192.168.88.1",
            username : "",
            password : ""
        }, config);


        return new Promise(async (resolve, rejected) => {
            this.device = await new Mikrotik(this.config.host);
            await resolve(true)
        }).then(async (res) => {

        })
    }
}