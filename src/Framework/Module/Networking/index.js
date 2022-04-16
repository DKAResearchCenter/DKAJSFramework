import adb from "./Adb";
import DHCP from "./DHCP";
import FTP from "./FTP";

const Networking = {
    adb : adb,
    DHCP : DHCP,
    FTP : FTP
};

export { adb, DHCP, FTP};
export default Networking;