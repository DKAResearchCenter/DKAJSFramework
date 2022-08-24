'use strict';
'use warning';
import Options from "./../Options";
import path from "path";
import fs from "fs";

/**
 * @namespace Config
 * @type {{SecretConfig: {SignSecret: string, EncryptSecret: string}, Networking: {DHCP: {broadcast: string, router: string, static: [{hostname: string, mac_address: string, ip_address: string}], netmask: string, dns: string[], range: string[], on_commit: string, interface: string, network: string}}, Server: Object, Database: {NeDB: {inMemoryOnly: boolean, filename: string, timestampData: boolean, afterSerialization: (function(*): *), beforeDeserialization: (function(*): *), dbName: string, autoload: boolean}, MariaDB: {debug: boolean, compress: boolean, timezone: string, autoBackup: boolean, password: string, database: string, connectionLimit: number, encryption: {secretKey: string, engine: string, options: {data: boolean, column: boolean, table: boolean}, alg: string, enabled: boolean}, engine: number, port: number, host: string, lang: string, user: string}}, Hardware: {Printer: {Escpos: {settings: {usb: {productId: undefined, vendorId: undefined}, serial: {settings: undefined, port: string}, monitoring: boolean, network: {port: number, ipAddress: string}}, copyright: {banner: string, description: string, enabled: boolean}, options: {encoding: string}, type: number}}}, FirebaseConfig: {storageBucket: string, apiKey: string, messagingSenderId: string, appId: string, projectId: string, measurementId: string, databaseURL: string, authDomain: string}, Global: Object}}
 */

