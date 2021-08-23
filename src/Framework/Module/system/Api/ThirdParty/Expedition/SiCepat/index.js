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


    constructor(config) {
        this.config = _.extend({
            state : SiCepat.SICEPAT_EXPEDITION_DEVELOPMENT,
            key : null
        }, config);
    }

    origin = async() => {
        return new Promise(async (resolve, rejected) => {
            const url = `${this.config.state}customer/origin`;
            axios.get(`${url}`, {
                headers : {
                    'api-key' : this.config.key
                }
            }).then(async (res) => {
                resolve(res.data)
            }).catch(async (error) => {
                rejected(_.extend({
                    key : this.config.key
                }, error.response.data))
            });
        });
    }
}

export default SiCepat;