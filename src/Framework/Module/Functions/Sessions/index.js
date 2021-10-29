'use strict';
'use warning';

import _ from 'lodash';

class Sessions {
    /** Create Constructor **/
    constructor(options) {
        /** The Constuctor **/
        this.options = _.extend({
            NameOfSession : ""
        }, options)
    }
}

export default Sessions