'use strict';
'use warnings';
import Options from "./../../../Options"
import _ from "lodash";
import gpio from "gpio";
import { execSync } from "child_process";

class index {

    mGpio = null;
    mGpioArray = [];
    config = {};
    instances = null;
    readyEvent = null;
    mEvent = null;
    pinArray = [];

    static get OUT() {
        return Options.GPIO_DIR_OUT;
    };

    static get IN(){
        return Options.GPIO_DIR_IN;
    };

    static get EVENT_CHANGE() {
        return Options.GPIO_EVENT_CHANGE;
    }

    constructor(config) {
        this.config = _.extend({
            enabled : true,
            engine : Options.RASPBERRYPI_CORE_CLI,
            setDefaultLower : false,
            interval : 200,
            direction : Options.GPIO_DIR_OUT
        }, config)


    };

    /** Function For Data Export In The Sistem in Programaticaly
     * By Yovangga anandhika hadi putra**/

    /**
     *
     * @param {Number} pin
     * @param {{}} settings
     * @param {String} settings.direction
     * @param {Number} settings.interval
     */
    open = async (pin, settings = this.config) =>
        new Promise( async (resolve) => {

            switch (this.config.engine){
                case Options.RASPBERRYPI_CORE_CLI :

                    break;
                case Options.RASPBERRY_CORE_GPIO :
                    /** Get Setialize for resolve chaining data proccess
                     * set Config data for Setting user Connection Chaining Data
                     * **/
                    const mDirection = {
                        direction : settings.direction,
                        ready : async() => {
                            resolve(this.mGpio);
                        }
                    };

                    /** Detect The mDirection out get interval duration **/
                    if (settings === Options.GPIO_DIR_OUT){
                        mDirection.interval = settings.interval
                    }

                    this.mGpio = await gpio.export(pin, mDirection );
                    this.mGpio.close = async(callback = false) => {
                        this.mGpio.reset();
                        if (callback){
                            this.mGpio.unexport(callback);
                        }
                    };
                    this.mGpio.on = async(event = Options.GPIO_EVENT_CHANGE) => {
                        new Promise(async (resolve) => {
                            this.mEvent = await this.mGpio.on(event, async(val) => {
                                (this.config.setDefaultLower) ? resolve({
                                    function : this.mEvent,
                                    value : (val === 1) ? resolve(0) : resolve(1)
                                }) : resolve({
                                    function : this.mEvent,
                                    value : val
                                })
                            })
                        });
                    }
                    this.mGpioArray.push(this.mGpio);
                    break;
                default :

            }
        }).catch(async (error) => {
            console.log(error);
        })
}

export default index;