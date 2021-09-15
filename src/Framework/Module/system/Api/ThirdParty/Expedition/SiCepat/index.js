import axios from "axios";
import $ from "jquery";
import hmac256 from "crypto-js/hmac-sha256";
import CryptoJS from "crypto-js";
import Crypto from "crypto";
import moment from "moment";
import qs from "qs";
import _ from "lodash";

class SiCepat {

    static get SICEPAT_EXPEDITION_DEVELOPMENT() {
        return 'http://apitrek.sicepat.com/';
    }

    static get SICEPAT_EXPEDITION_PRODUCTION() {
        return 'http://apitrek.sicepat.com/';
    }

    static get SICEPAT_EXPEDITION_LOCATION_ORIGIN(){
        return 'origin';
    }

    static get SICEPAT_EXPEDITION_LOCATION_DESTINATION(){
        return 'destination';
    }


    /**
     *
     * @param {{}} config Function For Configuration Api
     * @param {String} config.state Function For Configuration Mode and URL
     * @param {String} config.key Function For Configuration Key
     */
    constructor(config) {
        this.config = _.extend({
            state : SiCepat.SICEPAT_EXPEDITION_DEVELOPMENT,
            key : null
        }, config);
    }

    LocationServices = async(mode = SiCepat.SICEPAT_EXPEDITION_LOCATION_ORIGIN) => {
        return new Promise(async (resolve, rejected) => {
            const url = (mode === SiCepat.SICEPAT_EXPEDITION_LOCATION_ORIGIN) ? `${this.config.state}customer/origin` : `${this.config.state}customer/destination`;
            axios.get(`${url}`, {
                headers : {
                    'api-key' : this.config.key
                }
            }).then(async (res) => {
                resolve(res.data.sicepat);
            }).catch(async (error) => {
                rejected(error.response);
            });
        });
    };

    Price = async(origin, destination, weight) => {
        return new Promise(async (resolve, rejected) => {
            axios.get(`${this.config.state}customer/tariff`, {
                headers : {
                    'api-key' : this.config.key
                },
                params : {
                    origin : origin,
                    destination : destination,
                    weight : weight
                }
            }).then(async (res) => {
                resolve(res.data.sicepat);
            }).catch(async (error) => {
                rejected(error.response.data.sicepat);
            });
        });
    };


}

export default SiCepat;