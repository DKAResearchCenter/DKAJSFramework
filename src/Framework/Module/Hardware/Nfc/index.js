import _ from "lodash";
import Options from "./../../Options";
import Security from "../../Security";
import {NFC} from "nfc-pcsc";

function checkModuleExist(name){
    try {
        require.resolve(name);
        return true;
    }catch (e) {
        return false;
    }
}

let Reader = null;
let mNFC = null;
class Nfc {

    mNFC = null;
    mUSBDetection = null;
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
    constructor(config) {

        this.config = _.merge({
            state : Options.SERVER_STATE_DEVELOPMENT,
            findBy : {
              hardwareIds : false,
              hardwareName : "ACR122"
            },
            cardType : Options.MIFARE_CLASSIC_1K,
            authenticate : {
                typeKey : Nfc.KEY_TYPE_A,
                key : "FFFFFFFFFFFF"
            },
            options : {
                autoProcessing : true,
                encryption : {
                    enabled : false
                }
            }
        }, config);

        let EventEmitter = require("node:events");
        this.mEventEmitter = new EventEmitter();

        if (checkModuleExist("usb-detection")){

            let mUSBDetect = this.mUSBDetection = require("usb-detection");

            mUSBDetect.on("remove", async (device) => {
                try {
                    await this.mEventEmitter.removeAllListeners("nfc.error");
                    await mNFC.close();
                    await this.mEventEmitter.removeAllListeners();
                } catch(e) {}
                //##############################################################
                (this.config.state === Options.SERVER_STATE_DEVELOPMENT)
                    ? console.log(`Detecting NFC Devices Unplugged USB remove `, `clear Instance`) : null;
                //###############################################################
            });

            mUSBDetect.on('add', async (device) => {
                //##############################################################
                (this.config.state === Options.SERVER_STATE_DEVELOPMENT)
                ? console.log(`Detecting NFC Devices Plugged USB Add `, `Reinitialization Instance`) : null;
                //###############################################################
                await this.Initilization();
            });

            if (this.config.findBy.hardwareIds){
                mUSBDetect.find(this.config.findBy.hardwareIds.vendorId, this.config.findBy.hardwareIds.productId, async (error, device) => {
                    if(!error){
                        if(device.length > 0){
                            //##############################################################
                            (this.config.state === Options.SERVER_STATE_DEVELOPMENT)
                                ? console.log(`FIND NFC Devices Plugged `, `${JSON.stringify(device)}`) : null;
                            //###############################################################
                            this.Initilization();
                        }else{
                            //##############################################################
                            (this.config.state === Options.SERVER_STATE_DEVELOPMENT)
                                ? console.log(`Start Monitoring NFC Devices `, `${JSON.stringify(device)}`) : null;
                            //###############################################################
                            await mUSBDetect.stopMonitoring();
                            await mUSBDetect.startMonitoring();
                        }
                    }else{
                        //##############################################################
                        (this.config.state === Options.SERVER_STATE_DEVELOPMENT)
                            ? console.log(`Start Monitoring NFC Devices `, `${JSON.stringify(device)}`) : null;
                        //###############################################################
                        await mUSBDetect.stopMonitoring();
                        await mUSBDetect.startMonitoring();
                    }
                });
            }else{
                mUSBDetect.find()
                    .then(async (device) => {
                        let findState = false
                        let mHardwareNames = this.config.findBy.hardwareName;
                        await device.forEach(function (object) {
                            if (object.deviceName.match(mHardwareNames)){
                                findState = device;
                            }
                        });
                        if (findState !== false){
                            //##############################################################
                            (this.config.state === Options.SERVER_STATE_DEVELOPMENT)
                                ? console.log(`FIND NFC Devices Plugged By Hardware Name`) : null;
                            //###############################################################
                            this.Initilization();
                        }else{
                            //##############################################################
                            (this.config.state === Options.SERVER_STATE_DEVELOPMENT)
                                ? console.log(`Start Monitoring NFC Devices By Hardware Name `) : null;
                            //###############################################################
                            await mUSBDetect.stopMonitoring();
                            await mUSBDetect.startMonitoring();
                        }
                    })
                    .catch(async (error) => {
                        console.error(error)
                    })
            }

        }else {
            throw Error("MODULE `usb-detection` not Installed. Please Installed First");
        }
        
        return this;
    }

