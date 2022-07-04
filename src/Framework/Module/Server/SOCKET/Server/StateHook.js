import Options from "../../../Options";


/**
 *
 * @param {Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>} io
 * @param config
 * @return {Promise<void>}
 * @constructor
 */
const StateHook = async(io, config) => {
    let mSocketlist = await new Set();

    await io.on("connection", async (socket) => {
        await mSocketlist.add(socket);
        (config.serverState === Options.SERVER_STATE_DEVELOPMENT) && console.log(`DKA :: ADDING SOCKET TO LIST ${socket}`);
        await socket.on("disconnect", async () => {
            mSocketlist.delete(socket);
        });
    })
}

export default StateHook;