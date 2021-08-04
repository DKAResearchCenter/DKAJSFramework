'use strict';
'use warning';
import _ from 'lodash';

/**
 * @class AntiVirus
 * @memberOf Functions
 */
class AntiVirus {

    /**
     *
     * @param options Adalah Konfigurasi Antivirus
     */
    constructor(options) {
        this.options = _.extend({
            AntiVirusEngine : "ClamAntiVirus"
        }, options);
    }

}
export default AntiVirus;