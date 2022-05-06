'use warnings';
'use strict';
import Options from "./../../Options";
import _ from "lodash";
import gpio from "gpio";
import mDelay from "delay";
import isPi from "@rodrigogs/ispi";

class RaspberryPi {

    static get ENGINE_JHONNYFIVE(){
        return 1;
    }

    static get ENGINE_GPIO_LIBRARY(){
        return 2;
    }

    /**
     *
     * @type {{}}
     */
    mPortArray = {};

    constructor(config) {
        this.mPortArray = {};
        this.config = _.extend({
            engine : RaspberryPi.ENGINE_GPIO_LIBRARY,
            defaultLower : false
        }, config);

        switch (this.config.engine) {
            case RaspberryPi.ENGINE_JHONNYFIVE :
                //this.engineInstance = new Board();
                break;
            case RaspberryPi.ENGINE_GPIO_LIBRARY :
                this.engineInstance = gpio;
                break;
            default :
                //this.engineInstance = new Board();
                break;
        }
    }

    /**
     *
     * @param {Number} pin
     * @param {{ direction : String, interval : Number}} settings
     * @returns {Promise<(function(): void)|*>}
     */
    export = async (pin, settings) => await new Promise(async (resolve, rejected) => {
        if (isPi.sync()){
            this.settingsExport = await _.extend({
                direction : Options.GPIO_DIR_OUT,
                interval : 200
            }, settings);
            switch (this.config.engine){
                case RaspberryPi.ENGINE_GPIO_LIBRARY :
                    this.mPortArray[pin] = {
                        instance : this.engineInstance.export(`${pin}`, this.settingsExport),
                        direction : this.settingsExport.direction,
                        interval : this.settingsExport.interval
                    };
                    await resolve({ status : true, code : 500, msg : `Successfully Export Port Raspberry Pi`, instance : this.engineInstance.export(`${pin}`, this.settingsExport)});
                    break;
                default :
                    await rejected({ status : false, code : 500, msg : `Engine Config unknown or Unavailable`});
                    break;
            }
        }else{
            await rejected({ status : false, code : 505, msg : `This Device Not Raspberry Pi`});
        }
    });

    /**
     *
     * @param {Number} pin
     * @param {Boolean} state
     * @returns {Promise<unknown>}
     */
    set = async (pin, state = false) => await new Promise(async (resolve, rejected) => {
        if (isPi.sync()){
            switch (this.config.engine) {
                case RaspberryPi.ENGINE_GPIO_LIBRARY :
                    await Object(this.mPortArray).map( async (key) => {
                        if (key.direction === Options.GPIO_DIR_OUT){
                            if (key.isEqual(pin)){
                                if (this.config.defaultLower === false){
                                    (state) ? this.mPortArray[key].instance.set(async () => {
                                        await resolve({ status : true, code : 200, msg : `state IO is High Successfully Set`});
                                    }) : this.mPortArray[key].instance.set(0, async () => {
                                        await resolve({ status : true, code : 200, msg : `state IO is Low Successfully Set`});
                                    });
                                }else{
                                    (state) ? this.mPortArray[key].instance.set(0, async () => {
                                        await resolve({ status : true, code : 200, msg : `state IO is Low Successfully Set`});
                                    }) : this.mPortArray[key].instance.set(async () => {
                                        await resolve({ status : true, code : 200, msg : `state IO is High Successfully Set`});
                                    });
                                }
                            }else{
                                await rejected({ status : false, code : 500, msg : `The Pin Not Export. please export First`});
                            }
                        }else{
                            await rejected({ status : false, code : 500, msg : `The Pin is Not Dir Out Mode. please Set Dir Out Mode`});
                        }
                    });
                    break;
                default :
                    await rejected({ status : false, code : 500, msg : `Engine Config unknown or Unavailable`});
                    break;
            }
        }else{
            await rejected({ status : false, code : 505, msg : `This Device Not Raspberry Pi`});
        }

    });

    /**************************************************
     * @param {Number} pin
     * @param { Number } delay
     * @returns {Promise<Object>}
     **************************************************/
    toggle = async (pin, delay = 200) => await new Promise(async (resolve, rejected) => {
        if (isPi.sync()){
            switch (this.config.engine) {
                case RaspberryPi.ENGINE_GPIO_LIBRARY :
                    await Object(this.mPortArray).map( async (key) => {
                        if (key.direction === Options.GPIO_DIR_OUT){
                            if (key.isEqual(pin)){
                                if (this.config.defaultLower === false){
                                    this.mPortArray[key].instance.set(async () => {
                                        await mDelay(delay);
                                        this.mPortArray[key].instance.set(0, async () => {
                                            await resolve({ status : true, code : 200, msg : `state IO is Low Successfully Set`});
                                        });
                                    });
                                }else{
                                    this.mPortArray[key].instance.set(0, async () => {
                                        await mDelay(delay);
                                        this.mPortArray[key].instance.set(async () => {
                                            await resolve({ status : true, code : 200, msg : `state IO is Low Successfully Set`});
                                        });
                                    });
                                }
                            }else{
                                await rejected({ status : false, code : 500, msg : `The Pin Not Export. please export First`});
                            }
                        }else{
                            await rejected({ status : false, code : 500, msg : `The Pin is Not Dir Out Mode. please Set Dir Out Mode`});
                        }
                    });
                    break;
                default :
                    await rejected({ status : false, code : 500, msg : `Engine Config unknown or Unavailable`});
                    break;
            }
        }else{
            await rejected({ status : false, code : 505, msg : `This Device Not Raspberry Pi`});
        }

    });

    /**************************************************
     * @param {Number} pin
     * @returns {Promise<Object>}
     **************************************************/
    reset = async (pin) =>  await new Promise(async (resolve, rejected) => {
        if (isPi.sync()) {
            switch (this.config.engine) {
                case RaspberryPi.ENGINE_GPIO_LIBRARY :
                    await Object(this.mPortArray).map( async (key) => {
                        if (key.isEqual(pin)){
                            if (this.config.defaultLower === false){
                                if (this.mPortArray[key].direction === Options.GPIO_DIR_IN){
                                    await this.mPortArray[key].instance.removeAllListeners('change');
                                }
                                await this.mPortArray[key].instance.reset();
                               await this.mPortArray[key].instance.unexport(async () => {
                                    await resolve({ status : true, code : 200, msg : `Successfully to Reset Port`});
                                    delete this.mPortArray[key];
                                });
                            }else{
                                if (this.mPortArray[key].direction === Options.GPIO_DIR_IN){
                                    await this.mPortArray[key].instance.removeAllListeners('change');
                                }
                                this.mPortArray[key].instance.unexport(async () => {
                                    await resolve({ status : true, code : 200, msg : `Successfully to Reset Port`});
                                    delete this.mPortArray[key];
                                });
                            }
                        }else{
                            await rejected({ status : false, code : 505, msg : `Pin Not Export Or Detected`});
                        }
                    })
                    break;
            }
        }else{
            await rejected({ status : false, code : 505, msg : `This Device Not Raspberry Pi`});
        }
    })




}

export default RaspberryPi;