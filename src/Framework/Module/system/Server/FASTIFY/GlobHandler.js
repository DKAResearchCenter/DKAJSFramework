import packages from "../../../../../../package.json";


const globHandler = async (app, opts, next) => {

    const path = require("path");
    const fs = require("fs");
    const io = app.io;

    /** Callback The Not Found Page **/
    await app.setNotFoundHandler((request, response) => {
        const html = fs.readFileSync(path.join(__dirname, "./notFound.html"), {encoding:'utf8', flag:'r'})
        response
            .type('text/html')
            .send(html)
    });

    await app.setErrorHandler(async (error, request, response) => {
        console.error(error);
    })

    await io.of("/dka")
        .on('connection', async (io) => {
        console.info(`dkaframework :: client is Connected ${io.id}`);
    });

    next();
}

export default globHandler;