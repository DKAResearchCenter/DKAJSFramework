import firebase from "firebase";
import _ from "lodash";

class Firestore {

    /**
     *
     * @returns {firebase.firestore.Firestore}
     * @param app
     */
    constructor(app) {
        this.instance = firebase.initializeApp(app).firestore()
        return this.instance;
    }






}


export default Firestore;