import packages from "../../../../../../package.json";

const GlobHooks = async (app) => {
    /*await app.addHook('preHandler', (request, reply, done) => {
        console.log(request.hostname)
        done();
    });*/
    await app.addHook('onSend', (request, reply, payload, done) => {
        reply.headers({
            FrameworkName : packages.name,
            FrameworkVersion : packages.version,
            FrameworkAuthor : packages.author
        })
        done();
    });
    return app;
};

export default GlobHooks;