const Config = {
    /**
     * @type { Object }
     * @description The Global Configuration For All Module
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
          interface: 'Ethernet',
          range: [
              "192.168.3.10", "192.168.3.99"
          ],
          static: [
              {
                  hostname: 'host1',
                  mac_address: 'xx:xx:xx:xx:xx:xx',
                  ip_address: '192.168.3.2'
              }
          ],
          network: '192.168.3.0',
          netmask: '255.255.255.0',
          router: '192.168.3.1',        // can be string or array
          dns: ["8.8.8.8", "8.8.4.4"],  // can be string or array
          broadcast: '192.168.3.255',
          on_commit: `
                        //set your script here
                        set ClientIP = binary-to-ascii(10, 8, ".", leased-address);
                        execute("/usr/bin/curl", concat("http://localhost/check-ip?ip=", ClientIP));
                     `
      }
    },
    Database : {
        MariaDB : {
            engine : Options.MARIADB_POOL,
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
    /**
     * @namespace Config.Server
     * @memberOf Config
     * @description the server
     */
    Server : {
        /**
         * @memberOf Config.Server
         * @description The Server Name For Your Project
         */
        serverName : (fs.existsSync(path.join(process.cwd(), 'package.json'))) ? require(path.join(process.cwd(),'package.json')).name : null,
        /**
         * @memberOf Config.Server
         * @type { Boolean | String }
         * @description For Set server Domain
         * @default false
         * @author Yovangga Anandhika
         * @example
         * serverDomain : "https://localhost
         */
        serverDomain : false,
        /** Server State Overide Enable and Disabled
         * @memberOf Config.Server
         * @type { Boolean }
         * @description - Disable Or Enabled Project Runtime Load
         * @default true
         * **/
        serverEnabled : true,
        /**
         * @memberOf Config.Server
         * @type { Number }
         * @description The Selected Engine For The Project
         * <ul style="list-style: none;">
         *  <li> serverEngine : Options.HTTP2_CORE_ENGINE
         *  <li> serverEngine : Options.HTTP2_CORE_ENGINE
         *  <li> serverEngine : Options.EXPRESS_CORE_ENGINE
         *  <li style="color : red;"> serverEngine : Options.FASTIFY_CORE_ENGINE [ Default]
         *  <li> serverEngine : Options.RESTIFY_CORE_ENGINE
         *  <li> serverEngine : Options.REACTJS_CORE_ENGINE
         *  <li> serverEngine : Options.SOCKETIO_CORE_ENGINE
         * </ul>
         */
        serverEngine : Options.FASTIFY_CORE_ENGINE,
        /** Untuk melakukan Set View Template View Di Dalam Framework **/
        serverView : Options.VIEW_POV_EJS,
        /** State Server {Server.SERVER_STATE_DEVELOPMENT | Server.SERVER_STATE_PRODUCTION }
         * @memberOf Config.Server
         * @type { "dev" | "prod" }
         * @description The ServerState Debug or Production
         *
         * <ul style="list-style: none;">
         *  <li> serverState : Server.SERVER_STATE_DEVELOPMENT
         *  <li> serverState : Server.SERVER_STATE_PRODUCTION
         * </ul>
         * **/
        serverState : Options.SERVER_STATE_DEVELOPMENT,
        /** Server Domain Location **/
        serverHost : "localhost",
        /** Server Port **/
        serverPort : 80,
        /** Activated Https 2 Version **/
        http2 : false,
        /** Activated Security System **/
        secure : false,
        /** Memulai System App Controller
         * @memberOf Config.Server
         *
         * **/
        app : false,
        /** Setting System Settings **/
        settings : {
            reactOpen : true,
            reactHot : true,
            reactCompress : false,
            firewall : [],
            exclusive : false,
            /** Ngrok Tunneling **/
            ngrok : {
                enabled : false,
                authToken : null
            },
            localtunnel : false,
            secretKey : "Cyberhack2010Yovangga@nandhika2021",
            pingTimeout : 2000,
            pingInterval : 1000,
            connectTimeout : 2000,
            perMessageDeflate : false,
            timeout : 5000,
            getTimeInterval : null,
            autoSetTime : undefined,
            maxListeners : 100,
            cors: {
                origin: '*',
            }
        },
        library : {
            socketIo : {
                /*rememberTransport: false,
                transports: ['WebSocket', 'Flash Socket', 'AJAX long-polling'],
                pingTimeout : 3000,
                pingInterval : 1000,*/
                perMessageDeflate : false,
                cors: {
                    origin: '*',
                }
            }
        },
        plugin : {
            FastifySocketIO : {
              enabled : true,
              options : {
                  /*rememberTransport: false,
                  transports: ['WebSocket', 'Flash Socket', 'AJAX long-polling'],
                  pingTimeout : 3000,
                  pingInterval : 1000,*/
                  perMessageDeflate : false,
                  cors: {
                      origin: '*',
                  }
              }
            },
            FastifyMultipart : {
                enabled : false,
                options : {

                }
            },
            FastifyCookie : {
                enabled : true,
                options : {

                }
            },
            FastifyPointOfView : {
              enabled : false,
              options : {

              }
            },
            FastifyCors : {
                enabled : false,
                options : {
                    origin : '*'
                }
            },
            FastifyRateLimit : {
              enabled : false,
              options :  {
                  global : true,
                  max: 1000,
                  timeWindow: '1 minute'
              }
            },
            FastifyGracefulShutdown : {
                enabled : false,
                options : {}
            },
            FastifyLog : {
                enabled : false,
                options : {

                }
            },
            FastifyFormBody : {
                enabled : true,
                options : {

                }
            },
            FastifyHelmet : {
                enabled : false,
                options : {
                    contentSecurityPolicy: false
                }
            },
            FastifyJwt : {
                enabled : false,
                options : {

                }
            },
            FastifyCompress : {
                enabled : false,
                options : {
                    global : true
                }
            }
        },
        Webpack : {
            mode: "development",
            module: {
                rules: [
                    {
                        test: /\.(js|jsx)$/,
                        exclude: /node_modules/,
                        use: {
                            loader: "babel-loader",
                            options: {
                                presets: ['@babel/preset-env','@babel/preset-react'],
                                plugins: [
                                    "@babel/plugin-proposal-class-properties",
                                    "@babel/plugin-transform-arrow-functions"
                                ]
                            }
                        },
                    },
                    {
                        test: /\.css$/i,
                        use: ["style-loader", "css-loader"],
                    },
                    {
                        test: /\.(png|jpe?g|gif|svg)$/i,
                        use: [
                            {
                                loader: 'file-loader',
                            },
                            {
                                loader: 'img-loader'
                            }
                        ],
                    },
                ],
            },
            resolve: {
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
            },
            target: 'web'
        },
        /** Fungsi Untuk Melakukan Asset Delarasion Untuk Menentukan Folder Asets Di Dalam System Data **/
        options : {
            /** Deklarasi Menetapkan Lokasi Assets CSS dan JS Dir Dan Gambar Untuk Aplikasi **/
            layoutDir : path.join(require.main.filename,"./../Layout"),
            assetsDir : path.join(require.main.filename, "./../Assets"),
            publicDir : path.join(require.main.filename, "./../Public"),
            appDir : path.join(require.main.filename, "./../Controller"),
            srcDir : path.join(require.main.filename, "./../../src"),
            distDir : path.join(require.main.filename, "./../../dist"),
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
                copyright : {
                    enabled : false,
                    banner : `DKA Framework Engine V.${require("./../../../../package.json").version}`,
                    description : `${require("./../../../../package.json").description}`
                },
                settings: {
                    monitoring : true,
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