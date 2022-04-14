import dhcp from "isc-dhcp-server";
import _ from "lodash";

class Server {

    /**
     *
     * @param config
     * @returns {Promise<String>}
     */
    constructor(config) {
        this.config = _.merge(DKA.config.Networking.DHCP, config);
        this.DhcpInstance = dhcp.createServer(this.config);
        return this.DhcpInstance.start();
    }



}

export default Server;