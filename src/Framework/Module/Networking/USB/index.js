import _ from "lodash";
import usbDetection from "usb-detection";
import { getDeviceList } from 'usb';

class USB {

    constructor(config) {
        this.config = _.merge({

        }, config);


    }

    getUSBList = getDeviceList();

}

export default USB;