import adb from "./Adb";
import DHCP from "./DHCP";
import FTP from "./FTP";
import SerialPort from "./SerialPort";
import USB from "./USB";

const Networking = {
    adb : adb,
    DHCP : DHCP,
    FTP : FTP,
    SerialPort : SerialPort,
    USB : USB
};

export { adb, DHCP, FTP, SerialPort, USB };
export default Networking;