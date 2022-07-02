import _ from "lodash";

function checkModuleExist(name){
    try {
        require.resolve(name);
        return true;
    }catch (e) {
        return false;
    }
}

let Reader = null;

class Nfc {

    mNFC = null;
    eventEmit = null;

    static get KEY_TYPE_A(){
        //**********************************************************************
        return checkModuleExist("nfc-pcsc") ? require("nfc-pcsc").KEY_TYPE_A : null;
        //**********************************************************************

    }
    static get KEY_TYPE_B(){
        //**********************************************************************
        return checkModuleExist("nfc-pcsc") ? require("nfc-pcsc").KEY_TYPE_B : null;
        //**********************************************************************
    }
    /**
     *
     * @returns {Nfc}
     */
    constructor() {
        import("events")
            .then(async ({ EventEmitter }) => {
                this.mEventEmitter = new EventEmitter();
                if (checkModuleExist("nfc-pcsc")){
                    if (this.mNFC === null){
                        try {
                            import("nfc-pcsc")
                                .then(async ({ NFC, KEY_TYPE_A, KEY_TYPE_B, TAG_ISO_14443_4 }) => {
                                    this.mNFC = new NFC();
                                    this.mNFC.on('reader', async (reader) => {
                                        reader.aid = "";
                                        this.mEventEmitter.emit("reader", reader);
                                        await reader.on('card', async (card) => {
                                            this.mEventEmitter.emit("card", { reader : reader, card : card});
                                        })
                                        reader.on('card.off', async (card) => {
                                            this.mEventEmitter.emit("card.off", card);
                                        });
                                        await reader.on('error', async (error) => {
                                            this.mEventEmitter.emit("card.error", { status : false, code : 502, msg : `Reader Error`, error : error});
                                        });

                                        await reader.on('end', async () => {
                                            this.mEventEmitter.emit('card.end');
                                        });
                                    });
                                    this.mNFC.on('error', async (err) => {
                                        let error = { status : false, code : 500, msg : `Reader Error`, error : err};
                                        this.mEventEmitter.emit("nfc.error", error);
                                    });
                                })

                        }catch (e) {
                            let error = { status : false, code : 505, msg : `Unknown Error`, error : e }
                            this.mEventEmitter.emit("nfc.fatal", error )
                        }
                    }
                }
            })
            .catch(async (error) => {

            })

        return this;
    }

    /**
     *
     * @param { "FATAL_ERROR" | "NFC_ERROR" | "READER_ERROR" | "READER_END" | "READER" | "CARD_DETECTED" | "CARD_OFF"  } event
     * @param callback
     * @returns {Promise<Nfc>}
     */
    Trigger = async (event, callback) => {
        switch (event) {
            case "READER":
                await this.mEventEmitter.on("reader", callback);
                break;
            case "READER_ERROR" :
                await this.mEventEmitter.on("card.error", callback);
                break;
            case "CARD_DETECTED":
                await this.mEventEmitter.on("card", callback);
                break;
            case "CARD_OFF" :
                await this.mEventEmitter.on("card.off", callback);
                break;
            case "NFC_ERROR":
                await this.mEventEmitter.on("nfc.error", callback);
                break;
            case "FATAL_ERROR" :
                await this.mEventEmitter.on("nfc.fatal", callback);
                break;
        }
        return this;
    }


    LoadAuthentificationKey = async (keyNumber, key, response) => {
        await this.mEventEmitter.on("card", async (result) => {
            let reader = result.reader;
            await reader.loadAuthenticationKey(keyNumber, key)
                .then(async (res) => {
                    await response({ status : true, code : 200, msg : `Successfully Load Authentification Key `});
                })
                .catch(async (error) => {
                    await response({ status : false, code : 500, msg : `Failed Load Authentification Key `, error : error});
                })
        });
    }

