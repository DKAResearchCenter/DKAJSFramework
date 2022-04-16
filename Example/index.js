/** import module parent **/
import { Database, Server } from "./../";
import server from "./server";
import db from "./database"
import vpn from "./vpn";
import networking from "./Networking";
import ftp from "./ftp";

(async () => {
    const testPromise = Promise.all([
        /** server example from server.js class **/
        server,
        /*networking*/
        /** database example from database.js class **/
        /*vpn,*/
        /*ftp,*/
        /*db*/
    ]);

    await testPromise
        .then(async (res) => {
            console.info(res);
        }).catch(async (err) => {
            console.error(err)
        });



})();