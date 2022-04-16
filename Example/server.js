import { Database, Server } from "./../";

const server = new Promise(async (resolve, rejected) => {
    await Server({
        serverPort : 1999,
        app : async (app, opts, next) => {

            app.get("/coba", function (request, response) {

            });

            next()
        }
    }).then(async (result) => {
        //console.info(result)
        await resolve(result);
    }).catch(async (error) => {
        //console.error(error)
        await rejected(error);
    })
})

export default server;