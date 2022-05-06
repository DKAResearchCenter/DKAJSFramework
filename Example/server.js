import { Database, Server } from "./../";

const server = new Promise(async (resolve, rejected) => {
    await Server({
        serverPort : 1999,
        app : async(app, opts, next) => {

            next();
        },
        settings : {
            ngrok : {
                enabled : false,
                authToken : 'g3UD9sgpzrW41i6YGVWH_3w7oA58kHxKDgSNpmncba'
            }
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