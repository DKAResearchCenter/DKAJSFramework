import moment from "moment";
import { Security, Database } from "./../../../../../JS";
import dns from "dns"
import path from "path";
import mac from "macaddress";
import os from "os";
import ip from "ip";
import { existsSync, readFileSync, writeFileSync } from "fs";
import dotEnv from "dotenv";


const Base = async () => {
    const db = await new Database.Google.Firestore({
        apiKey: "AIzaSyCFV8E2Hi2b0ru6L_dwaUdZljeu1MXRunc",
        authDomain: "dka-apis.firebaseapp.com",
        databaseURL: "https://dka-apis-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "dka-apis",
        storageBucket: "dka-apis.appspot.com",
        messagingSenderId: "797501409741",
        appId: "1:797501409741:web:85c5ecd5a69e4a81bc5c84",
        measurementId: "G-1MT7ZM6VKT"
    });


    return new Promise(async (resolve, rejected) => {
        const rootProject = path.join(process.cwd());
        const envPath = path.resolve(rootProject, ".env");
        const packageJson = await JSON.parse(readFileSync(path.join(rootProject, "./package.json"),'utf-8'));
        await dotEnv.config({
            path : envPath
        });

        if (existsSync(envPath)){
            await dns.resolve("www.google.com", async (err) => {
                if (!err) {
                    await mac.one(async (err, mac) => {
                        if (!err) {
                            const macAddress = mac.replaceAll(":","");
                            db.collection("DKA")
                                .doc("FRAMEWORK")
                                .collection("LICENCE")
                                .doc(macAddress)
                                .get()
                                .then(async (data) => {
                                    const mEnc = new Security.Encryption.Crypto({
                                        secretKey : "@Thedarkangels2021"
                                    })
                                    const encode = mEnc.encodeIvSync(data.data())
                                    await writeFileSync(envPath, `LICENCE_KEY=${encode}` ,{
                                        encoding : 'utf-8'
                                    });
                                    resolve(data.data());
                                }).catch(async (err) => {
                                if (process.env.LICENCE_KEY !== undefined){
                                    const mEnc = new Security.Encryption.Crypto({
                                        secretKey : "@Thedarkangels2021"
                                    })
                                    const dec = mEnc.decodeIvSync(process.env.LICENCE_KEY);
                                    if ((typeof dec) !== 'string'){
                                        resolve(dec);
                                        //returnValues = { status : true, code : 200, data : dec};
                                        /*const timeExpires = moment.unix(dec.expireDate).format('DD-MM-YYYY');
                                        const timeNowToUnix = moment(Date.now()).unix()
                                        const timeExpToUnix = moment(timeExpires,'DD-MM-YYYY').unix();

                                        const diffTime = (timeExpToUnix - timeNowToUnix)

                                        dec.time = {
                                            dateNow : moment(Date.now()).format('DD-MM-YYYY'),
                                            dateExp : moment.unix(timeExpToUnix).format("DD-MM-YYYY")
                                        }*/
                                        /*if (diffTime > 1) {
                                            returnValues = { status : true, code : 200, data : dec, msg : "your Licence Has Activated"};
                                        }else{
                                            returnValues = { status : false, code : 403, data : dec, msg : "your Licence Has Expires"};
                                        }*/

                                    }else{
                                        rejected({ status : false, code : 500, msg : "Your Licence Not Identifing or Wrong "});
                                    }

                                }else{
                                    rejected({ status : false, code : 500, msg : "variable `LICENCE_KEY` not Exist "});
                                }
                            });
                        }else{
                            if (process.env.LICENCE_KEY !== undefined){
                                const mEnc = new Security.Encryption.Crypto({
                                    secretKey : "@Thedarkangels2021"
                                })
                                const dec = mEnc.decodeIvSync(process.env.LICENCE_KEY);
                                if ((typeof dec) !== 'string'){
                                    resolve(dec);
                                    //returnValues = { status : true, code : 200, data : dec};
                                    /*const timeExpires = moment.unix(dec.expireDate).format('DD-MM-YYYY');
                                    const timeNowToUnix = moment(Date.now()).unix()
                                    const timeExpToUnix = moment(timeExpires,'DD-MM-YYYY').unix();

                                    const diffTime = (timeExpToUnix - timeNowToUnix)

                                    dec.time = {
                                        dateNow : moment(Date.now()).format('DD-MM-YYYY'),
                                        dateExp : moment.unix(timeExpToUnix).format("DD-MM-YYYY")
                                    }*/
                                    /*if (diffTime > 1) {
                                        returnValues = { status : true, code : 200, data : dec, msg : "your Licence Has Activated"};
                                    }else{
                                        returnValues = { status : false, code : 403, data : dec, msg : "your Licence Has Expires"};
                                    }*/

                                }else{
                                    rejected({ status : false, code : 500, msg : "Your Licence Not Identifing or Wrong "});
                                }

                            }else{
                                rejected({ status : false, code : 500, msg : "variable `LICENCE_KEY` not Exist "});
                            }
                        }
                    });
                }else{
                    if (process.env.LICENCE_KEY !== undefined){
                        const mEnc = new Security.Encryption.Crypto({
                            secretKey : "@Thedarkangels2021"
                        })
                        const dec = mEnc.decodeIvSync(process.env.LICENCE_KEY);

                        if ((typeof dec) !== 'string'){
                            resolve(dec);
                            //returnValues = { status : true, code : 200, data : dec};
                            /*const timeExpires = moment.unix(dec.expireDate).format('DD-MM-YYYY');
                            const timeNowToUnix = moment(Date.now()).unix()
                            const timeExpToUnix = moment(timeExpires,'DD-MM-YYYY').unix();

                            const diffTime = (timeExpToUnix - timeNowToUnix)

                            dec.time = {
                                dateNow : moment(Date.now()).format('DD-MM-YYYY'),
                                dateExp : moment.unix(timeExpToUnix).format("DD-MM-YYYY")
                            }*/
                            /*if (diffTime > 1) {
                                returnValues = { status : true, code : 200, data : dec, msg : "your Licence Has Activated"};
                            }else{
                                returnValues = { status : false, code : 403, data : dec, msg : "your Licence Has Expires"};
                            }*/

                        }else{
                            rejected({ status : false, code : 500, msg : "Your Licence Not Identifing or Wrong "});
                        }

                    }else{
                        rejected({ status : false, code : 500, msg : "variable `LICENCE_KEY` not Exist "});
                    }
                }
            })
        }else{
            await dns.resolve("www.google.com", async (err) => {
                if (!err){
                    await mac.one(async (err, mac) => {
                        if (!err){
                            const macAddress = mac.replaceAll(":","");
                            let mDeviceMetaData = {
                                packageName : packageJson.name,
                                ip_address : ip.address(),
                                architecture : os.arch(),
                                platform : os.platform(),
                                hostname : os.hostname(),
                                expiresDate : moment().add(1,'day').format('DD-MM-YYYY')
                            }

                            if (packageJson.devDependencies !== undefined){
                                mDeviceMetaData.devDependencies = packageJson.devDependencies
                            }

                            if (packageJson.Dependencies !== undefined){
                                mDeviceMetaData.Dependencies = packageJson.Dependencies
                            }

                            await db.collection("DKA")
                                .doc("FRAMEWORK")
                                .collection("LICENCE")
                                .doc(macAddress)
                                .set(mDeviceMetaData)
                                .then(async (res) => {
                                    const mEnc = new Security.Encryption.Crypto({
                                        secretKey : "@Thedarkangels2021"
                                    })
                                    const encode = mEnc.encodeIvSync(mDeviceMetaData)
                                    await writeFileSync(envPath, `LICENCE_KEY=${encode}` ,{
                                        encoding : 'utf-8'
                                    });
                                    resolve(mDeviceMetaData);
                                }).catch(async (err) => {
                                    rejected({ status : false, code : 500, msg : "failed to register this device to the framework licensing system", err : err})
                                })
                        }else{
                            rejected({ status : false, code : 500, msg : "Cannot get mac Address In Your Devices"})
                        }
                    });

                }else{
                    console.log('no Internet')
                }
            })
        }
    }).then(async (data) => {
        const DateNow = moment(Date.now()).unix()
        const DateExpire = moment(data.expiresDate,'DD-MM-YYYY').unix()
        if ((DateExpire - DateNow) > 0){
            return {
                status : true,
                code : 200,
                msg : "successfully, licence has activate",
                licenceData : data
            }
        }else{
            return {
                status : false,
                code : 403,
                msg : "Licence, Has Expires",
                licenceData : data
            }
        }

    })
}

export default Base;