'use strict';
'use warning';

import Sessions from "./Sessions";
import AntiVirus from "./AntiVirus";
import Upload from "./Upload"
import Extend from "./Extended";
import Networking from "./Networking";
import Multimedia from "./Multimedia";
import TimeManagement from "./TimeManagement";
import File from "./File";

const Functions = {
    Sessions : Sessions,
    AntiVirus : AntiVirus,
    Upload : Upload,
    Extend : Extend,
    Networking : Networking,
    Multimedia : Multimedia,
    File : File,
    TimeManagement : TimeManagement
    /*Cookies : Cookies*/
};

export default Functions;
export {Sessions, AntiVirus, Upload, Extend, Networking, Multimedia, File, TimeManagement };