import _ from "lodash"

class DKA {

    /**
     *
     * @param Options
     */
    constructor(Options) {
        this.Options = _.extend({
            KeySalt : "1q2w3e4r5t6y"
        }, Options);


    }

    /**
     *
     * @param {JSON | String} data
     * @param {String | Number } KeySalt
     * @returns {Promise<void>}
     */
    async encode(data, KeySalt = this.Options.KeySalt) {

        
    }
}