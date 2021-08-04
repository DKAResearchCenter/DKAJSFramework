import Crypto from "crypto";
import _ from "lodash"


class index {


    constructor(Options) {
        this.Options = _.extend({
            iv : Crypto.randomBytes(16),
            algorithm : 'aes-128-cbc',
            secretKey : "Cyberhack2010ue73ue@fjcncmejfhdw",
            keyLength : 24
        }, Options);

    }

    encode(text){
        const mChiper = Crypto.createCipher(this.Options.algorithm, this.Options.secretKey);
        let encrypted = mChiper.update(text, 'utf8', 'hex')
        // Using concatenation
        encrypted += mChiper.final("hex")

        return encrypted
    }

    
    decode(text){
        let decipher = Crypto.createDecipher(this.Options.algorithm, this.Options.secretKey);
        let decrypted = decipher.update(text, 'hex','utf8');

        decrypted += decipher.final("utf8")

        return decrypted;
    }


}

export default index;