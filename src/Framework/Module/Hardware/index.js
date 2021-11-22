'use strict';
'use warnings';
import RaspberryPi from "./RaspberryPi";
import Printer from "./Printer";

const Hardware = {
    RaspberryPi : RaspberryPi,
    Printer : Printer,
};


export default Hardware;
export { RaspberryPi, Printer }