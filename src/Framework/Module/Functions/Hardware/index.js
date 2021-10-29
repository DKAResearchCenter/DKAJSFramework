'use strict';
'use warnings';
import RaspberryPi from "./RaspberryPi";
import Printer from "./Printer";
import Rfid from "./Rfid";

const Hardware = {
    RaspberryPi : RaspberryPi,
    Printer : Printer,
    Rfid : Rfid
};


export default Hardware;
export { RaspberryPi, Printer, Rfid }