    Initilization = () => {
        if (checkModuleExist("nfc-pcsc")){
            let { NFC } = require("nfc-pcsc");
            try {
                mNFC = new NFC();
                mNFC.on('reader', async (reader) => {
                    this.mEventEmitter.emit("reader", reader);
                    (this.config.state === Options.SERVER_STATE_DEVELOPMENT) ? console.log(`DKA NFC EVENT :: Reader ready ! :`,`${reader}`) : false;
                    reader.autoProcessing = this.config.options.autoProcessing;
                    await reader.on('card', async (card) => {
                        this.mEventEmitter.emit("card", { reader : reader, card : card});
                        (this.config.state === Options.SERVER_STATE_DEVELOPMENT) ? console.log(`DKA NFC EVENT :: Card Detected :`,`${card}`) : false;
                    })
                    reader.on('card.off', async (card) => {
                        this.mEventEmitter.emit("card.off", card);
                        (this.config.state === Options.SERVER_STATE_DEVELOPMENT) ? console.log(`DKA NFC EVENT :: Card Remove :`,`${card}`) : false;
                    });
                    await reader.on('error', async (error) => {
                        this.mEventEmitter.emit("card.error", { status : false, code : 502, msg : `Reader Error`, error : error});
                        (this.config.state === Options.SERVER_STATE_DEVELOPMENT) ? console.log(`DKA NFC EVENT :: Reader Error :`,`${error}`) : false;
                    });

                    await reader.on('end', async () => {
                        this.mEventEmitter.emit('card.end');
                        (this.config.state === Options.SERVER_STATE_DEVELOPMENT) ? console.log(`DKA NFC EVENT :: Card End`) : false;
                    });
                });
                mNFC.on('error', async (err) => {
                    let nFCErrorExtractStatus = {
                        code : err.toString().split(":")[1].toString(),
                        description : err.toString().split(":")[2].toString(),
                    }
                    let error = { status : false, code : 500, msg : `NFC Error`, error : nFCErrorExtractStatus};
                    this.mEventEmitter.emit("nfc.error", error);
                    (this.config.state === Options.SERVER_STATE_DEVELOPMENT) ? console.log(`nfc error : `,`${nFCErrorExtractStatus}`) : false;
                });
            } catch (e) {
                let error = { status : false, code : 505, msg : `Unknown Error`, error : e }
                this.mEventEmitter.emit("nfc.fatal", error )
            }
        }else{
            throw Error("MODULE `nfc-pcsc` not Installed. Please Installed First");
        }
    }

    /**
     * @param { "UNKNOWN_ERROR" | "FATAL_ERROR" | "NFC_ERROR" | "READER_ERROR" | "READER_END" | "READER" | "CARD_DETECTED" | "CARD_OFF"  } event
     * @param {Function} callback
     * @returns {Promise<Nfc>}
     */
    Trigger = async (callback) => {
        await this.mEventEmitter.on("reader", async (reader) => {
            await callback({ event : "READER", response : reader});
        });
        await this.mEventEmitter.on("card.error", async (reader) => {
            await callback({ event : "READER_ERROR", response : reader});
        });
        await this.mEventEmitter.on("card", async (card) => {
            await callback({ event : "CARD_DETECTED", response : card});
        });
        await this.mEventEmitter.on("card.off", async (card) => {
            await callback({ event : "CARD_OFF", response : card});
        });
        await this.mEventEmitter.on("nfc.error", async (error) => {
            await callback({ event : "NFC_ERROR", response : error});
        });

        await this.mEventEmitter.on("nfc.fatal", async (error) => {
            await callback({ event : "FATAL_ERROR", response : error});
        });
        await this.mEventEmitter.on("nfc.unknown.error", async (error) => {
            await callback({ event : "UNKNOWN_ERROR", response : error});
        });
        return this;
    }

