import moment from "moment-timezone"
const Server = async (config) => await new Promise(async (resolve) => {
    let { Server } = require("ntp-time");
    moment.locale("id");
    let mServerNTP = new Server();
    mServerNTP.handle(async (message, response) => {
        message.data = "tes"
        message.originateTimestamp = moment().unix();
        await response(message);
    });
    await resolve(mServerNTP);
});

export default Server;