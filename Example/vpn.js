import vpnManager from "node-openvpn";


const vpn = new Promise(async (resolve, rejected) => {
    const opts = {
        host: '219.100.37.208', // normally '127.0.0.1', will default to if undefined
        port: 1723, //port openvpn management console
        timeout: 1500, //timeout for connection - optional, will default to 1500ms if undefined
        logpath: 'log.txt' //optional write openvpn console output to file, can be relative path or absolute
    };

    const auth = {
        user: 'vpnbook',
        pass: '88wxtet',
    };
    const openvpn = vpnManager.connect(opts)

// will be emited on successful interfacing with openvpn instance
    openvpn.on('connected', () => {
        vpnManager.authorize(auth).then(async (res) => {
            console.log(`autorize : ${res}`)
        })
        resolve({'msg' : "connected"})
    });

// emits console output of openvpn instance as a string
    openvpn.on('console-output', output => {
        console.log(`output ${output}`)
    });

// emits console output of openvpn state as a array
    openvpn.on('state-change', state => {
        console.log(`state ${state}`)
    });

// emits console output of openvpn state as a string
    openvpn.on('error', error => {
        console.log(`error : ${error}`)
    });

    openvpn.on('disconnected', () => {
        // finally destroy the disconnected manager
        vpnManager.destroy()
    });
})

export default vpn;