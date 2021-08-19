import _ from "lodash";

class Location {

    config;

    constructor(config) {
        this.config = _.extend({
            geolocation : {
                options : null
            }
        }, config)
    }

    getCurrentPosition = function (callback, error, options = null) {
        navigator.geolocation.getCurrentPosition(callback, error, options);
    }

    watchPosition = function (callback, error, options) {
        navigator.geolocation.watchPosition(callback, error, options);
    }
}

export default Location;