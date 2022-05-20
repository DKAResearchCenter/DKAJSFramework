import DKA from "./../../../../index.module.d"
import _ from "lodash";
import firebase from "firebase/app";
import firestore from "firebase/firestore";
import storage from "firebase/storage";

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
     * @return {Promise<module:@firebase/firestore.getFirestore>}
     * @param app
     */
    firestore = async (app = this.app) => await new firestore.getFirestore(app);

    /**
     *
     * @param {firebase} app
     * @returns {Promise<module:@firebase/storage.getStorage>}
     */
    storage = async (app = this.app) => await new storage.getStorage(app);






}

export default Firebase;
export { Firebase }