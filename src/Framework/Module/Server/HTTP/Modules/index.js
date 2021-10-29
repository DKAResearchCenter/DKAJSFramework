import _ from "lodash";

class ModulesHttp {
    #routeMap;
    #callback;


    constructor() {

        this.#routeMap = [];
    }

    /**
     *
     * @param {String} url
     * @param {function(Object, Object)} callback
     * @return {ModulesHttp}
     */
    get(url, callback) {
        this.#callback = _.extend({
            request: {},
            response: {
                send: async (data) => {

                }
            }
        }, callback)
        return this;
    }

    /**
     *
     * @param {String} url
     * @param {function(Object, Object)} callback
     * @return {ModulesHttp}
     */
    post(url, callback) {
        this.#routeMap.push({
            url: url,
            code: 200,

        })
        return this;
    }


}

export default ModulesHttp;