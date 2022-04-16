import _ from "lodash";
import avrGirl from "avrgirl-arduino";

class Arduino {

    static get ENGINE_JHONNYFIVE(){
        return 1;
    }
    static get ENGINE_AVRGIRL(){
        return 2;
    }

    constructor(config) {
        this.config = _.extend({
            engine : Arduino.ENGINE_JHONNYFIVE
        }, config);

        switch (this.config.engine) {
            case Arduino.ENGINE_JHONNYFIVE :
                //this.engineInstance = new Board();
                break;
            default :
               // this.engineInstance = new Board();
                break;
        }
    }



}

export default Arduino;