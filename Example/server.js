import { Database, Server } from "./../";

const server = new Promise(async (resolve, rejected) => {
    await Server({
        serverPort : 1999,
        app : async(app, opts, next) => {

            next();
        },
        settings : {
            ngrok : {
                enabled : true,
                authToken : 'g3UD9sgpzrW41i6YGVWH_3w7oA58kHxKDgSNpmncba'
            },
            firewall : [
                {
                    method : 'GET',
                    action : 'DENY',
                    ip_address : "::1"
                }
            ]
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