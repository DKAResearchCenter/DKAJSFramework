import packages from "../../../../../../package.json";
import pidusage from "pidusage";
import {Database} from "../../../../../Framework/Module/system/index.module.d";

const GlobHooks = async (app) => {
    /*await app.addHook('preHandler', (request, reply, done) => {
        console.log(request.hostname)
        done();
    });*/
    await app.addHook('onSend', async (request, reply, payload, done) => {
        const usage = await pidusage(process.pid)

        const mHeader = {
            FrameworkName : packages.name,
            FrameworkVersion : packages.version,
            FrameworkAuthor : packages.author
        };

        await reply.headers(mHeader);

        done();
    });

    await app.decorateReply('layout', async (html) => {
        await this
            .type('text/html')
            .header('Content-Type', 'text/html; charset=utf-8')
            .send(`${html}`);
    });



    return app;
};

export default GlobHooks;