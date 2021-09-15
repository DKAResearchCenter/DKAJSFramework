import packages from "../../../../../../package.json";


const globHandler = function (app, config){

    const path = require("path");
    const fs = require("fs");
    const io = app.io;


    app.setErrorHandler(function (error, request, reply) {
        reply.send(error)
    });

    /** Callback The Not Found Page **/
    app.setNotFoundHandler( function (request, response){
        const html = fs.readFileSync(path.join(__dirname, "./notFound.html"), {encoding:'utf8', flag:'r'});
        response
            .type('text/html')
            .send(html)
    });

    app.addHook('onRequest', async (request, reply) => {
        const mHeader = {
            FrameworkName : packages.name,
            FrameworkVersion : packages.version,
            FrameworkAuthor : packages.author
        };

        Object.keys(mHeader).forEach(function (keys) {
            reply.header(keys, mHeader[keys]);
        });
        Object.keys(mHeader).forEach(function (keys) {
            request.headers[keys] = mHeader[keys];
        });



    });

    app.addHook('preHandler', async (request, reply) => {
        // some code
    })



    app.decorateReply('layout', function (html) {
        this
            .type('text/html')
            .header('Content-Type', 'text/html; charset=utf-8')
            .send(`${html}`);
    });




    io.of("/dka")
        .on('connection', async (io) => {
        console.info(`dkaframework :: client is Connected ${io.id}`);
    });

    return app
}

export default globHandler;
