import _ from "lodash";
import http from "http";
import _extends from "@babel/runtime/helpers/esm/extends";


class DKA {
    #routeJSON = [];
    #options;
    #server
    #response
    #request
    #callback


    constructor(options) {
        this.#options = _.extend({
            header: [
                {key: "Content-Type", value: "application/json"}
            ],
            request: {},
            response: {
                statusCode: 200
            },
        });

        this.#server = http.createServer((request, response) => {
            this.#response = _extends(response, this.#options.response);
            response = this.#response;

            response.setHeader('Content-Type', 'text/html');
            response.write(" " + request.url);
            response.end();
        });

    }

    /**
     * @param {Function} appEngine
     * @param {Object} options
     */
    use(appEngine, options) {

    }

    /**
     * @param {String} url
     * @param {Object} callback
     * @return {ModulesHttp}
     */
    get(url, callback) {
        /**
         *
         * @type {{request: {}, response: {send: (function(*): Promise<*>)}} & (function({request: Object}, {send: Function}))}
         */
        this.#callback = _.extend({
            request: {},
            response: {
                send: async (data) => {

                }
            }
        }, callback);

    }


    /**
     * @param {String} ipAddress
     * @param {Number} port
     */
    listen(ipAddress, port) {

    }
}

export default DKA;