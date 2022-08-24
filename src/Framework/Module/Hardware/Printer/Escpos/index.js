'use strict';
'use warning';
import DKA, {Options} from "./../../../index.module.d";
import _ from "lodash";
let configEscposGlobally;

function checkModuleExist(name){
    try {
        require.resolve(name);
        return true;
    }catch (e) {
        return false;
    }
}

class Escpos {

    constructor(config) {
        this.config = _.merge(DKA.config.Hardware.Printer.Escpos, config );
        let mEscpos = require("escpos");
        return new Promise(async (resolve, rejected) => {
            switch (this.config.type){
                case Options.ESCPOS_TYPE_USB :
                    /** Parsing The USB Function For The Data Type Communication **/
                    /** End Parsing The USB Function For The Data Type Communication **/
                    //##################################################################
                    /** Find The Printer Function */
                    try {
                        mEscpos.USB = checkModuleExist("escpos-usb") ? require("escpos-usb") : console.error("MODULE `escpos-usb` not installed. please Installed First");
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
                    mEscpos.network = checkModuleExist("escpos-network") ? require("escpos-network") : console.error("MODULE `escpos-network` not installed. please Installed First");
                    this.device = new mEscpos.network(this.config.settings.network.ipAddress, this.config.settings.network.port);
                    this.printer = new mEscpos.Printer(this.device, this.config.options);

                    break;
                case Options.ESCPOS_TYPE_SERIAL :
                    /** Start Parsing The Serial Function For The Data Type Communication **/
                    /** End Start Parsing The Serial Function For The Data Type Communication **/
                    mEscpos.serial = checkModuleExist("escpos-serialport") ? require("escpos-serialport") : console.error("MODULE `escpos-serialport` not installed. please Installed First");
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
                    console.log(`type printer connection not available now`)
                    break;
                default :
                    /** Parsing The USB Function For The Data Type Communication **/
                    /** End Parsing The USB Function For The Data Type Communication **/
                    //##################################################################
                    /** Find The Printer Function */
                    try {
                        mEscpos.USB = checkModuleExist("escpos-usb") ? require("escpos-usb") : console.error("MODULE `escpos-usb` not installed. please Installed First");
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