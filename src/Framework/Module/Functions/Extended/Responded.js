import _ from "lodash";


function Responded(config) {
    this.config = _.extend({
        status : 200,
        msg : null
    }, config);

    return this.config;
}

export default Responded;