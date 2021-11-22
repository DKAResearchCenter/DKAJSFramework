import JWT from "jsonwebtoken";
import fs from "fs";
import path from "path";
import DKA, {Options, Security, Functions} from "./../../../index.module.d"

import _ from "lodash";

class mJwt {

    constructor(config) {
        this.config = _.extend({
            secretKey : fs.readFileSync(path.join(__dirname, "./key/private.key")),
            signOption : {
                algorithm : "HS256",
                expiresIn : 1288
            },

        })
    }

    token = async (payload) =>
        new Promise(async (resolve, rejected) => {
            const encr = new Security.Encryption.Crypto()
            const err2 = encr.encode(payload)
            console.log(err2)
            await JWT.sign(err2, this.config.secretKey,this.config.signOption, async (error, token) => {
                if (!error){
                    await resolve({ status : true, msg : "Successfully to Create Token", data : token});
                }else{
                    await rejected({ status : false, msg : "Error, Failed to Create Token", error : error});
                }
            })
        });

    verify = async (token) =>
        new Promise(async (resolve, rejected) => {
            await JWT.verify(token, this.config.secretKey, this.config.signOption, async (error, token) => {
                if (!error){
                    await resolve({ status : true, msg : "Successfully to Create Token", data : token});
                }else{
                    await rejected({ status : false, msg : "Error, Failed to Create Token", error : error});
                }
            })
        })
}

export default mJwt;