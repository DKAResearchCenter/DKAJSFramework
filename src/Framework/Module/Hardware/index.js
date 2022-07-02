import Camera from "./Camera";
import Nfc from "./Nfc";
import Printer from "./Printer";
import RaspberryPi from "./RaspberryPi";

/**
 *
 * @type {{Mikrotik, Nfc, Camera, Printer: {Escpos: Escpos}, RaspberryPi: RaspberryPi}}
 */
const Hardware = {
    Camera : Camera,
    Nfc : Nfc,
    Printer : Printer,
    RaspberryPi : RaspberryPi
};

export default Hardware;