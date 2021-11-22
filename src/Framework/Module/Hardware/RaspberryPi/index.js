'use strict';
'use warnings';
import Options from "./../../Options"
import _ from "lodash";
import gpio from "gpio";
import isPi from "detect-rpi";
import {exec, execSync} from "child_process";

class index {

    /** The Declaration Of The Variable In The Class Data **/
    pin = null;
    pinArray = [];
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

    static get GPIO_PULL_UP(){
     return Options.GPIO_PULL_UP;
    }

    static get GPIO_PULL_DOWN() {
        return Options.GPIO_PULL_DOWN;
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
    set = async(pin, State) =>
        new Promise(async (resolve, rejected) => {
            if (isPi()){
                switch (this.config.engine) {
                    case Options.RASPBERRYPI_CORE_CLI :
                        const mode = (State) ? 1 : 0;
                        await new Promise(async (SubResolve, Subrejected) => {
                            await exec(`gpio -g mode ${pin} ${this.config.direction}`, async (error,stdout,stderr) => {
                                (!error) ? await SubResolve({status : true}) : Subrejected({ status : false, code : 500, msg : `Error Open GPIO pin ${pin} to mode ${this.config.direction}`, error : error})
                            });
                        }).then(async (res) => {
                            let mReturn = {};
                            await exec(`gpio -g write ${pin} ${mode}`, async (error,stdout,stderr) => {
                                mReturn = (!error) ? {status: true} : throw { status : false, code : 500, msg : `cannot set pin ${pin} to ${mode}`, error : error};
                            });
                            return mReturn;
                        }).then(async (res) => {
                            (!res.status) ? resolve({ status : true, pin : `${pin}`, state : State, mode : this.config.direction}) : throw res;
                        }).catch(async (err) => {
                            await rejected(err)
                        })
                        break;
                    case Options.RASPBERRY_CORE_GPIO :
                        if (!this.exportInitialization){
                            this.pin = await gpio.export(`${pin}`, {
                                direction : this.config.direction,
                                ready : async () => {
                                    this.exportInitialization = true
                                }
                            });
                        }

                        await (State) ? this.pin.set(): this.pin.set(0);
                        await resolve({ status : true, code : 200, msg : `Successfully to set pin ${pin} to ${State}`})



                        break;
                }
            }else{
                rejected({ status : false, code : 500, msg : `This Device Not Raspbbery Pi Device`})
            }
        });

    /**
     *
     * @param {Number | String} pin
     * @param lowerDefault
     * @param {Number} delay
     * @return {Promise<unknown>}
     */
    toggle = async(pin, lowerDefault = this.config.setDefaultLower, delay = 100) =>
        new Promise(async (resolve, rejected) => {
            if (isPi()){
                switch (this.config.engine) {
                    case Options.RASPBERRYPI_CORE_CLI :
                        if (this.config.direction.direction !== Options.GPIO_DIR_IN){
                            await new Promise(async (Subresolve, Subrejected) => {
                                await exec(`gpio -g mode ${pin} ${this.config.direction}`, async (error, stdout, stderr) => {
                                    (!error) ? await Subresolve({status : true}) : Subrejected({ status : false, pin : pin, code : 500, msg : `Error Open GPIO pin ${pin} to mode ${this.config.direction}`, error : error})
                                });
                            }).then(async () => {
                                await (lowerDefault) ? await exec(`gpio -g write ${pin} 0`, async (error, stdout, stderr) => {
                                        (!error) ?
                                            await setTimeout(async () => {
                                                await exec(`gpio -g write ${pin} 1`, async (error, stdout, stderr) => {
                                                    (!error) ? resolve({ status : true, pin : `${pin}`, toggle : true, mode : this.config.direction}) : throw { status : false, code : 500, pin : pin, msg : `cannot set pin ${pin} to true`, error : error};
                                                });
                                            }, delay):
                                            throw { status : false, code : 500, pin : pin, msg : `cannot set pin ${pin} to false`, error : error};
                                    })
                                    : await exec(`gpio -g write ${pin} 1`, async (error, stdout, stderr) => {
                                        (!error) ?
                                            await setTimeout(async () => {
                                                await exec(`gpio -g write ${pin} 0`, async (error, stdout, stderr) => {
                                                    (!error) ? resolve({ status : true, pin : `${pin}`, toggle : true, mode : this.config.direction}) : throw { status : false, code : 500, pin : pin, msg : `cannot set pin ${pin} to false`, error : error};
                                                });
                                            }, delay):
                                            throw { status : false, code : 500, pin : pin, msg : `cannot set pin ${pin} to true`, error : error};
                                    });
                            }).catch(async (error) => {
                                rejected(error);
                            });
                        }else{
                            rejected({
                                status : false,
                                code : 501,
                                msg : `This Pin not in direction Mode `
                            })
                        }

                        break;
                    case Options.RASPBERRY_CORE_GPIO :
                        if (!this.exportInitialization){
                            this.pin = await gpio.export(`${pin}`, {
                                direction : this.config.direction,
                                ready : async () => {
                                    this.exportInitialization = true
                                }
                            });
                        }

                        if (this.config.setDefaultLower){
                            await this.pin.set(0);
                            setTimeout(async() => {
                                await this.pin.set();
                                await resolve({ status : false, code : 200, msg : `Successfully Execute Command Set pin ${pin}`})
                            }, delay);

                        }else{
                            await this.pin.set();
                            setTimeout(async() => {
                                await this.pin.set(0);
                                await resolve({ status : false, code : 200, msg : `Successfully Execute Command Set pin ${pin}`})
                            }, delay);
                        }
                        break;
                }
            }else{
                rejected({
                    status : false,
                    code : 500,
                    msg : `This Device Not Raspbbery Pi Device`
                })
            }

        });

    read = async (pin, callback) => {
        await exec(`gpio -g read ${pin}`, async (err, stdout, stderr) => {
           await callback(Number(stdout.replace(/\r?\n|\r/g, "")));
        });
    }
    event = async(pin, callback, mode = index.GPIO_PULL_DOWN) =>
        new Promise(async (resolve, rejected) => {
            if (isPi()){
                    console.log(`Listening port ${pin}`)
                    await execSync(`gpio -g mode ${pin} ${Options.GPIO_DIR_IN}`)
                    switch (this.config.engine) {
                        case Options.RASPBERRYPI_CORE_CLI :
                            setInterval(async () => {
                                await execSync(`gpio -g wfi ${pin} ${mode}`);
                                await exec(`gpio -g read ${pin}`, async (err, stdout, stderr) => {
                                    let convertToInt = Number(stdout.replace(/\r?\n|\r/g, ""));
                                    if (convertToInt === 0){
                                        await callback();
                                    }
                                });
                            }, this.config.interval)
                            break;
                        default :

                    }
            }else{
                rejected({
                    status : false,
                    code : 500,
                    msg : `This Device Not Raspbbery Pi Device`
                })
            }
        });



}

export default index;