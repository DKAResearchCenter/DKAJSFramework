import packages from "../../../../../package.json";
import hookHandler from "./hookHandler";
import errorHandler from "./errorHandler";


const globHandler = async (app, config) => {

    const path = require("path");

    await app.register(require("fastify-static"), {
        root : path.join(__dirname, "./Assets"),
        prefix: '/dkaframork/assets/',
        decorateReply: false
    });
    let errorHook = await errorHandler(app, config);
    return await hookHandler(errorHook, config);

}

export default globHandler;
