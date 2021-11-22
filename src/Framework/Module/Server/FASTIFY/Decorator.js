import ioClient from "socket.io-client";


const decorator = async (app, config) => {

    /*try {
        const {NFC} = require("nfc-pcsc");
        const nfc = await new NFC(false);
        await app.decorate('nfc', async (callback) => {
            nfc.on('reader', async (reader) => {
                await callback({state : "device_connected", code : 200, msg : "Card Reader Detected", device_name : reader.reader.name });
                await reader.on('card', async (card) => {
                    await callback({ state : "card_detected", code : 200, msg : "Card Detected", data : card});
                });
                await reader.on('card.off', async (card) => {
                    await callback({ state : "card_removed", code : 200, msg : "Card Detected", data : card});
                });

                await reader.on('error', async () => {
                    await callback({state : "error", code : 500, msg : "an error occurred", device_name : reader.reader.name });
                })
                await reader.on('end', async () => {
                    await callback({state : "device_disconnected", code : 200, msg : "Card Reader Removed", device_name : reader.reader.name });
                })
            });

            nfc.on('error', async (error) => {
                await callback({ state : "error", code : 500, msg : "Error Detected", error : error })
            });
        });
    }catch (e){}*/
    //#################################################################################################
    await app.decorate('ioclient', ioClient);

    return app
};

export default decorator;