import defaultGateway from "default-gateway";

const IP = {
    getGateway : async() => {
        return defaultGateway.v4();
    }
}

export default IP;