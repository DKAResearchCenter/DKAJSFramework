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

    });
    await app.addHook('preParsing', async (request, response) => {

    });
    await app.addHook('preValidation', async (request, response) => {

    });
    await app.addHook('preHandler', async (request, response) => {

    });
    await app.addHook('preSerialization', async (request, response) => {

    });
    await app.addHook('onError', async (request, response) => {

    });
    await app.addHook('onSend', async (request, response) => {

    });
    await app.addHook('onResponse', async (request, response) => {

    });
    await app.addHook('onTimeout', async (request, response) => {

    });

    return app;
}
export default hookHandler;