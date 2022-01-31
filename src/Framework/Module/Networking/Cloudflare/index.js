import cloudflare from "cloudflare";

class Cloudflare {

    constructor(config) {
        this.cloudflareInstance = cloudflare({

        });

        this.cloudflareInstance.zones.read("").then()
    }
}