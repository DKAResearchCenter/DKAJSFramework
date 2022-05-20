import { Database, Server, Functions } from "./../";

const timeManagement = new Promise(async (resolve, rejected) => {
    await new Functions.TimeManagement()
        .getDifferentTime(1651898613, 1651899030)
        .then(async (result) => {
            resolve(result.data);
        }).catch(async (error) => {
            rejected(error)
        })
})

export default timeManagement;