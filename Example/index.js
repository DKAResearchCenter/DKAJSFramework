/** import module parent **/
import { Database, Server } from "./../";
import server from "./server";
import db from "./database"

(async () => {
    const testPromise = Promise.all([
        /** server example from server.js class **/
        server,
        /** database example from database.js class **/
        /*db*/
    ]);

    await testPromise
        .then(async (res) => {
            console.info(res);
        }).catch(async (err) => {
            //console.error(err)
        })



})();