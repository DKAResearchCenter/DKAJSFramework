'use strict';
'use warning';

import Routing from "./Global/Routing.config";
import Server from "./Global/Server.config";

var Config = {
    Routing : Routing,
    Server : Server
};


export default Config;
export {Routing, Server};