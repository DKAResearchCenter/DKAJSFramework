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
mEscpos.serial = mEscposSerial;
let configEscposGlobally;


class Escpos {

    constructor(config) {
        this.config = _.merge(DKA.config.Hardware.Printer.Escpos, config );

        return new Promise(async (resolve, rejected) => {
            switch (this.config.type){
                case Options.ESCPOS_TYPE_USB :
                    /** Parsing The USB Function For The Data Type Communication **/
                    /** End Parsing The USB Function For The Data Type Communication **/
                    //##################################################################
                    /** Find The Printer Function */
                    try {
                        if (mEscpos.USB.findPrinter().length > 0){
                            this.device = (this.config.settings.usb.vendorId !== undefined && this.config.settings.usb.productId !== undefined)
                                ? await new mEscpos.USB(this.config.settings.usb.vendorId, this.config.settings.usb.productId)
                                : await new mEscpos.USB();
                            this.printer = await new mEscpos.Printer(this.device, this.config.options);
                            this.device.open(async (error) => {
                                if (!error){
                                    if (this.config.copyright.enabled){
                                        this.printer
                                            .align('ct')
                                            .style('b')
                                            .text(this.config.copyright.banner)
                                            .style('')
                                            .text(this.config.copyright.description)
                                            .feed(3)
                                            .align('lt')
                                    }
                                    await resolve(this.printer);
                                }else{
                                    await rejected({ status : false, code : 505, msg : `Failed To Open Printer`, error : error });
                                }
                            });
                        }else{
                            await rejected({ status : false, code : 404, msg : `Error, Printer Device Not Detected` });
                        }
                    }catch (error) {
                        await rejected({ status : false, code : 500, msg : `Fatal Error Unknown`, error : error });
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
                            this.printer.getStatuses(async () => {

                            })
                            await resolve(this.printer);
                        }else{
                            await rejected({ status : false, code : 505, msg : `Failed To Open Printer`, error : error });
                        }
                    });
                    break;
                case Options.ESCPOS_TYPE_BLUETOOTH :



                    break;
                default :
                    /** Parsing The USB Function For The Data Type Communication **/
                    /** End Parsing The USB Function For The Data Type Communication **/
                    //##################################################################
                    /** Find The Printer Function */
                    try {
                        if (mEscpos.USB.findPrinter().length > 0){
                            this.device = (this.config.settings.usb.vendorId !== undefined && this.config.settings.usb.productId !== undefined)
                                ? await new mEscpos.USB(this.config.settings.usb.vendorId, this.config.settings.usb.productId)
                                : await new mEscpos.USB();
                            this.printer = await new mEscpos.Printer(this.device, this.config.options);
                            this.device.open(async (error) => {
                                if (!error){
                                    await resolve(this.printer, this.device);
                                }else{
                                    await rejected({ status : false, code : 505, msg : `Failed To Open Printer`, error : error });
                                }
                            });
                        }else{
                            await rejected({ status : false, code : 404, msg : `Error, Printer Device Not Detected` });
                        }
                    }catch (e) {
                        await rejected({ status : false, code : 500, msg : `Fatal Error Unknown`, error : e });
                    }
                /** End Find The Printer Function */
                //##################################################################
            }
        })
    }
}




export default Escpos;