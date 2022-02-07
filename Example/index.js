/** import module parent **/
import { Database, Server } from "./../";

(async () => {
    await Server({
        serverPort : 1999,
        app : false
    }).then(async (result) => {
        console.info(result)
    }).catch(async (error) => {
        console.error(error)
    })
})();