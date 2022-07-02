import _ from "lodash";

class MidTrans {

    static get ENGINE_MIDTRANS_CORE_API() {
        return 1;
    }

    static get ENGINE_MIDTRANS_CORE_SNAP() {
        return 2;
    }

    static get STATE_MIDTRANS_SANDBOX() {
        return "https://api.sandbox.midtrans.com/"
    }

    static get STATE_MIDTRANS_PRODUCTION() {
        return "https://api.midtrans.com/"
    }


    constructor(config) {
        this.config = _.extend({
            version : 2,
            engine : MidTrans.ENGINE_MIDTRANS_CORE_API,
            isProduction : false,
            serverKey : null,
            clientKey : null
        }, config);

        function checkModuleExist(name){
            try {
                require.resolve(name);
                return true;
            }catch (e) {
                return false;
            }
        }

        let midtrans = checkModuleExist("midtrans-client") ? require("midtrans-client") : null;

        switch (this.config.engine){
            case MidTrans.ENGINE_MIDTRANS_CORE_API :
                this.INSTANCE = new midtrans.CoreApi(this.config)
                break;
            case MidTrans.ENGINE_MIDTRANS_CORE_SNAP :
                this.INSTANCE = new midtrans.Snap(this.config)
                break;
            default :
            this.INSTANCE = new midtrans.CoreApi(this.config)
        }

    }

    charge = async (data) =>
        new Promise (async (resolve, rejected) => {
            switch (this.config.engine){
                case MidTrans.ENGINE_MIDTRANS_CORE_API :
                    this.INSTANCE.charge(data).then(resolve).catch(rejected)
                    break;
                case MidTrans.ENGINE_MIDTRANS_CORE_SNAP :
                    this.INSTANCE.createTransaction(data).then(resolve).catch(rejected)
                    break;
                default :
                    this.INSTANCE.charge(data).then(resolve).catch(rejected)
            }


        });


}

export default MidTrans;