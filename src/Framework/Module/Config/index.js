'use strict';
'use warning';
import Options from "./../Options";
import path from "path";
import fs from "fs";

/**
 *
 * @type {
 *  { SecretConfig : { SignSecret: string, EncryptSecret: string}, Networking: {DHCP: {broadcast: string, router: string, static: [{hostname: string, mac_address: string, ip_address: string}], netmask: string, dns: string[], range: string[], on_commit: string, interface: string, network: string}}, Server: {app: boolean, settings: {localtunnel: boolean, reactCompress: boolean, reactHot: boolean, secretKey: string, firewall: *[], ngrok: {authToken: null, enabled: boolean}, reactOpen: boolean}, serverView: number, serverEngine: number, serverName, serverPort: number, secure: boolean, serverHost: string, serverEnabled: boolean, serverState: string, library: {socketIo: {httpCompression: {chunkSize: number, threshold: number, memLevel: number, windowBits: number}, cors: {origin: string}, perMessageDeflate: {serverNoContextTakeover: boolean, zlibDeflateOptions: {chunkSize: number}, clientNoContextTakeover: boolean, threshold: number, concurrencyLimit: number, zlibInflateOptions: {memLevel: number, windowBits: number}, serverMaxWindowBits: number}}}, plugin: {FastifyGracefulShutdown: boolean, FastifyLog: {options: {}, enabled: boolean}, FastifyHelmet: {options: {contentSecurityPolicy: boolean}, enabled: boolean}, FastifyCompress: {options: {global: boolean}, enabled: boolean}}, options: {layoutDir: string, distDir: string, backupDir: string, autoloadDir: string, uploadDir: string, appDir: string, srcDir: string, assetsDir: string, publicDir: string}, serverDomain: boolean, http2: boolean, Webpack: {mode: string, resolve: {extensions: string[]}, module: {rules: [{test: RegExp, use: {loader: string, options: {presets: string[], plugins: string[]}}, exclude: RegExp},{test: RegExp, use: string[]},{test: RegExp, use: [{loader: string},{loader: string}]}]}, target: string}}, Database: {NeDB: {inMemoryOnly: boolean, filename: string, timestampData: boolean, afterSerialization: (function(*): *), beforeDeserialization: (function(*): *), dbName: string, autoload: boolean}, MariaDB: {debug: boolean, compress: boolean, timezone: string, autoBackup: boolean, password: string, database: string, connectionLimit: number, encryption: {secretKey: string, engine: string, options: {data: boolean, column: boolean, table: boolean}, alg: string, enabled: boolean}, engine: number, port: number, bigIntAsNumber: boolean, host: string, lang: string, user: string}}, Hardware: {Printer: {Escpos: {settings: {usb: {productId: undefined, vendorId: undefined}, serial: {settings: undefined, port: string}, network: {port: number, ipAddress: string}}, options: {encoding: string}, type: number}}}, FirebaseConfig: {storageBucket: string, apiKey: string, messagingSenderId: string, appId: string, projectId: string, measurementId: string, databaseURL: string, authDomain: string}, Global: {keySecret: string}}}
 */
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
    Server : {
        /** ServerName For Naming App Server **/
        serverName : (fs.existsSync(path.join(process.cwd(), 'package.json'))) ? require(path.join(process.cwd(),'package.json')).name : null,
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
            reactOpen : true,
            reactHot : true,
            reactCompress : true,
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
                enabled : true,
                options : {

                }
            },
            FastifyCookie : {
                enabled : true,
                options : {

                }
            },
            FastifyPointOfView : {
              enabled : true,
              options : {

              }
            },
            FastifyCors : {
                enabled : true,
                options : {
                    origin : '*'
                }
            },
            FastifyRateLimit : {
              enabled : true,
              options : {

              }
            },
            FastifyGracefulShutdown : {
                enabled : false,
                options : {}
            },
            FastifyLog : {
                enabled : true,
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