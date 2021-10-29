import _ from "lodash";
import path from "path";
import mftp from "ftp";
import fs from "fs";
import {Base64Encode} from "base64-stream"

class ftp {

    buffers = [];
    /**
     *
     * @param config
     */
    constructor(config) {
        this.config = _.extend({
            host: "127.0.0.1",
            user : "",
            password : "",
            connTimeout : 2000,
            keepalive : 1000,
            port : 21,
            secure : false
        }, config);

        this.Instance = new mftp();
        this.Instance.connect(this.config);

    }

    Upload = async(files, destFile) =>
        new Promise(async (resolve, rejected) => {
            this.Instance.on('ready', async () => {
                this.Instance.put(files, destFile, async (err) => {
                    if (!err) {
                        this.ReturnData = {
                            status : true,
                            msg : `Berhasil Upload Data ${files}`
                        }
                        await resolve(this.ReturnData);
                    }else{
                        this.ReturnData = {
                            status : true,
                            msg : `Gagal Upload Data ${files}`,
                            error : err
                        }
                        await rejected(this.ReturnData);
                        await this.Instance.end()
                    }
                })
            })
        });

    Get = async(files, settings) =>
        new Promise(async (resolve, rejected) => {
            this.GetSettings = _.extend({
                saveFile : true,
                convertToBase64 : false,
                targetDir : "/",
                compressed : false
            }, settings)
            try {
                this.Instance.on('ready', async () => {
                    this.Instance.get(files, this.GetSettings.compressed,async(err, stream) => {
                        if (!err){

                            this.ReturnData = {
                                status : true,
                                msg : `Berhasil Mendapatkan Data ${files}`,
                                data : {

                                }
                            }

                            if (this.GetSettings.saveFile){
                                await stream.pipe(fs.createWriteStream(this.GetSettings.targetDir));
                            }


                            //const mb = new Base64Encode()
                            this.buffers = [];
                            await stream.on('data', async (chunk) => {
                                if (this.GetSettings.convertToBase64){
                                    this.buffers.push(chunk);
                                }
                            });

                            await stream.on('finish', async () => {
                                if (this.GetSettings.convertToBase64){
                                    const mb = Buffer.concat(this.buffers);
                                    this.ReturnData.data.base64 = mb.toString('base64');
                                }
                                await resolve(this.ReturnData);
                            });

                            await stream.once('close', async () => {
                                await this.Instance.end();
                            });
                            // Getting Error
                            await stream.once('error', async (err) => {
                                this.ReturnData = {
                                    status : true,
                                    msg : `Terjadi Error`,
                                    error : err
                                }
                                await rejected(this.ReturnData);
                                await this.Instance.end();
                            });
                        }else{
                            this.ReturnData = {
                                status : true,
                                msg : `Gagal Mendapatkan Data ${files}`,
                                error : err
                            }
                            await rejected(this.ReturnData);
                            await this.Instance.end()
                        }
                    })
                });
            }catch (e){
                this.ReturnData = {
                    status : true,
                    msg : `Terjadi Error`,
                    error : e
                }
                await rejected(this.ReturnData);
                await this.Instance.end();
            }
        });
}

export default ftp;