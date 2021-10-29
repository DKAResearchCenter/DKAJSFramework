'use strict';
'use warning';
import _ from "lodash";
import * as admin from "firebase-admin";
import {apps} from "firebase-admin"
import mDatabase from "./Database";

class Admin {

    /**
     *
     * @param config
     * @returns {app.App.Chek}
     */
    constructor(config) {
        this.config = _.extend({
            projectId : "",
            serviceAccountId : "",
            databaseURL : "",
            httpAgent : ""
        }, config);


        return admin.initializeApp(this.config);
    }


}

export default Admin;