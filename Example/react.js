import path from "path";
import { Database, Server, Options } from "./../";

const server = new Promise(async (resolve, rejected) => {
    await Server({
        serverEngine : Options.REACTJS_CORE_ENGINE,
        serverPort : 1999,
        app : {
            entry : path.join(__dirname, "./react.app.js")
        }
    }).then(async (result) => {
        //console.info(result)
        await resolve(result);
    }).catch(async (error) => {
        //console.error(error)
        await rejected(error);
    })
});

export default server;