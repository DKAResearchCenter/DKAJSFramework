import _ from "lodash";
import { SerialPort } from "serialport";

class serialPort {

    /**
     *
     * @param config
     * @returns {Promise<Any>}
     */
    constructor(config) {
        this.config = _.merge({
            path : 'COM3',
            baudRate: 57600
        }, config);

        return new Promise(async (resolve, rejected) => {
            this.serialInstance = await new SerialPort(this.config);
            await this.serialInstance.on('error', async (error) => {
                await rejected(error);
            });
            await resolve(this.serialInstance);
        })
    }

    list = async () => {
        return SerialPort.list();
    }
}


export default serialPort;