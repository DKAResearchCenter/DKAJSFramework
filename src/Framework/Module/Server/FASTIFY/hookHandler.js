import packages from "../../../../../package.json";

const hookHandler = async (app, config) => {
    await app.addHook('onRequest', async (request, reply) => {
        const mHeader = {
            FrameworkName: packages.name,
            FrameworkVersion: packages.version,
            FrameworkAuthor: packages.author
        };
        await Object.keys(mHeader).forEach(function (keys) {
            reply.header(keys, mHeader[keys]);
        });
        await Object.keys(mHeader).forEach(function (keys) {
            request.headers[keys] = mHeader[keys];
        });
        console.log(`onRequest Execution`);
    });
    await app.addHook('preParsing', async (request, response) => {
        console.log(`preParsing Execution`);
    });
    await app.addHook('preValidation', async (request, response) => {
        console.log(`preValidation Execution`);
    });
    await app.addHook('preHandler', async (request, response) => {
        console.log(`preHandler Execution`);
    });
    await app.addHook('preSerialization', async (request, response) => {
        console.log(`preSerialization Execution`);
    });
    await app.addHook('onError', async (request, response) => {
        console.log(`onError Execution`);
    });
    await app.addHook('onSend', async (request, response) => {
        console.log(`onSend Execution`);
    });
    await app.addHook('onResponse', async (request, response) => {
        console.log(`onResponse Execution`);
    });
    await app.addHook('onTimeout', async (request, response) => {
        console.log(`onTimeout Execution`);
    });

    return app;
}
export default hookHandler;