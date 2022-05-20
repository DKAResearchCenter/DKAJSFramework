import Camera from "./Camera";
import Mikrotik from "./Mikrotik";
import Nfc from "./Nfc";
import Printer from "./Printer";
import RaspberryPi from "./RaspberryPi";

/**
 *
 * @type {{Mikrotik, Nfc, Camera, Printer: {Escpos: Escpos}, RaspberryPi: RaspberryPi}}
 */
const Hardware = {
    Camera : Camera,
    Mikrotik : Mikrotik,
    Nfc : Nfc,
    Printer : Printer,
    RaspberryPi : RaspberryPi
};

export default Hardware;