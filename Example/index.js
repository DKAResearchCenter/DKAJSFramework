/** import module parent **/
import { Database, Server } from "./../";
import server from "./server";
import db from "./database"

(async () => {
    /** server example from server.js class **/
    await server();
    /** database example from database.js class **/
    await db();

})();