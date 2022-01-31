'use strict';
'use warning';
import DKA, {Options} from "./../../../index.module.d";
import mEscpos from "escpos";
import mEscposUsb from "escpos-usb";
import mEscposNetwork from "escpos-network";
import mEscposSerial from "escpos-serialport";
import _ from "lodash";

mEscpos.USB = mEscposUsb;
mEscpos.network = mEscposNetwork;
mEscpos.serial = mEscposSerial

class Escpos {
    config = null;
    device = null;
    printer = null;


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
     * @param {String} config.settings.usb.vendorId
     * @param {String} config.settings.usb.productId
     * @param {type[]} config.settings.network.ipAddress
     * @param {type[]} config.settings.network.port
     * @param {type[]} config.settings.serial.port
     * @param {{}} config.settings.serial.settings
     * @param {Number} config.settings.serial.settings.baudRate
     * @param {Number} config.settings.serial.settings.stopBit
     * @return Promise<printer>
     */
    constructor(config) {
        this.config = _.merge(DKA.config.Hardware.Printer.Escpos, config );
        return new Promise(async (resolve, rejected) => {
            switch (this.config.type){
                case Options.ESCPOS_TYPE_USB :
                    /** Parsing The USB Function For The Data Type Communication **/
                    /** End Parsing The USB Function For The Data Type Communication **/
                    //##################################################################
                    /** Find The Printer Function */
                    if (mEscpos.USB.findPrinter().length > 0){
                        try {
                            this.device = (this.config.settings.usb.vendorId !== undefined && this.config.settings.usb.productId !== undefined)
                                ? await new mEscpos.USB(this.config.settings.usb.vendorId, this.config.settings.usb.productId)
                                : await new mEscpos.USB();
                            this.printer = await new mEscpos.Printer(this.device, this.config.options);
                            this.device.open(async (error) => {
                                if (!error){
                                    await resolve(this.printer);
                                }else{
                                    await rejected({ status : false, code : 505, msg : `Failed To Open Printer`, error : error });
                                }
                            });
                        }catch (e) {
                            await rejected({ status : false, code : 404, msg : `Error, Cannot Find Printer`, error : e });
                        }
                    }else{
                        await rejected({ status : false, code : 404, msg : `Error, Printer Device Not Detected` });
                    }


                    /** End Find The Printer Function */
                    //##################################################################
                    break;
                case Options.ESCPOS_TYPE_NETWORK :
                    /** Parsing The Network Function For The Data Type Communication **/
                    /** End Parsing The Network Function For The Data Type Communication **/
                    //#########################################################################################
                    this.device = new mEscpos.network(this.config.settings.network.ipAddress, this.config.settings.network.port);
                    this.printer = new mEscpos.Printer(this.device, this.config.options);

                    break;
                case Options.ESCPOS_TYPE_SERIAL :
                    /** Start Parsing The Serial Function For The Data Type Communication **/
                    /** End Start Parsing The Serial Function For The Data Type Communication **/
                    this.device = (this.config.settings.serial.settings !== undefined)
                        ? new mEscpos.serial(this.config.settings.serial.port, this.config.settings.serial.settings)
                        : new mEscpos.serial(this.config.settings.serial.port);

                    this.printer = new mEscpos.Printer(this.device, this.config.options);
                    this.device.open(async (error) => {
                        if (!error){
                            await resolve(this.printer);
                        }else{
                            await rejected({ status : false, code : 505, msg : `Failed To Open Printer`, error : error });
                        }
                    });
                    break;
                default :
                    /** Parsing The USB Function For The Data Type Communication **/
                    /** End Parsing The USB Function For The Data Type Communication **/
                    //##################################################################
                    /** Find The Printer Function */
                    if (mEscpos.USB.findPrinter().length > 0){
                        try {
                            this.device = (this.config.settings.usb.vendorId !== undefined && this.config.settings.usb.productId !== undefined)
                                ? await new mEscpos.USB(this.config.settings.usb.vendorId, this.config.settings.usb.productId)
                                : await new mEscpos.USB();
                            this.printer = await new mEscpos.Printer(this.device, this.config.options);
                            this.device.open(async (error) => {
                                if (!error){
                                    await resolve(this.printer);
                                }else{
                                    await rejected({ status : false, code : 505, msg : `Failed To Open Printer`, error : error });
                                }
                            });
                        }catch (e) {
                            await rejected({ status : false, code : 404, msg : `Error, Cannot Find Printer`, error : e });
                        }
                    }else{
                        await rejected({ status : false, code : 404, msg : `Error, Printer Device Not Detected` });
                    }


                /** End Find The Printer Function */
                //##################################################################
            }
        })

    }

    print = async (printerOptions = {}) =>
        new Promise(async (resolve, rejected) => {
            this.device.open(async (error) => {
                (!error) ? resolve(this.printer) : rejected({ status : false, code : 501, msg : "Cannot Open The Printer", error : error})
            });
        });

}


export default Escpos;