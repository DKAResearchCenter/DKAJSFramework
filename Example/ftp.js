import fs from "fs"
import path from "path";
import { Database, Networking } from "./../";


const ftp = new Promise(async (resolve, rejected) => {

    const mFtp = await new Networking.FTP({
        host : "192.168.72.253",
        user : "tuza",
        password : "Tuza2021",
        port : 22
    });

    mFtp
        .download("1261645872777.jpg",{
            convertToBase64 : false,
        })
        .then(async (res) => {
            resolve(res)
        })
        .catch(async (err) => {
            rejected(err)
        })
        /*.upload("./test.exe")
        .then(async (res) => {
            resolve(res);
        }).catch(async (err) => {
            rejected(err)
        })*/
});
export default ftp;