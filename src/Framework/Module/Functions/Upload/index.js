'use strict';
'use warning';
import {createWriteStream, existsSync, writeFileSync} from "fs";
import _ from "lodash";
import {Server} from "./../../index.module.d"
import pump from "pump";

/**
 *
 */
class Upload {
    #options;

    constructor(options) {
        this.#options = _.extend({
            limits: {
                fieldNameSize: 100, // Max field name size in bytes
                fieldSize: 1000000, // Max field value size in bytes
                fields: 10,         // Max number of non-file fields
                fileSize: 100,      // For multipart forms, the max file size
                files: 1,           // Max number of file fields
                headerPairs: 2000   // Max number of header key=>value pairs
            }
        }, options);


    }

    /**
     * @param request
     * @returns {Promise<unknown>}
     * @constructor
     */
    Single = async(request) => {
        const AppName = Server.CONFIG.serverName.split(" ").join("");
        const uploadPath = Server.CONFIG.options.uploadDir;

        return new Promise ((resolve, rejected) => {
            if (existsSync(uploadPath)){
                try {
                    var data = {};

                    const requestBody = Object.keys(request.body)
                    requestBody.map( async (keys) => {
                        if (request.body[keys].file){
                            const RenameFiles = `${AppName}_${Date.now()}_${request.body[keys].filename}`;
                            await writeFileSync(`${uploadPath}/${RenameFiles}`, await request.body[keys].toBuffer());
                            data[keys] = RenameFiles
                        }else{
                            data[keys] = request.body[keys].value;
                        }
                    });

                    resolve({
                        status : true,
                        code : 200,
                        msg : "Berhasil",
                        data : data
                    });
                }catch (e) {
                    rejected({
                        status : false,
                        code : 500,
                        msg : "Error Detected. Tidak Ada Folder Upload Di temukan",
                        error : e
                    });
                }
            }else{
                rejected({
                    status : false,
                    code : 404,
                    msg : "Error Detected. Tidak Ada Folder Upload Di temukan"
                });
            }

        })
    }
}

export default Upload;