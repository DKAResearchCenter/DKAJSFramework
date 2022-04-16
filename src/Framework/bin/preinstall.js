#!/usr/bin/env node
const {execSync, exec} = require("child_process");
const path = require("path");
const fs = require('fs');

(async () => {
    await console.log("DKA : Install extended library");
    await execSync("yarn add serialport");
    process.exit(0);
})();