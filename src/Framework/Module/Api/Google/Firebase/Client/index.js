import DKA from "./../../../../index.module.d"
import _ from "lodash";
import firebase from "firebase/app";
import firestore from "firebase/firestore";

class Firebase {
    app = null;
    /**
     *
     * @param {{}} config Configuration Firebase;
     *
     *
     */
    constructor(config) {
        /** Extend Constructor Config **/
        this.config = _.merge(DKA.config.FirebaseConfig, config);

        /**
         *
         * @type {firebase.app.App}
         */
        this.app = firebase.initializeApp(this.config);
    }

    /**
     *
     * @param {firebase.firestore} callback
     * @return {Promise<firebase.firestore>}
     */
    firestore = new firestore(this.app);

}

export default Firebase;
export { Firebase }