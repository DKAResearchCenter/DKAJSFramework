import adb from "./Adb";
import DHCP from "./DHCP";

const Networking = {
    adb : adb,
    DHCP : DHCP
};

export { adb, DHCP };
export default Networking;