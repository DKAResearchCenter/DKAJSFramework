import packages from "../../../../../../package.json";
import pidusage from "pidusage";
import {Database} from "../../../../../Framework/Module/system/index.module.d";

const GlobHooks = async (app, config) => {


    app.addHook('onRequest', async (request, reply) => {
        const mHeader = {
            FrameworkName : packages.name,
            FrameworkVersion : packages.version,
            FrameworkAuthor : packages.author
        };

        await Object.keys(mHeader).forEach(function (keys) {
            reply.header(keys, mHeader[keys]);
        });
        await Object.keys(mHeader).forEach(function (keys) {
            request.headers[keys] = mHeader[keys];
        });



    });

    app.decorateReply('layout', async (html) => {
        await this
            .type('text/html')
            .header('Content-Type', 'text/html; charset=utf-8')
            .send(`${html}`);
    });



    return app;
};

export default GlobHooks;