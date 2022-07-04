/**
 *
 * @param {Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>} io
 * @param config
 * @return {Promise<void>}
 * @constructor
 */
const HookHandler = async (io,config) => {
    /**
     *
     */
    await io.use(async (socket, next) => {

        next();
    });
};

export default HookHandler;