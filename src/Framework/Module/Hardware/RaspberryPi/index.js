'use warnings';
'use strict';
import Options from "./../../Options";
import _ from "lodash";
import { execSync } from "child_process";
import isPi from "@rodrigogs/ispi";

/**
 * @class RaspberryPi
 */
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

    /**
     *
     * @param config
     */
    constructor(config) {
        this.mPortArray = {};
        this.config = _.extend({
            engine : RaspberryPi.ENGINE_GPIO_LIBRARY,
            defaultLower : false
        }, config);

        function checkModuleExist(name){
            try {
                require.resolve(name);
                return true;
            }catch (e) {
                return false;
            }
        }

        switch (this.config.engine) {
            case RaspberryPi.ENGINE_JHONNYFIVE :
                //this.engineInstance = new Board();
                break;
            case RaspberryPi.ENGINE_GPIO_LIBRARY :
                this.engineInstance = checkModuleExist("gpio") ? require("gpio") : throw Error("MODULE GPIO NOT EXISTS OR NOT INSTALLED. PLEASE INSTALLED FIRST");
                break;
            default :
                //this.engineInstance = new Board();
                break;
        }
    }

    /**
     *
     * @param {Number} pin the gpio number board
     * @param {{ direction : String, interval : Number}} settings - for setting gpio options
     * @param {Boolean}defaultLower
     * @returns {Promise<Object>} the return Response
     */
    export = async (pin, settings , defaultLower =
        this.config.defaultLower) => await new Promise(async (resolve, rejected) => {
        if (isPi.sync()){
            this.settingsExport = await _.extend({
                direction : Options.GPIO_DIR_OUT,
                interval : 200
            }, settings);
            switch (this.config.engine){
                case RaspberryPi.ENGINE_GPIO_LIBRARY :
                    let mPort = this.engineInstance.export(`${pin}`, {
                        direction : this.settingsExport.direction,
                        interval : this.settingsExport.interval,
                        ready : async () => {
                            if (defaultLower){
                                //mPort.set();
                                await execSync(`gpio -g write ${pin} 1`);
                            }
                        }
                    });
                    this.mPortArray[pin] = {
                        instance : mPort,
                        direction : this.settingsExport.direction,
                        interval : this.settingsExport.interval
                    };
                    await resolve({ status : true, code : 200, msg : `Successfully Export Port Raspberry Pi`, pin : pin, direction : this.settingsExport.direction });
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
     * @param pin
     * @returns { Promise<Object> }
     */
    read = async (pin) => await new Promise(async (resolve, rejected) => {
        if (isPi.sync()){
            switch (this.config.engine) {
                case RaspberryPi.ENGINE_GPIO_LIBRARY :
                    Object.keys(this.mPortArray).map( async (key) => {
                        if (Number(key) === Number(pin)){
                            await resolve({ status : true, code : 200, msg : `Successfully to Read State`, state : this.mPortArray[key].instance.value });
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
    })
    /**
     * @param {Number} pin the Port GPIO Installed
     * @param {Boolean} state the State A Port Pin Number defined
     * @param { Boolean} defaultLower
     * @returns { Promise<Object> }
     */
    set = async (pin, state = false, defaultLower = this.config.defaultLower) => await new Promise(async (resolve, rejected) => {
        if (isPi.sync()){
            switch (this.config.engine) {
                case RaspberryPi.ENGINE_GPIO_LIBRARY :
                    Object.keys(this.mPortArray).map( async (key) => {
                            if (Number(key) === Number(pin)){
                                if (this.mPortArray[key].direction === Options.GPIO_DIR_OUT){
                                    if (defaultLower === false){
                                        if (state){
                                            await execSync(`gpio -g write ${pin} 1`);
                                            await resolve({ status : true, code : 200, msg : `state IO is High Successfully Set`})
                                        }else{
                                            await execSync(`gpio -g write ${pin} 0`);
                                            await resolve({ status : true, code : 200, msg : `state IO is Low Successfully Set`});
                                        }
                                        /*await (state) ? this.mPortArray[key].instance.set(function () {
                                            resolve({ status : true, code : 200, msg : `state IO is High Successfully Set`});
                                        }) : this.mPortArray[key].instance.set(0, function () {
                                            resolve({ status : true, code : 200, msg : `state IO is Low Successfully Set`});
                                        });*/
                                    }else{
                                        if (state){
                                            await execSync(`gpio -g write ${pin} 0`);
                                            await resolve({ status : true, code : 200, msg : `state IO is High Successfully Set`})
                                        }else{
                                            await execSync(`gpio -g write ${pin} 1`);
                                            await resolve({ status : true, code : 200, msg : `state IO is Low Successfully Set`});
                                        }
                                        /*await (state) ? this.mPortArray[key].instance.set(0, function () {
                                            resolve({ status : true, code : 200, msg : `state IO is Low Successfully Set`});
                                        }) : this.mPortArray[key].instance.set(function () {
                                            resolve({ status : true, code : 200, msg : `state IO is High Successfully Set`});
                                        });*/
                                    }
                                }
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
     * @param callback
     * @returns {Promise<Object>}
     **************************************************/
    change = async (pin, callback) => {
        if (isPi.sync()){
            switch (this.config.engine) {
                case RaspberryPi.ENGINE_GPIO_LIBRARY :
                    Object.keys(this.mPortArray).map( async (key) => {
                        if (Number(key) === Number(pin)){
                            if (this.mPortArray[key].direction === Options.GPIO_DIR_IN){
                                this.mPortArray[key].instance.on("change", async (pinStates) => {
                                    callback(null, { status : true, code : 200, msg : `detecting Pin State to ${pinStates}`, state : pinStates});
                                });
                            }else{
                                callback({ status : false, code : 505, msg : `The Pin is Not Dir In Mode. please Set Dir In Mode`});
                            }

                        }
                    });
                    break;
                default :
                    callback({ status : false, code : 500, msg : `Engine Config unknown or Unavailable`});
                    break;
            }
        }else{
            callback({ status : false, code : 505, msg : `This Device Not Raspberry Pi`});
        }
    };

    toggle = async (pin, delay = 200, defaultLower = this.config.defaultLower) => new Promise(async (resolve, rejected) => {
        if (isPi.sync()){
            switch (this.config.engine) {
                case RaspberryPi.ENGINE_GPIO_LIBRARY :
                    Object.keys(this.mPortArray).map( async (key) => {
                        if (Number(key) === Number(pin)){
                            if (this.mPortArray[key].direction === Options.GPIO_DIR_OUT){
                                if (defaultLower === false){
                                    await execSync(`gpio -g write ${pin} 1`);
                                    setTimeout(async () => {
                                        await execSync(`gpio -g write ${pin} 0`);
                                        await resolve({ status : true, code : 200, msg : `state IO is Low Successfully Set`});
                                    }, delay)
                                    /*await mArray[key].instance.set();
                                    await mDelay(delay);
                                    await mArray[key].instance.set(0);*/

                                }else{
                                    await execSync(`gpio -g write ${pin} 0`);
                                    setTimeout(async () => {
                                        await execSync(`gpio -g write ${pin} 1`);
                                        await resolve({ status : true, code : 200, msg : `state IO is Low Successfully Set`});
                                    }, delay)
                                    /*await mArray[key].instance.set(0);
                                    await mDelay(delay);
                                    await mArray[key].instance.set();
                                    await resolve({ status : true, code : 200, msg : `state IO is Low Successfully Set`});*/
                                }
                            }else{
                                await rejected({ status : false, code : 500, msg : `The Pin is Not Dir Out Mode. please Set Dir Out Mode`});
                            }

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
     * @param defaultLower
     * @returns {Promise<Object>}
     **************************************************/
    reset = async (pin, defaultLower = this.config.defaultLower) =>  await new Promise(async (resolve, rejected) => {
        if (isPi.sync()) {
            switch (this.config.engine) {
                case RaspberryPi.ENGINE_GPIO_LIBRARY :
                    Object.keys(this.mPortArray).map( async (key) => {
                        if (Number(key) === Number(pin)){
                            if (defaultLower === false){
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