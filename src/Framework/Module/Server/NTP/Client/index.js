import _ from "lodash"
const Client = async (config) => {
    let { Client } = require("ntp-time");
    return new Client(config.serverHost, config.serverPort, _.merge({ timeout : 2000 }, config.settings));
};

export default Client;