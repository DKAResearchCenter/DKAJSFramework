import { Database, Server, Options } from "./../";

const db = new Promise(async (resolve, rejected) => {
    await new Database.MariaDB({
        engine : Options.MARIADB_POOL,
        host : "127.0.0.1",
        user : "root",
        password : "",
        database : "test"
    }).Read(`test_table`, { /** **/ })
        .then(async (rows) => {
            await resolve(rows);
        }).catch(async (exeception) => {
            //console.error(exeception)
            await rejected(exeception);
        })
})

export default db;