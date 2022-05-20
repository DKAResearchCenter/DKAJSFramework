/** import module parent **/
/*import { Database, Server } from "./../";
import server from "./server";
import db from "./database"
import vpn from "./vpn";
import networking from "./Networking";
import timeManagement from "./timeManagement";
import ftp from "./ftp";
import pdf from "./pdf";*/
import usbDetection from "usb-detection";
import HID from "node-hid";

(async () => {


    usbDetection.startMonitoring();

    usbDetection.on('add', function (device) {
        console.log(`vendorId ${device.vendorId}, productId ${device.productId}`)
    });
    process.on("SIGINT", function (){
        usbDetection.stopMonitoring();
        console.log("berhenti");
        process.exit(0);
    })

    /*const testPromise = Promise.all([
        /!** server example from server.js class **!/
        server,
        /!*networking*!/
        /!** database example from database.js class **!/
        /!*vpn,*!/
        /!*ftp,*!/
        /!*db*!/
    ]);*/
    // Uses a blocking call, so is async
    // Uses a blocking call, so is async

    /*await testPromise
        .then(async (res) => {
            console.info(res);
        }).catch(async (err) => {
            console.error(err)
        });*/



})();