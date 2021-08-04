'use strict';
'use warning';

import path from "path";
import _ from "lodash";
import fs from "fs";

class JSONDB {

    constructor(options){
        /** Init This Options In The Class  **/
        this.options = _.extend({
            jsonfile : path.resolve(__dirname, "DB.json")
        }, options);
        /** End Of Init FUnction In The Class**/
        this.instanceDB = fs.readFileSync(this.options.jsonfile, {
            encoding : "utf8"
        });
    }

    /**
     *
     * @param {String} name
     */
    async addComponent(name) {

        await fs.open(this.options.jsonfile, 'r+', async (error, fd) => {
            const mReadFile = await fs.readFileSync(this.options.jsonfile, "utf8");
            let DB = JSON.parse(mReadFile);
            DB[name] = {};

            /** Decoder json data to Shrinkfy **/
            let DBEncode = JSON.stringify(DB, null, 2);
            await fs.writeFileSync(this.options.jsonfile, DBEncode);
            await fs.close(fd, (error) => {
                if (error) {
                    console.error("Stream Error")
                }
            })
        });


    }

    /**
     *
     * @param {String} name
     */
    async removeComponent(name) {
        await fs.open(this.options.jsonfile, 'r+', async (error, fd) => {
            const mReadFile = await fs.readFileSync(this.options.jsonfile, "utf8");
            let DB = JSON.parse(mReadFile);
            delete DB[name];

            /** Decoder json data to Shrinkfy **/
            let DBEncode = JSON.stringify(DB, null, 2);
            await fs.writeFileSync(this.options.jsonfile, DBEncode);
            await fs.close(fd, (error) => {
                if (error) {
                    console.error("Stream Error")
                }
            })
        });
    }



    ReadAll(){
        return JSON.parse(this.instanceDB);
    }

    /**
     *
     * @param {JSON} jsonStructur
     * @constructor
     */
    Insert(jsonStructur = {}){
        let data = fs.readFileSync(this.options.jsonfile, "utf8");
        let DB = JSON.parse(data);
        DB.push(jsonStructur);


        /** Decoder json data to Shrinkfy **/
        let DBEncode = JSON.stringify(DB);
            fs.writeFileSync(this.options.jsonfile, DBEncode)
    }

}

export default JSONDB;