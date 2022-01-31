'use strict';
'use warning';
import {Security} from "./../index.module.d";
import Options from "./../Options";
import crypto from "crypto";
import path from "path";

const ALGORITHM = 'aes-256-cbc'
const BLOCK_SIZE = 16
const KEY_SIZE = 32
const key = crypto.randomBytes(KEY_SIZE)



const Config = {
    /**
     * @param {Object} Global
     */
    Global : {
        keySecret : "Cyberhack2010Yovangga1997dkaframework"
    },
    FirebaseConfig : {
        apiKey: "AIzaSyCFV8E2Hi2b0ru6L_dwaUdZljeu1MXRunc",
        authDomain: "dka-apis.firebaseapp.com",
        databaseURL: "https://dka-apis-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "dka-apis",
        storageBucket: "dka-apis.appspot.com",
        messagingSenderId: "797501409741",
        appId: "1:797501409741:web:85c5ecd5a69e4a81bc5c84",
        measurementId: "G-1MT7ZM6VKT"
    },
    Networking : {
      DHCP : {
          autoListen : false,
          range: [
              "192.168.1.2", "192.168.1.253"
          ],
          forceOptions: ['hostname'], // Options that need to be sent, even if they were not requested
          randomIP: true, // Get random new IP from pool instead of keeping one ip
          static: {
              "11:22:33:44:55:66": "192.168.1.100"
          },
          // Option settings (there are MUCH more)
          netmask: '255.255.255.0',
          router: [
              '192.168.1.1'
          ],
          dns: ["192.168.1.1", "8.8.8.8"],
          hostname: "dkaframework",
          broadcast: '192.168.1.255',
          server: '192.168.1.1',
      }
    },
    Database : {
        MariaDB : {
            engine : Options.MARIADB_POOL,
            host : "localhost",
            user : "root",
            password : "",
            database : "test",
            compress : false,
            port : 3306,
            connectionLimit : 2,
            timezone : '+08:00',
            autoBackup : false,
            lang : "id",
            debug: false,
            encryption : {
                enabled : false,
                engine : Options.ENCRYPTION_ENGINE_CRYPTO,
                alg : Options.ALGORITHM_AES_256_GCM,
                secretKey : "Cyberhack2010",
                options : {
                    table : false,
                    column : false,
                    data : false
                }
            }
        },
        NeDB : {
            dbName : "default.db",
            filename : path.join(process.cwd(),`./Database.db`),
            inMemoryOnly : false,
            timestampData : false,
            autoload : false,
            afterSerialization : function (document) {
                return document
            },
            beforeDeserialization : function (encryptionText) {
                return encryptionText
            }
        }
    },
    Server : {
        /** ServerName For Naming App Server **/
        serverName : "Unknown",
        /** Server Domain For Naming Service Domain Access **/
        serverDomain : false,
        /** Server State Overide Enable and Disabled **/
        serverEnabled : true,
        /** Memilih Jenis Server Engine Yang Ingin Digunakan **/
        serverEngine : Options.FASTIFY_CORE_ENGINE,
        /** Untuk melakukan Set View Template View Di Dalam Framework **/
        serverView : Options.VIEW_POV_EJS,
        /** State Server {Server.SERVER_STATE_DEVELOPMENT | Server.SERVER_STATE_PRODUCTION } **/
        serverState : Options.SERVER_STATE_DEVELOPMENT,
        /** Server Domain Location **/
        serverHost : "localhost",
        /** Server Port **/
        serverPort : 80,
        /** Activated Https 2 Version **/
        http2 : false,
        /** Activated Security System **/
        secure : false,
        /** Memulai System App Controller **/
        app : false,
        /** Setting System Settings **/
        settings : {
            firewall : [],
            /** Ngrok Tunneling **/
            ngrok : {
                enabled : false,
                authToken : null
            },
            localtunnel : false,
            secretKey : "Cyberhack2010Yovangga@nandhika2021"
        },
        library : {
            socketIo : {
                /*rememberTransport: false,
                transports: ['WebSocket', 'Flash Socket', 'AJAX long-polling'],
                pingTimeout : 3000,
                pingInterval : 1000,*/
                cors: {
                    origin: '*',
                }
            }
        },
        plugin : {
            FastifyGracefulShutdown : true,
            FastifyLog : {
                enabled : true,
                options : {}
            },
            FastifyHelmet : {
                enabled : true,
                options : {
                    contentSecurityPolicy: false
                }
            },
            FastifyCompress : {
                enabled : false,
                options : {
                    global : true
                }
            }
        },
        /** Fungsi Untuk Melakukan Asset Delarasion Untuk Menentukan Folder Asets Di Dalam System Data **/
        options : {
            /** Deklarasi Menetapkan Lokasi Assets CSS dan JS Dir Dan Gambar Untuk Aplikasi **/
            layoutDir : path.join(require.main.filename,"./../Layout"),
            assetsDir : path.join(require.main.filename, "./../Assets"),
            appDir : path.join(require.main.filename, "./../Controller"),
            /** Fungsi Untuk Melakukan Folder Upload Di dalam aplikasi **/
            autoloadDir : path.join(require.main.filename, "./../App"),
            uploadDir : path.join(require.main.filename, "./../Upload"),
            backupDir : path.join(require.main.filename, "./../Backup")
            /** End Function For data Configuration **/

        }
    },
    Hardware : {
        Printer : {
            Escpos : {
                type: Options.ESCPOS_TYPE_USB,
                settings: {
                    usb: {
                        vendorId: undefined,
                        productId: undefined,
                    },
                    network: {
                        ipAddress: "localhost",
                        port: 9100
                    },
                    serial: {
                        port: "COM3",
                        settings: undefined
                    }
                },
                options: {
                    encoding: "GB18030"
                }
            }
        }
    },
    SecretConfig : {
        SignSecret : "Cyberhack2010",
        EncryptSecret : "dhikaanandhika"
    }
};


export default Config;
export {Config};