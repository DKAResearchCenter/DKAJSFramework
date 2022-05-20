

export default {
    Database : {
        MariaDB : {
            engine : 1,
            host : "localhost",
            user : "root",
            password : "",
            database : "test",
            compress : true,
            port : 3306,
            connectionLimit : 2,
            timezone : '+08:00',
            autoBackup : false,
            lang : "id",
            debug: false,
            encryption : {
                enabled : false,
                secretKey : "Cyberhack2010",
                options : {
                    table : false,
                    column : false,
                    data : false
                }
            }
        }
    }
}