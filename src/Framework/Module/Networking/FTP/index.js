import _ from "lodash";
import path from "path";
import fs from "fs";
import ftp from "ftp";

class FTP {

    mBuffer = [];
    static get FTP_NATIVE() {
        return "FTP_NATIVE"
    }
    /**
     *
     * @param {Object} config
     * @param {String} config.host
     * @param {String} config.user
     * @param {Number} config.port
     * @param {String} config.password
     * @param {'basic'} config.logging
     */
    constructor(config) {
        this.config = _.merge({
            engine : FTP.FTP_NATIVE,
            host: 'localhost',
            port: 22,
            user: 'anonymous',
            password: 'anonymous@',
            logging : "basic",
            compressed : false,
        }, config);

        /*this.FtpInterface =  new ftp(this.config, {
            logging : this.config.logging
        })*/
        switch (this.config.engine){
            case FTP.FTP_NATIVE :
                this.FtpInterface = new ftp();
                break;
            default :

        }

    };

    /**
     *
     * @param {String} files
     * @param {String} destination
     * @returns {Promise<void>}
     */
    upload = async (files, destination = null) => {
        let mFinalDestionation = null;
        return await new Promise(async (resolve, reject) => {
            let getInformationPath = path.parse(files);
            let checkRootFilesInput = (getInformationPath.root === '') ?
                path.join(require.main.filename, `./../${files}`) : files;
            if (fs.existsSync(checkRootFilesInput)){
                mFinalDestionation = (destination !== null) ? destination : `${getInformationPath.name}${getInformationPath.ext}`;
                await this.FtpInterface.on('ready', async () => {
                    await this.FtpInterface.put(checkRootFilesInput, mFinalDestionation, this.config.compressed, async (err) => {
                        if (!err){
                            await resolve({ status : true, msg : "success for upload files", metadata : getInformationPath});
                            await this.FtpInterface.end();
                        }else{
                            await reject({ status : false, msg : "Error to Upload File", error : err});
                            await this.FtpInterface.end();
                        }
                    });
                });
                this.FtpInterface.connect(this.config);

            }else{
                reject({ status : false, msg : "File Upload Not Exist", metadata : getInformationPath})
            }

        });
    };

    /**
     *
     * @param {String} files
     * @param {Object} options
     * @param {Boolean} options.saveFile
     * @param {Boolean} options.convertToBase64
     * @returns {Promise<{}>}
     */
    download = async (files, options = {}) => {
        let mOptions = _.merge({
            saveFile : true,
            convertToBase64 : false,
            withProgress : false,
            targetDir : path.join(require.main.filename,"./../")
        }, options)
        return new Promise(async (resolve, rejected) => {
            await this.FtpInterface.on("ready", async () => {
                await this.FtpInterface.get(files,this.config.compressed, async (err, stream) => {
                    if (!err){
                        this.returnValue = {
                            status : true,
                            msg : `successfully to get data`,
                            data : {
                                saveDir : path.join(mOptions.targetDir, files)
                            }};
                        this.mBuffer = [];
                        await stream.on('data', async (data) => {
                            await this.mBuffer.push(data);
                        })

                        if (mOptions.saveFile){
                            await stream.pipe(fs.createWriteStream(path.join(mOptions.targetDir, files)));
                        }

                        await stream.once("finish", async () => {
                            if (mOptions.convertToBase64){
                                const mb = Buffer.concat(this.mBuffer);
                                this.returnValue.data.base64 = await mb.toString('base64')
                                resolve(this.returnValue);
                            }else{
                                resolve(this.returnValue);
                            }
                        });

                        await stream.once('error', async (err) => {

                            rejected({ status : false, msg : `error stream`, error : err});
                        });
                    }else{
                        rejected({ status : false, msg : `Error for get files from ftp server`, error : err});
                    }
                })
            });

            this.FtpInterface.connect(this.config);
        })
    }

}

export default FTP;