    /**
     * @param { number | undefined } keyNumber
     * @param { number } key
     * @param { function } response
     * @return {Promise<void>}
     * @constructor
     */
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
            await response(mArrayPass)
        });
        return this;

    }

    /**
     *
     * @param {Number | Object} blockNumber
     * @param { Number } blockNumber.blockNumber
     * @param { 16 | 32 | 48 } blockNumber.length
     * @param { 16 } blockNumber.blockSize
     * @param { Object } blockNumber.authenticate
     * @param { KEY_TYPE_A | KEY_TYPE_B } blockNumber.authenticate.keyType
     * @param { String } blockNumber.authenticate.key
     * @param response
     * @return {Promise<Nfc>}
     * @constructor
     */
    Read = async (blockNumber, response) => {

        this.configRead = {};

        switch (typeof blockNumber){
            case "number" :
                this.configRead = await _.merge({
                    blockNumber : blockNumber,
                    dataLength : 16,
                    blockSize : 16,
                    authenticate : {
                        keyType : this.config.authenticate.typeKey,
                        key : this.config.authenticate.key
                    }
                });
                break;
            case "object" :
                this.configRead = await _.merge({
                    blockNumber : 4,
                    dataLength : 16,
                    blockSize : 16,
                    authenticate : {
                        keyType : this.config.authenticate.typeKey,
                        key : this.config.authenticate.key
                    }
                }, blockNumber);
                break;
        }

        await this.mEventEmitter.on("card", async (result) => {
            let reader = result.reader;
            try {
                await reader.authenticate(this.configRead.blockNumber, this.configRead.authenticate.keyType, this.configRead.authenticate.key);
                let mRead = await reader.read(this.configRead.blockNumber, this.configRead.length, this.configRead.blockSize);

                if (this.config.options.encryption.enabled){
                    mRead = await new Security.Encryption.Crypto({
                        algorithm : Options.ALGORITHM_AES_128_GCM
                    })
                        .decodeIvSync(mRead);
                }

                let tempRawData = mRead.toString().split("@")[0];
                let arrayTypeData = tempRawData.split("#");

                let objectTempData = {};
                arrayTypeData.map(async (values) => {
                    let jsonData = values.split(":");
                    objectTempData[jsonData[0]] = jsonData[1]
                    // jsonData.map(async (mValues) => {
                    //     console.log(mValues)
                    //     objectTempData[mValues[0]] = mValues[1]
                    // })
                });

                let mResponseTemp = {
                    status : true,
                    code : 200,
                    msg : `Successfully Read Data`,
                    data : {
                        raw : mRead,
                        string : mRead.toString().split("@")[0],
                        length : mRead.toString().length,
                        refactorData : {
                            companyId : mRead.toString().split("@")[0].split("#")[0],
                            type_card : mRead.toString().split("@")[0].split("#")[1],
                            uid_identify : mRead.toString().split("@")[0].split("#")[2],
                        },
                        card : {
                            atr : result.card.atr,
                            standard : result.card.standard,
                            type : result.card.type,
                            uid : result.card.uid
                        }
                    }
                }
                mResponseTemp.data.refactorData = objectTempData;

                await response(mResponseTemp);
            }catch (e) {
                await response({ status : false, code : 500, msg : `Failed Read Data`, error : e});
            }

        });
        return this;
    }
    Baca = this.Read;

    /**
     *
     * @param {Number | Object} data
     * @param { Number } data.blockNumber
     * @param { Object | String } data.data
     * @param { 16 | 32 | 48 } data.dataLength
     * @param { 16 } data.blockSize
     * @param { Object } data.authenticate
     * @param { KEY_TYPE_A | KEY_TYPE_B } data.authenticate.keyType
     * @param { String } data.authenticate.key
     * @param response
     * @return {Promise<Nfc>}
     * @constructor
     */
    Write = async (data, response) => {
        this.configWrite = {};
        let mFinalDataToString = "";
        switch (typeof data){
            case "string" :
                this.configWrite = await _.merge({
                    blockNumber : 4,
                    data : data,
                    dataLength : 16,
                    blockSize : 16,
                    authenticate : {
                        keyType : this.config.authenticate.typeKey,
                        key : this.config.authenticate.key
                    }
                });

                break;
            case "object" :
                this.configWrite = await _.merge({
                    blockNumber : 4,
                    data : data.data,
                    dataLength : 16,
                    blockSize : 16,
                    authenticate : {
                        keyType : this.config.authenticate.typeKey,
                        key : this.config.authenticate.key
                    }
                }, data);

                switch (typeof this.configWrite.data) {
                    case "object" :
                        //console.log(this.configWrite.data)
                        /** Add Separator Split Character (#) for The push Data **/
                        Object.keys(this.configWrite.data).map(async (key,index,array) => {
                            if (index !== (array.length - 1)){
                                mFinalDataToString += `${key}:${this.configWrite.data[key]}#`
                            }else{
                                mFinalDataToString += `${key}:${this.configWrite.data[key]}`
                            }
                        })
                        this.configWrite.data = mFinalDataToString
                        break;
                    case "string" :
                        this.configWrite.data = data.data
                        break;
                }
                break;
        }

        await this.mEventEmitter.on("card", async (result) => {
            let reader = result.reader;
            try {
                await reader.authenticate(this.configWrite.blockNumber, this.configWrite.authenticate.keyType, this.configWrite.authenticate.key)
                let mBuffer = await Buffer.allocUnsafe(this.configWrite.dataLength);
                let mFillData = `${this.configWrite.data}@`;

                if (this.config.options.encryption.enabled){
                    mFillData = new Security.Encryption.Crypto({
                        algorithm : Options.ALGORITHM_AES_128_GCM
                    })
                        .encodeIvSync(mFillData)
                }

                await mBuffer.fill(mFillData)
                if (this.configWrite.data.length <= this.configWrite.dataLength){
                    switch (this.config.cardType) {
                        case Options.MIFARE_CLASSIC_1K :
                            if (this.configWrite.blockNumber === 4 || this.configWrite.blockNumber === 8){
                                await reader.write(this.configWrite.blockNumber, mBuffer, this.configWrite.blockSize);
                                await response({
                                    status : true,
                                    code : 200,
                                    msg : `Successfully Write Data`,
                                    data : {
                                        raw : mBuffer.toString()
                                    }
                                });
                            }else{
                                await response({
                                    status : false,
                                    code : 505,
                                    msg : `Failed Write Data. for Mifare 1 K blockNumber must 4 or 8 `
                                });
                            }
                    }

                }else{
                    await response({
                        status : false,
                        code : 505,
                        msg : `Failed Write Data. the data length must smaller than options 'dataLength' `
                    });
                }
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
            blockNumber : 4, blockSize: 16, authentification : {
                typeKey : this.KEY_TYPE_A,
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