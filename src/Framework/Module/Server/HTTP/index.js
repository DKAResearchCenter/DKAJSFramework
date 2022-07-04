import d from "node:v8";

/**
 * @memberOf Server
 * @toc Server.EXPRESS
 *
 * @param config
 * @returns {Promise<unknown>}
 */
export default async (config) => await new Promise(async (resolve, reject) => {

    /** Load Module HTTP in The Module Engine HTTP **/
    const http = require("http");
    /** Create Server HTTP Create Server Get The Request and Response Server Data **/
    const server = await http.createServer((request, response) => {

    });

    resolve();
});