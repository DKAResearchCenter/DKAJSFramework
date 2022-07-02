'use strict';
'use warning';
import _ from "lodash";

class Admin {

    /**
     *
     * @param config
     */
    constructor(config) {
        this.config = _.extend({
            projectId : "",
            serviceAccountId : "",
            databaseURL : "",
            httpAgent : ""
        }, config);


        import("firebase-admin")
            .then(async (firebaseAdmin) => {
                return firebaseAdmin.initializeApp(this.config);
            })
            .catch()

    }


}

export default Admin;