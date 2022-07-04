import proc, { fork, spawn, spawnSync, exec, execSync  } from "child_process";
import fs from "fs";
import electron from "electron";
import path from "path";

const ELECTRON = async (config) => await new Promise(async (resolve, rejected) =>{

        let electronChild = await proc.spawn(electron, [`${(config.app !== false) ? config.app : ""}`]);

        await electronChild.on("error", async (error) => {
                console.log(` `);
                console.error(error)
        });

        await electronChild.stdout.on("data", async(data) => {
                console.log(`DKA Electron Console Debug ....`)
        });

        await electronChild.stderr.on("data", async (data) => {
                console.log(`stderr ${data}`)
        });

        electronChild.on("close", async (code) => {
                process.exit(code);
        });
        await resolve(electronChild);
});

export default ELECTRON;