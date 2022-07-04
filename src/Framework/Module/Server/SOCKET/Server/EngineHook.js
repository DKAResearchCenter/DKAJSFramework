import fs from "fs";
import path from "path";

/**
 *
 * @param { Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> } io
 * @param config
 * @return {Promise<void>}
 * @constructor
 */
const EngineHook = async (io, config) => {

    let uuid = require("uuid");
    io.engine.generateId = function (req) {
        return `DKA_${uuid.v4()}`;
    }

    await io.engine.on("initial_headers", (headers, req) => {
        if (fs.existsSync(path.join(__dirname, "./../../../../../package.json"))){
            const packages = require(path.join(__dirname, "./../../../../../package.json"));
            headers["FrameworkName"] = packages.name;
            headers["FrameworkVersion"] = packages.version;
            headers["FrameworkAuthor"] = packages.author;
        }
    });
    await io.engine.on("headers", (headers, req) => {
        if (fs.existsSync(path.join(__dirname, "./../../../../../package.json"))){
            const packages = require(path.join(__dirname, "./../../../../../package.json"));
            headers["FrameworkName"] = packages.name;
            headers["FrameworkVersion"] = packages.version;
            headers["FrameworkAuthor"] = packages.author;
        }
    });

    await io.engine.on("connection_error", (err) => {

    });
};
export default EngineHook