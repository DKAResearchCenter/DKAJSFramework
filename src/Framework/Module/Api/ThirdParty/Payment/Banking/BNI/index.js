import axios from "axios";
import qs from "qs";
import _ from "lodash";

class BNI {
    static get BNI_STATE_PRODUCTION(){
        return "https://api.bni.co.id";
    }

    static get BNI_STATE_SANDBOX(){
        return "https://apidev.bni.co.id";
    }

    constructor(config) {
        this.config = _.extend({
            state : BNI.BNI_STATE_SANDBOX,
            cliend_id : null,
            client_secret : null,
        }, config)
    }


    accessToken = async(clientId = this.config.client_id, clientSecret = this.config.client_secret) =>
        axios.post(`${this.config.state}/api/oauth/token`,
            qs.stringify({
                client_id : clientId,
                client_secret : clientSecret
            }), {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization : `Basic ${Buffer.from(`${clientId}:${clientSecret}`)})`
                },
                params : {
                    grant_type : 'client_credentials'
                }
            });

}

export default BNI;