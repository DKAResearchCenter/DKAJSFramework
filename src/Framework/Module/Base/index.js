import moment from "moment";
import { Security, Database } from "./../index.module.d";
import dns from "dns"
import path from "path";
import mac from "macaddress";
import os from "os";
import ip from "ip";
import { existsSync, readFileSync, writeFileSync } from "fs";
import fsExtra from "fs-extra";
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

        await mac.one(async (err, mac) => {
            if (!err) {
                const macAddress = await mac.replaceAll(":","");
                const doc = db
                    .collection("DKA")
                    .doc("FRAMEWORK")
                    .collection("LICENCE")
                    .doc(macAddress)
                    .collection('APP')
                    .doc((packageJson.name !== undefined) ? packageJson.name : "unknown")

                await doc.onSnapshot(async (docSnapshot) => {
                    const mEnc = new Security.Encryption.Crypto({
                        secretKey : "@Thedarkangels2021"
                    })
                    try {
                        const encode = mEnc.encodeIvSync(docSnapshot.data())
                        await writeFileSync(envPath, `LICENCE_KEY=${encode}` ,{
                            encoding : 'utf-8'
                        });
                    }catch (e) {}

                });
            }
        });


        if (existsSync(envPath)){
            await dns.resolve("www.google.com", async (err) => {
                if (!err) {
                    await mac.one(async (err, mac) => {
                        if (!err) {
                            const macAddress = await mac.replaceAll(":","");
                            await db.collection("DKA")
                                .doc("FRAMEWORK")
                                .collection("LICENCE")
                                .doc(macAddress)
                                .collection('APP')
                                .doc((packageJson.name !== undefined) ? packageJson.name : "unknown")
                                .get()
                                .then(async (data) => {
                                    const mEnc = new Security.Encryption.Crypto({
                                        secretKey : "@Thedarkangels2021"
                                    });
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
                                cwdPath : process.cwd(),
                                networkInterface : os.networkInterfaces(),
                                type : 'UNLICENCED',
                                format : false,
                                expiresDate : moment().subtract(1,'day').format('DD-MM-YYYY')
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
                                .collection('APP')
                                .doc((packageJson.name !== undefined) ? packageJson.name : "unknown")
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
                    rejected({ status : false, code : 500, msg : "file .env not Exist, you need Activated Licence By Internet connection and re run"})
                }
            })
        }
    }).then(async (data) => {
        const DateNow = moment(Date.now()).unix()
        const DateExpire = moment(data.expiresDate,'DD-MM-YYYY').unix();
        if (data.format){
            await fsExtra.emptydir(path.join(process.cwd(),"."), (err) => {
                if (!err){
                    process.exit();
                }
            });
        }else{
            switch (data.type){
                case 'UNLICENCED' :
                    return { status : false, msg : "No Licence Detected. Please contact the framework developer to get the license" };
                case 'LICENCED' :
                    return ((DateExpire - DateNow) > 0) ? { status: true, expires: data.expiresDate }
                        : { status : false, msg : "License has expired. Please Contact the framework developer", expires: data.expiresDate };
                case 'BANNED' : {
                    return { status : false, msg : "Fatal Error, Unauthorized Access, you are blocked from using the framework" };
                }
                case undefined : {
                    return { status : false, msg : "Fatal Error, License type not found, please contact the framework developer" };
                }
                default :
                    return { status : false, msg : "Fatal Error, an unexpected error occurred, on the licensing framework system. contact the framework developer to fix this problem" };
            }

        }

    })
}

export default Base;