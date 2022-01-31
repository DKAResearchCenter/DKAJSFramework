import dhcp from "dhcp";
import _ from "lodash";

class Server {

    constructor(config) {
        this.config = _.merge(DKA.config.Networking.DHCP, config);
        this.DhcpInstance = dhcp.createServer(this.config)
    }


}

export default Server;