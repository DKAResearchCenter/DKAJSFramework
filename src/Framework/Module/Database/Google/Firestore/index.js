import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

import _ from "lodash";
import DKA from "../../../index.module.d";

class Firestore {

    instance = []
    /**
     * @param {Object} config
     */
    constructor(config, selectedInstance) {
        this.config = _.merge(DKA.config.FirebaseConfig, config);

        Object.keys(this.config).forEach(async (key, index, max) => {
            if (max.length > 0 && max.length === 1){
                this.instance.push(initializeApp(this.config[key]));
            }else{
                this.instance.push(initializeApp(this.config[key], key))
            }
        });

        return getFirestore(this.instance[0]);
    }

}


export default Firestore;