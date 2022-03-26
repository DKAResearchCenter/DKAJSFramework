const {createServer} = require("http");
const { Server } = require("socket.io");

const config = require("./../../Module/Config/index.js");

const io = (nodemonInst) => {
    const httpServer = createServer();
    const io = new Server(httpServer, {});

    io.on("connection", async (io) => {

        io.on("DKA_SERVER_RESTART", async (data) => {
            nodemonInst.restart();
        });
    });

    httpServer.listen(3333, "localhost");
    return httpServer;
}

module.exports = io;