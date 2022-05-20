import _ from "lodash";
import usbDetection from "usb-detection";
class Usb {


    mStartState = false
    stringQuery = '';
    static get ADDED_EVENT(){
        return 1;
    }

    static get REMOVE_EVENT(){
        return 2;
    }

    static get CHANGE_EVENT(){
        return 3;
    }

    constructor() {

    }

    detection = async (Options, callback) => {
        this.options = await _.merge({
            state : Usb.ADDED_EVENT,
            Ids : {
                idVendor : undefined,
                idProduct : undefined
            }
        }, Options)
        if (this.mStartState) {
            await usbDetection.startMonitoring()
        }
        switch (this.options.state) {
            case Usb.ADDED_EVENT :
                    this.stringQuery = "";
                    this.stringQuery.concat("add")
                    if (this.options.Ids.idProduct !== undefined){
                        this.stringQuery.concat(`:${this.options.Ids.idProduct}`);
                    }
                    if (this.options.Ids.idVendor !== undefined){
                        this.stringQuery.concat(`:${this.options.Ids.idVendor}`);
                    }

                    await usbDetection.on(this.stringQuery, async (device) => {
                        callback(device);
                    });
                break;
            case Usb.CHANGE_EVENT :
                this.stringQuery = "";
                this.stringQuery.concat("change")
                if (this.options.Ids.idProduct !== undefined){
                    this.stringQuery.concat(`:${this.options.Ids.idProduct}`);
                }
                if (this.options.Ids.idVendor !== undefined){
                    this.stringQuery.concat(`:${this.options.Ids.idVendor}`);
                }

                await usbDetection.on(this.stringQuery, async (device) => {
                    callback(device);
                });
                break;
            case Usb.REMOVE_EVENT :
                this.stringQuery = "";
                this.stringQuery.concat("remove")
                if (this.options.Ids.idProduct !== undefined){
                    this.stringQuery.concat(`:${this.options.Ids.idProduct}`);
                }
                if (this.options.Ids.idVendor !== undefined){
                    this.stringQuery.concat(`:${this.options.Ids.idVendor}`);
                }

                await usbDetection.on(this.stringQuery, async (device) => {
                    callback(device);
                });
                break;
        }
    }


}