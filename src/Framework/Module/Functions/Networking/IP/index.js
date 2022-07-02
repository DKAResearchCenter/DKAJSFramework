const IP = {
    getGateway : async() => new Promise(async (resolve, rejected) => {
        await import("default-gateway")
            .then(async (defaultGateway) => {
                resolve({ status : true, code : 200, msg : `successfully get gateway`, data : { IP4 : defaultGateway.v4(), IP6 : defaultGateway.v6()}})
            })
            .catch(async (error) => {
                await rejected({ status : false, code : 500, msg : `error load modules`, error : error})
            })

    }),
    getGatewaySync : async() => {
        let mReturn = null;
        /** Function for import module from dependencies with await command execution  **/
        await import("default-gateway")
            .then(async (defaultGateway) => {
                mReturn = { status : true, code : 200, msg : `successfully get gateway`, data : { IP4 : defaultGateway.v4(), IP6 : defaultGateway.v6()}}
            })
            .catch(async (error) => {
                await rejected({ status : false, code : 500, msg : `error load modules`, error : error})
            });
        return mReturn;
    }
}


export default IP;