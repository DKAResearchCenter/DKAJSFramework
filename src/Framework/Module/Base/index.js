import moment from "moment";
import { Security } from "./../../../../../JS";
import path from "path";
import { existsSync } from "fs";
import dotEnv from "dotenv";


const Base = async () =>
    new Promise(async (resolve, rejected) => {
        const rootProject = path.join(process.cwd());
        const envPath = path.resolve(rootProject, ".env");
        if (existsSync(envPath)){
            resolve(envPath);
        }else{
            rejected({ status : false, code : 500, msg : "file `.env` not exitst in Your Project"});
        }
    }).then(async (envPath) => {
        let returnValues = {};
        dotEnv.config({
            path : envPath
        });
        if (process.env.LICENCE_KEY !== undefined){
            const mEnc = new Security.Encryption.Crypto({
                secretKey : "@Thedarkangels2021"
            });
            const dec = mEnc.decodeIvSync(process.env.LICENCE_KEY);

            if ((typeof dec) !== 'string'){
                //returnValues = { status : true, code : 200, data : dec};
                const timeExpires = moment.unix(dec.expireDate).format('DD-MM-YYYY');
                const timeNowToUnix = moment(Date.now()).unix()
                const timeExpToUnix = moment(timeExpires,'DD-MM-YYYY').unix();

                const diffTime = (timeExpToUnix - timeNowToUnix)

                dec.time = {
                    dateNow : moment(Date.now()).format('DD-MM-YYYY'),
                    dateExp : moment.unix(timeExpToUnix).format("DD-MM-YYYY")
                }
                if (diffTime > 1) {
                    returnValues = { status : true, code : 200, data : dec, msg : "your Licence Has Activated"};
                }else{
                    returnValues = { status : false, code : 403, data : dec, msg : "your Licence Has Expires"};
                }

            }else{
                returnValues = { status : false, code : 500, msg : "Your Licence Not Identifing or Wrong "};
            }

        }else{
            returnValues = { status : false, code : 500, msg : "variable `LICENCE_KEY` not Exist "};
        }
        return returnValues;
    })

export default Base;