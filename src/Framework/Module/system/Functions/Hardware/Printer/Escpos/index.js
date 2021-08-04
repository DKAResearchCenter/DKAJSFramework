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
     * @return Promise
     */
    constructor(config) {
        this.config = _.extend({
            type : Options.ESCPOS_TYPE_USB,
            settings : null,
            options : {
                encoding: "GB18030"
            }
        }, config);

        return new Promise(async(resolve, rejected) => {
            switch (this.config.type){
                case Options.ESCPOS_TYPE_USB :
                    mEscpos.USB = mEscposUsb;
                    if (mEscpos.USB.findPrinter().length > 0){
                        if (this.config.settings.vendorId !== undefined && this.config.settings.productId !== undefined){
                            this.device = new mEscpos.USB(this.config.settings.vendorId, this.config.settings.productId)
                            resolve(this.device)
                        }else{
                            this.device = new mEscpos.USB();
                            resolve(this.device)
                        }
                    }else{
                        rejected({
                            status : false,
                            code : 404,
                            msg : "Not Find The Printer"
                        })
                    }

                    break;
                case Options.ESCPOS_TYPE_NETWORK :
                    mEscpos.network = mEscposNetwork;


                    break;
                case Options.ESCPOS_TYPE_SERIAL :
                    mEscpos.serial = mEscposSerial

                    break;
                default :

            }
        })
    }

}


export default Escpos;