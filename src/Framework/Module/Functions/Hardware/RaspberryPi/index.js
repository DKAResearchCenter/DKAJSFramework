'use strict';
'use warnings';

import Options from "./../../../Options"
import _ from "lodash";
import gpio from "gpio";
import { execSync, exec } from "child_process";

class index {

    /** The Declaration Of The Variable In The Class Data **/
    pin = 2;
    config = {};
    exportInitialization = false;
    /** End The Declaration Of The Variable In The Class Data **/

    /** Static Variable For Settings **/
    static get GPIO_DIR_OUT() {
        return Options.GPIO_DIR_OUT;
    };

    static get GPIO_DIR_IN(){
        return Options.GPIO_DIR_IN;
    };

    static get GPIO_EVENT_CHANGE() {
        return Options.GPIO_EVENT_CHANGE;
    }

    /**
     * @param {Object} config The Configuration Data Module Raspberry Pi
     * @param {boolean} config.enabled Disable The Module Raspberry Pi
     * @param {String} config.engine Engine Selection Prototype
     * @param {String} config.setDefaultLower Function For LowerState
     */
    constructor(config) {
        this.config = _.extend({
            enabled : true,
            engine : Options.RASPBERRYPI_CORE_CLI,
            setDefaultLower : false,
            interval : 200,
            direction : Options.GPIO_DIR_OUT
        }, config);

    };

    /**
     *
     * @param {Number} pin
     * @param {boolean} State
     * @return {Promise<Any>}
     */
    open = async(pin, State) =>
        new Promise(async (resolve, rejected) => {
            switch (this.config.engine) {
                case Options.RASPBERRYPI_CORE_CLI :
                    const mode = (State) ? 1 : 0;
                    await execSync(`gpio -g mode ${pin} ${this.config.direction}`);
                    await execSync(`gpio -g write ${pin} ${mode}`);
                    this.ReturnData = {
                        status : State,
                        mode : this.config.direction
                    }
                    await resolve(this.ReturnData);
                    break;
                case Options.RASPBERRY_CORE_GPIO :
                    if (!this.exportInitialization){
                        this.pin = await gpio.export(`${pin}`, {
                            direction : this.config.direction,
                            ready : async() => {
                                (this.config.setDefaultLower) ? this.pin.set(0) : this.pin.set();
                                this.exportInitialization = true
                            }
                        });
                    }

                    (State) ? this.pin.set() : this.pin.set(0);

                    break;
            }
        });

    /**
     *
     * @param {Number} pin
     * @param {Number} delay
     * @param {function} readyCallback
     * @return {Promise<unknown>}
     */
    toggle = async(pin, delay = 100, readyCallback = null) =>
        new Promise(async (resolve, rejected) => {
            switch (this.config.engine) {
                case Options.RASPBERRYPI_CORE_CLI :
                    await execSync(`gpio -g mode ${pin} ${this.config.direction}`);
                    if (this.config.setDefaultLower){
                        await execSync(`gpio -g write ${pin} 0`);
                        setTimeout(async() => {
                            await execSync(`gpio -g write ${pin} 1`);
                        }, delay);
                    }else{
                        await execSync(`gpio -g write ${pin} 1`);
                        setTimeout(async() => {
                            await execSync(`gpio -g write ${pin} 0`);
                        }, delay);
                    }
                    this.ReturnData = {
                        status : true,
                        mode : this.config.direction
                    }
                    await resolve(this.ReturnData);
                    break;
                case Options.RASPBERRY_CORE_GPIO :
                    if (!this.exportInitialization){
                        this.pin = await gpio.export(`${pin}`, {
                            direction : this.config.direction,
                            ready : readyCallback
                        });
                    }

                    if (this.config.setDefaultLower){
                        await this.pin.set(0);
                        setTimeout(async() => {
                            await this.pin.set();
                        }, delay);
                    }else{
                        await this.pin.set();
                        setTimeout(async() => {
                            await this.pin.set(0);
                        }, delay);
                    }
                    break;
            }
        });

    event = async(pin = this.pin, bounce = false) =>
        new Promise(async (resolve, rejected) => {
            if (this.config.direction !== Options.GPIO_DIR_IN){
                await execSync(`gpio -g mode ${Options.GPIO_DIR_UP}`)
                switch (this.config.engine) {
                    case Options.RASPBERRYPI_CORE_CLI :

                    break;
                    default :

                }
            }else{
                rejected({
                    status : false,
                    msg : `The Direction Not Input Mode`
                })
            }
        });



}

export default index;