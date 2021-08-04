'use strict';
'use warning';

import Sessions from "./Sessions";
import Encryption from "./Encryption";
import AntiVirus from "./AntiVirus";
import Upload from "./Upload"
import Extend from "./Extended";
import Hardware from "./Hardware";
import Networking from "./Networking";

const Functions = {
    Sessions : Sessions,
    Encryption : Encryption,
    AntiVirus : AntiVirus,
    Upload : Upload,
    Extend : Extend,
    Hardware : Hardware,
    Networking : Networking
    /*Cookies : Cookies*/
};

export default Functions;
export {Sessions, Encryption, AntiVirus, Upload, Extend, Hardware, Networking };