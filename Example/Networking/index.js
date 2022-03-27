import fs from "fs"
import path from "path";
import { Database, Networking } from "./../../";

const networking = new Promise(async (resolve, rejected) => {
    const USB = new Networking.USB();

    resolve(USB.getUSBList[0].deviceDescriptor)
});

export default networking;