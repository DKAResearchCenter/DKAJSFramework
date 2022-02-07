import { Database, Server } from "./../";

const server = async () => {
    await Server({
        serverPort : 1999,
        app : false
    }).then(async (result) => {
        console.info(result)
    }).catch(async (error) => {
        console.error(error)
    })
};

export default server;