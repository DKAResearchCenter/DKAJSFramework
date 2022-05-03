const errorHandler = async (app, config) => {

    const path = require("path");
    const fs = require("fs");

    /** Function If Not Found Handler Data **/
    await app.setNotFoundHandler(async (request, response) => {
        const html = fs.readFileSync(path.join(__dirname, "./notFound.html"), {encoding: 'utf8', flag: 'r'});
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