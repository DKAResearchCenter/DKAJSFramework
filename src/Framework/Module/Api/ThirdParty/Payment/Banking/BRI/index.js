import axios from "axios";
import Crypto from "crypto";
import moment from "moment";
import qs from "qs";
import _ from "lodash";

class BRI {

    static get BRI_STATE_DEVELOPMENT(){
        return "https://sandbox.partner.api.bri.co.id/";
    }

    static get BRI_STATE_PRODUCTION(){
        return "https://partner.api.bri.co.id/";
    }




    constructor(config) {
        this.config = _.extend({
            state : BRI.BRI_STATE_DEVELOPMENT,
            version : 2,
            client_id : null,
            client_secret : null
        }, config);


    }

    accessToken = async(clientId = this.config.client_id, clientSecret = this.config.client_secret) =>
        axios.post(`${this.config.state}oauth/client_credential/accesstoken`,
            qs.stringify({
                client_id : clientId,
                client_secret : clientSecret
            }), {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                params : {
                    grant_type : 'client_credentials'
                }
            });

    getAccountInfo = async(data) => {
        this.getAccountConfig = _.extend({
            accountNumber : null,
            token : null
        }, data);
        return new Promise(async (resolve, rejected) => {
            const mTimeStamp = `${moment(new Date(Date.now())).utc(0).toISOString()}`;
            const mPayload = `path=/v2/inquiry/${this.getAccountConfig.accountNumber}&verb=GET&token=Bearer ${this.getAccountConfig.token}&timestamp=${mTimeStamp}&body=`;
            const mHmac = Crypto.createHmac('SHA256', this.config.client_secret)
                .update(mPayload)
                .digest('base64');

            const mHeader = {
                'BRI-Timestamp' : mTimeStamp,
                'BRI-Signature' : mHmac,
                'Authorization' : `Bearer ${this.getAccountConfig.token}`
            }
            await axios.get(`${this.config.state}v${this.config.version}/inquiry/${this.getAccountConfig.accountNumber}`, {
                headers : mHeader
            }).then(async (res) => {
                (res.data.responseCode === '0100') ?
                    resolve(res.data)
                : rejected(res.data);
            }).catch(async (error) => {
                rejected(error);
                console.log(mHeader);
            });

        })
    };

    briva = {
        Create : async(config) => {
            this.brivaConfig = _.extend({
                url : `${this.config.state}v1/briva`,
                token : null,
                requestData : {}
            }, config);

            return new Promise(async (resolve, rejected) => {
                const mTimeStamp = `${moment(new Date(Date.now())).utc(0).toISOString()}`;
                const mPayload = `path=/v1/briva    &verb=GET&token=Bearer ${this.brivaConfig.token}&timestamp=${mTimeStamp}&body=`;
                const mHmac = Crypto.createHmac('SHA256', this.config.client_secret)
                    .update(mPayload)
                    .digest('base64');

                const mHeader = {
                    'BRI-Timestamp' : mTimeStamp,
                    'BRI-Signature' : mHmac,
                    'Authorization' : `Bearer ${this.brivaConfig.token}`,
                    'Content-Type': 'application/json'
                }
                await axios.post(this.brivaConfig.url,
                    this.brivaConfig.requestData
                    , { headers : mHeader }).then(async (res) => {
                    (res.data.responseCode === '0100') ?
                        resolve(res.data)
                        : rejected(res.data);
                }).catch(async (error) => {
                    rejected(error);
                    console.log(mHeader);
                });
            })

        }
    }


}

export default BRI;