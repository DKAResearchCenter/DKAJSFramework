import firebase from "firebase";
import _ from "lodash";
import DKA from "../../../index.module.d";

class Firestore {

    /**
     *
     * @returns {firebase.firestore.Firestore}
     * @param {Object} config
     */
    constructor(config) {
        this.config = _.merge(DKA.config.FirebaseConfig, config);

        this.instance = firebase.initializeApp(this.config)
        return this.instance.firestore();
    }








}


export default Firestore;