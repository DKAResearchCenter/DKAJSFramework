import { Database, Server } from "./../";

const server = new Promise(async (resolve, rejected) => {
    await Server({
        serverPort : 1999,
        app : async (app, opts, next) => {

            app.get("/", function (request, response) {
                    new Database.MariaDB({
                        host : '127.0.0.1',
                        user : 'developer',
                        password : 'Cyberhack2010',
                        database : 'tes'
                    }).Read(`tes`)
                        .then(async (resolve) => {
                            response.send(resolve);
                        })
                        .catch(async (resolve) => {
                            response.send(resolve);
                        })
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