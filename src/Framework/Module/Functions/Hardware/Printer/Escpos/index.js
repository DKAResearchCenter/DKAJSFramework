'use strict';
'use warning';
import Options from "./../../../../Options";
import mEscpos from "escpos";
import mEscposUsb from "escpos-usb";
import mEscposNetwork from "escpos-network";
import mEscposSerial from "escpos-serialport";
import _ from "lodash";

class Escpos {
    config = null;
    device = null;


    static get ESCPOS_TYPE_USB(){
        return Options.ESCPOS_TYPE_USB;
    }

    static get ESCPOS_TYPE_NETWORK(){
        return Options.ESCPOS_TYPE_NETWORK;
    }

    static get ESCPOS_TYPE_SERIAL(){
        return Options.ESCPOS_TYPE_SERIAL;
    }

    /**
     *
     * @param {{}} config
     * @param {Number} config.type
     * @param {{}} config.settings
     * @param {String} config.settings.vendorId
     * @param {String} config.settings.productId
     * @param {type[]} config.settings.network.ipAddress
     * @param {type[]} config.settings.network.port
     * @param {type[]} config.settings.serial.port
     * @param {{}} config.settings.serial.settings
     * @param {Number} config.settings.serial.settings.baudRate
     * @param {Number} config.settings.serial.settings.stopBit
     * @return Promise
     */
    constructor(config) {
        this.config = _.extend({
            type : Options.ESCPOS_TYPE_USB,
            settings : {
                vendorId : undefined,
                productId : undefined,
                network : {
                    ipAddress : "localhost",
                    port : 9100
                },
                serial : {
                    port : "COM2",
                    settings : undefined
                }
            },
            options : {
                encoding: "GB18030"
            }
        }, config);

        return new Promise(async(resolve, rejected) => {
            switch (this.config.type){
                case Options.ESCPOS_TYPE_USB :
                    /** Parsing The USB Function For The Data Type Communication **/
                    mEscpos.USB = mEscposUsb;
                    /** End Parsing The USB Function For The Data Type Communication **/
                    //##################################################################
                    const USB = (this.config.settings.vendorId !== undefined && this.config.settings.productId !== undefined) ? mEscpos.USB() : mEscpos.USB(this.config.settings.vendorId, this.config.settings.productId)
                    /** Find The Printer Function */
                    if (USB.findPrinter().length > 0){
                        this.device = (this.config.settings.vendorId !== undefined && this.config.settings.productId !== undefined) ?
                        await new mEscpos.USB(this.config.settings.vendorId, this.config.settings.productId) :
                        await new mEscpos.USB();
                        await resolve(this.device);
                    }else{
                        await rejected({ status : false, code : 404, msg : "Not Find The Printer"})
                    }
                    /** End Find The Printer Function */
                    //##################################################################
                    break;
                case Options.ESCPOS_TYPE_NETWORK :
                    /** Parsing The Network Function For The Data Type Communication **/
                    mEscpos.network = mEscposNetwork;
                    /** End Parsing The Network Function For The Data Type Communication **/
                    //#########################################################################################
                    this.device = await new mEscpos.network(this.config.settings.network.ipAddress, this.config.settings.network.port);
                    await resolve(this.device);
                    break;
                case Options.ESCPOS_TYPE_SERIAL :
                    /** Start Parsing The Serial Function For The Data Type Communication **/
                    mEscpos.serial = mEscposSerial
                    /** End Start Parsing The Serial Function For The Data Type Communication **/
                    this.device = (this.config.settings.serial.settings !== undefined) ? await new mEscpos.serial(this.config.settings.serial.port, this.config.settings.serial.settings) : await new mEscpos.serial(this.config.settings.serial.port);
                    await resolve(this.device);
                    break;
                default :
            }
        })
    }

}


export default Escpos;