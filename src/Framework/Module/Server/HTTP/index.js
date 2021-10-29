/**
 * @memberOf Server
 * @toc Server.EXPRESS
 *
 * @param config
 * @returns {Promise<unknown>}
 */
export default (config) => new Promise((resolve, reject) => {

    const http = require("http");
    const Module = require("Modules");


    new Module().post('test', async (request, response) => {

    }).post()

    const server = http.createServer((request, response) => {

    })
    resolve();
});