    Authentificate = async (arraySectorCluster = [], response) => {

        await this.mEventEmitter.on("card", async (result) => {
            let reader = result.reader;

            let mArrayPass = [];
            let num = 0;
            await arraySectorCluster.forEach(function () {
                try {
                    reader.authenticate(arraySectorCluster[num].blockNumber, arraySectorCluster[num].keyType, arraySectorCluster[num].key)
                    mArrayPass.push({ status : true, blockNumber : arraySectorCluster[num].blockNumber });
                }catch (e) {
                    mArrayPass.push({ status : false, blockNumber : arraySectorCluster[num].blockNumber });
                }
                num++;
            });
            response(mArrayPass)
        });
        return this;

    }

    Read = async (blockNumber = 4, length = 16, blockSize = 16, response) => {
        await this.mEventEmitter.on("card", async (result) => {
            let reader = result.reader;
            try {
                let mRead = await reader.read(blockNumber, length, blockSize);
                await response({ status : true, code : 200, msg : `Successfully Read Data`, data : mRead});
            }catch (e) {
                await response({ status : false, code : 500, msg : `Failrd Write Data`, data : e.toString().split(':')[3]});
            }

        });
        return this;
    }
    /*Read = async (config, response) => {
        let readConfig = await _.merge({
            blockNumber : 4,
            length : 16,
            blockSize: 16
        }, config);

        await this.mEventEmitter.on("card", async (result) => {
            let reader = result.reader;
            const dataRead = await reader.read(readConfig.blockNumber, readConfig.length, readConfig.blockSize);
            await response({ status : true, code : 200, msg : `Successfully Read Data`, data : dataRead });
        });
        return this;
    }*/
    Baca = this.Read;

    Write = async (config, response) => {
        let WriteConfig;
        WriteConfig = await _.merge({
            blockNumber : 4,
            data : "",
            dataLength: 16,
            blockSize: 16,
            authentification : {
                typeKey : KEY_TYPE_A,
                key : "FFFFFFFFFFFF"
            }
        }, config);
        this.mEventEmitter.on("card", async (result) => {
            let reader = result.reader;
            try {
                await reader.authenticate(
                    WriteConfig.blockNumber,
                    WriteConfig.authentification.typeKey,
                    WriteConfig.authentification.key
                )
                let mBuffer = await Buffer.allocUnsafe(WriteConfig.dataLength);
                await mBuffer.fill(`${WriteConfig.data}@`)
                await reader.write(WriteConfig.blockNumber, mBuffer, WriteConfig.blockSize);
                await response({ status : true, code : 200, msg : `Successfully Write Data`, data : mBuffer.toString()});
            }catch (e) {
                await response({ status : false, code : 500, msg : `AUTHENTIFICATION : error`, error : e })
            }

        })

        return this;
    }
    Tulis = this.Write;

    Reset = async (config, response) => {
        let WriteConfig;
        WriteConfig = await _.merge({
            blockNumber : 4,
            blockSize: 16,
            authentification : {
                typeKey : KEY_TYPE_A,
                key : "FFFFFFFFFFFF"
            }
        }, config);
        this.mEventEmitter.on("card", async (result) => {
            let reader = result.reader;
            try {
                await reader.authenticate(
                    WriteConfig.blockNumber,
                    WriteConfig.authentification.typeKey,
                    WriteConfig.authentification.key
                )
                let mBuffer = await Buffer.allocUnsafe(WriteConfig.blockSize);
                await mBuffer.fill(0)
                await reader.write(WriteConfig.blockNumber, mBuffer, WriteConfig.blockSize);
                await response({ status : true, code : 200, msg : `Successfully Reset Data`, data : mBuffer.toString()});
                //const dataRead = await reader.read(readConfig.blockNumber, readConfig.length, readConfig.blockSize);

            }catch (e) {
                await response({ status : false, code : 505, msg : `AUTHENTIFICATION : error`, error : e })
            }
        })

        return this;
    }
    Format = this.Reset;

}


export default Nfc;