import packages from "../../../../../package.json";



const errorHandler = async (app, config) => {

    const path = require("path");
    const fs = require("fs");
    const io = app.io;

    await app.setNotFoundHandler(async (request, response) => {
        const mHeader = {
            FrameworkName: packages.name,
            FrameworkVersion: packages.version,
            FrameworkAuthor: packages.author
        };
        await Object.keys(mHeader).forEach(function (keys) {
            response.header(keys, mHeader[keys]);
        });
        await Object.keys(mHeader).forEach(function (keys) {
            request.headers[keys] = mHeader[keys];
        });

        const html = await fs.readFileSync(path.join(__dirname, "./notFound.html"), {encoding: 'utf8', flag: 'r'});
        switch (request.method){
            case "GET" :
                await response
                    .code(404)
                    .type('text/html')
                    .send(html);
                break;
            default :
                await response
                    .code(404)
                    .send({ status : false, code : 404, msg : "Page Not Found"});
        }
    });
    return app;
}

export default errorHandler;