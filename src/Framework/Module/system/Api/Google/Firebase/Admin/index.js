'use strict';
'use warning';
import _ from "lodash";
import * as admin from "firebase-admin";

class Admin {


    constructor(config) {
        this.config = _.extend({

        }, config);

        admin.initializeApp({
            credential : admin.credential.applicationDefault()
        })
    }
}