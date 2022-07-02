/**
 * @memberOf Server
 * @toc Server.EXPRESS
 *
 * @param config
 * @returns {Promise<unknown>}
 */
export default (config) => new Promise(async (resolve, reject) => {
    const AppEngine = await require("express")();
    await resolve(AppEngine);
}).then( async (AppEngine) => {
    return AppEngine
});