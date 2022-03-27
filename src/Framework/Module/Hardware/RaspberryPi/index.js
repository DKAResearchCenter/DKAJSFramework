'use warnings';
'use strict';

import _ from "lodash";
import { Board, Led, Relay } from "johnny-five";

class RaspberryPi {

    static get ENGINE_JHONNYFIVE(){
        return 1;
    }

    constructor(config) {
        this.config = _.extend({
            engine : RaspberryPi.ENGINE_JHONNYFIVE
        }, config);

        switch (this.config.engine) {
            case RaspberryPi.ENGINE_JHONNYFIVE :
                this.engineInstance = new Board();
                break;
            default :
                this.engineInstance = new Board();
                break;
        }
    }
}

export default RaspberryPi;