/**
 * @memberOf Server
 * @toc Server.EXPRESS
 *
 * @param config
 * @returns {Promise<unknown>}
 */
export default (config) => new Promise((resolve, reject) => {

    const http = require("http");

    const server = http.createServer((request, response) => {

    });

    resolve();
});