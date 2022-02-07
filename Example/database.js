import { Database, Server, Options } from "./../";

const db = async () => {

    await new Database.MariaDB({
        engine : Options.MARIADB_POOL,
        host : "127.0.0.1",
        user : "root",
        password : "",
        database : "test"
    }).Read(`test_table`, { /** **/ })
        .then(async (rows) => {
            console.info(rows)
        }).catch(async (exeception) => {
            console.error(exeception)
        })
};

export default db;