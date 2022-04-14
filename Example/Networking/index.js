import fs from "fs"
import path from "path";
import { Database, Networking } from "./../../";

const networking = new Promise(async (resolve, rejected) => {
    /*const USB = new Networking.USB();
    resolve(USB.getUSBList[0].deviceDescriptor)*/
    const DHCPServer = new Networking.DHCP.Server()
        .then(async () => {
            resolve('berhasil')
        }).catch(async (e) => {
            rejected(e)
        })
});

export default networking;