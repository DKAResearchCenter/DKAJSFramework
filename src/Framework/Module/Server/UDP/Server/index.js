import dgram from "node:dgram";


const Server = async (config) => await new Promise(async (resolve, rejected) => {

    let server = dgram.createSocket("udp4");

    await server.on("error", async (error) => {
        console.log(`error : ${error}`)
        //await rejected({ status : false, code : 200, msg : `error udp connection`, error : error})
    });

    await server.on("message", (msg, remoteInfo) => {

    });

    await resolve(server);

});

export default Server;