import Firebaseapp from "firebase/compat/app";
import 'firebase/compat/firestore';

import _ from "lodash";
import mConfig from "../../../Config";

class Firestore {


    /**
     * @param {Object} config
     * @return firebase.firestore.Firestore
     */
    constructor(config) {
        this.config = _.extend(mConfig.FirebaseConfig, config);
        mConfig.FirebaseConfig = this.config
        const app = Firebaseapp.initializeApp(this.config)
        return app.firestore();
    }


}


export default Firestore;