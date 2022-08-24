import Crypto from "crypto";
import _ from "lodash";
import {Options} from "./../../../index.module.d"

/**
 *
 */
class crypto {
    constructor(Config) {
        this.Config = _.extend({
            algorithm : Options.ALGORITHM_AES_256_GCM,
            secretKey : "Cyberhack2010",
            keyLength : undefined
        }, Config);

    }

    /**
     *
     * @param {String} text
     * @return {Promise<unknown>}
     */
    encodeIv =  async (text) =>
        new Promise(async (resolve, rejected) => {
            await new Promise(async (resolve2, rejected) => {
                switch (this.Config.algorithm){
                    case Options.ALGORITHM_AES_256_GCM :
                        await resolve2({ key : Buffer.alloc(32, this.Config.secretKey), iv : Crypto.randomBytes(16)});
                        break;
                    case Options.ALGORITHM_AES_192_GCM :
                        await resolve2({
                            key : Buffer.alloc(24, this.Config.secretKey),
                            iv : Crypto.randomBytes(16)
                        });
                        break;
                    case Options.ALGORITHM_AES_128_GCM :
                        await resolve2({
                            key : Buffer.alloc(16, this.Config.secretKey),
                            iv : Crypto.randomBytes(16)
                        });
                        break;
                    default :
                        rejected({ status : false, code : 500, msg : "Algoritm undefined"})
                }
            }).then(async (res) => {
                try {
                    const crypto = Crypto.createCipheriv(this.Config.algorithm, res.key, res.iv );
                    // Updating text
                    let encrypted = crypto.update(text);
                    // Using concatenation
                    encrypted = Buffer.concat([encrypted, crypto.final()]);
                    // Returning iv and encrypted data
                    await resolve(`${res.iv.toString('hex')}:${encrypted.toString('hex')}`);
                }catch (e) {
                    rejected({ status : false, code : 500, msg : "Error, to Decode hash Data", error : e})
                }
            })

        });

    encodeIvSync = (text) => {
        let res = {
            key : (this.Config.algorithm === Options.ALGORITHM_AES_256_GCM) ?
                Buffer.alloc(32, this.Config.secretKey) :
                (this.Config.algorithm === Options.ALGORITHM_AES_192_GCM) ?
                    Buffer.alloc(24, this.Config.secretKey) :
                    (this.Config.algorithm === Options.ALGORITHM_AES_128_GCM) ?
                        Buffer.alloc(16, this.Config.secretKey) : "",
            iv : Buffer.alloc(16, this.Config.secretKey)
        }
        const crypto = Crypto.createCipheriv(this.Config.algorithm, res.key, res.iv );
        // Updating text
        const mText = ((typeof text) === "string") ? text : JSON.stringify(text);
        let encrypted = crypto.update(mText);
        // Using concatenation
        encrypted = Buffer.concat([encrypted, crypto.final()]);
        // Returning iv and encrypted data
        return Buffer.from(`${res.iv.toString('hex')}:${encrypted.toString('hex')}`).toString('base64');
    }

    
    decodeIv = async (text) =>
        new Promise(async (resolve, rejected) => {
            let hash = text.split(':');
            await new Promise(async (resolve2, rejected) => {
                switch (this.Config.algorithm){
                    case Options.ALGORITHM_AES_256_GCM :
                        await resolve2({
                            key :  Buffer.alloc(32, this.Config.secretKey),
                            iv : Buffer.from(hash[0].toString(), 'hex')
                        });
                        break;
                    case Options.ALGORITHM_AES_192_GCM :
                        await resolve2({
                            key : Buffer.alloc(24, this.Config.secretKey),
                            iv : Buffer.from(hash[0].toString(), 'hex')
                        });
                        break;
                    case Options.ALGORITHM_AES_128_GCM :
                        await resolve2({
                            key : Buffer.alloc(16, this.Config.secretKey),
                            iv : Buffer.from(hash[0].toString(), 'hex')
                        });
                        break;
                    default :
                        rejected({ status : false, code : 500, msg : "Algoritm undefined"})
                }
            }).then(async (res) => {
                try {
                    const crypto = Crypto.createDecipheriv(this.Config.algorithm, res.key, res.iv );
                    const decrpyted = crypto.update(Buffer.from(hash[1],'hex')).toString()
                    resolve(decrpyted)
                }catch (e) {
                    rejected({ status : false, code : 500, msg : "Error, to Decode hash Data", error : e})
                }
            })
        })
    decodeIvSync = (text) => {
        let mReturn = null;
        const toUtf8 = Buffer.from(text,'base64').toString('utf-8');
        const hash = toUtf8.split(":")
        let res = {
            key : (this.Config.algorithm === Options.ALGORITHM_AES_256_GCM) ?
                Buffer.alloc(32, this.Config.secretKey) :
                (this.Config.algorithm === Options.ALGORITHM_AES_192_GCM) ?
                    Buffer.alloc(24, this.Config.secretKey) :
                    (this.Config.algorithm === Options.ALGORITHM_AES_128_GCM) ?
                        Buffer.alloc(16, this.Config.secretKey) : "",
            iv : Buffer.alloc(16, this.Config.secretKey)
        };
        const crypto = Crypto.createDecipheriv(this.Config.algorithm, res.key, res.iv );
        const textUpdate = crypto.update(Buffer.from(hash[1],'hex')).toString();
        try {
            mReturn = JSON.parse(textUpdate);
        }catch (e){
            mReturn = textUpdate;
        }
        return mReturn;

    }


    encodeGeneral = (text) => {
        const Chiper = Crypto.scryptSync(text, this.Config.secretKey, 16);
        return Chiper.toString('base64');
    }
    decodeGeneral = (text) => {
        const Chiper = Crypto
    }
}

export default crypto;