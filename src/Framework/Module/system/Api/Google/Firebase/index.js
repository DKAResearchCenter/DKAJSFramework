import _ from "lodash";
import firebase from "firebase/app";

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
        this.config = _.extend({
            name : null,
            settings : {
                auth : {
                    enabled : true
                },
                firestore : {
                    enabled : true
                }
            }
        }, config);

        (this.config.settings.auth.enabled) ? require("firebase/auth") : null;
        (this.config.settings.firestore.enabled) ? require("firebase/firestore") : null;

        /**
         *
         * @type {firebase.app.App}
         */
        this.app = (this.config.name !== null) ? firebase.initializeApp(this.config, this.config.name) : firebase.initializeApp(this.config);
    }

    /**
     *
     * @param {firebase.firestore} db
     * @return {Promise<firebase.firestore>}
     */
    firestore = async(db = this.app.firestore()) => {
        return db;
    }

    /**
     *
     * @param {firestore.auth} auth
     * @return {Promise<Firebase.auth>}
     */
    auth = async(auth = this.app.auth()) => {
        return auth;
    }
}

export default Firebase;
export { Firebase }