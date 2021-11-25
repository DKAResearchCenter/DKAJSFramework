import Firebaseapp from "firebase/compat/app";
import 'firebase/compat/firestore';

import _ from "lodash";
import DKA from "../../../index.module.d";

class Firestore {


    /**
     * @param {Object} config
     * @return firebase.firestore.Firestore
     */
    constructor(config) {
        this.config = _.extend(DKA.config.FirebaseConfig, config);
        const app = Firebaseapp.initializeApp(this.config)
        return app.firestore();
    }


}


export default Firestore;