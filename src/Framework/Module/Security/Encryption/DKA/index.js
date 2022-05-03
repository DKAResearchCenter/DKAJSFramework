import _ from "lodash";

class DKA {
    constructor(config) {
        this.config = _.extend({
            alg : 'default',
            key : 10028
        }, config);
    }

    encode = function (text = null, key = this.config.key) {
        let mReturnData = null;
        let arrayData = [];
        let mKeys = Buffer.alloc(200, key, "utf-8").readBigUInt64BE();
        const OriString = text.toString().split("");
        const OriKey = mKeys.toString().split("");
        //######### STEP 2 #############################################
        let num = 0
        OriString.forEach(function (step1item) {
            const convertAlphabetToInt = step1item.charCodeAt(0);
            arrayData.push(parseInt((convertAlphabetToInt)) + parseInt(OriKey[num]));
            (num === OriKey.length - 1) ? num = 0 : num++;
        });
        let hasil = '';
        arrayData.forEach(function (item){
            hasil += String.fromCharCode(item);
        });

        //######### END STEP 2 #############################################

        mReturnData = hasil
        return mReturnData;
    }

    decode = function (StringEnc = null, key = this.config.key) {
        let mReturnData = null;
        let arrayData = [];
        let mKeys = Buffer.alloc(200,key, "utf-8").readBigUInt64BE();
        console.log(mKeys)
        const OriString = StringEnc.toString().split("");
        const OriKey = mKeys.toString().split("");
        let num = 0
        OriString.forEach(function (step1item) {
            const convertAlphabetToInt = step1item.charCodeAt(0);
            arrayData.push(parseInt((convertAlphabetToInt)) - parseInt(OriKey[num]));
            (num === OriKey.length - 1) ? num = 0 : num++;
        });
        let hasil = '';
        arrayData.forEach(function (item){
            hasil += String.fromCharCode(item);
        });

        mReturnData = hasil;

        /**
         mReturnData = decrypted.toString();*/
        //mReturnData = { iv : mSplitText[0], enc : mSplitText[1]}
        return mReturnData;
    }
}

export default DKA;