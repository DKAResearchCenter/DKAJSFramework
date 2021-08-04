import packages from "../../../../../../package.json";


const globHandler = async (app, opts, next) => {

    const path = require("path");
    const fs = require("fs");

    /** Callback The Not Found Page **/
    await app.setNotFoundHandler((request, response) => {
        const html = fs.readFileSync(path.join(__dirname, "./notFound.html"), {encoding:'utf8', flag:'r'})
        response
            .type('text/html')
            .send(html)
    })

    next();
}

export default globHandler;