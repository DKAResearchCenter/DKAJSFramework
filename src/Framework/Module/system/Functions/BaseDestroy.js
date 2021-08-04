

const BaseDestroy = async (path) => {

    const fs = require("fs");

    fs.unlink(path, (error) => {
        if (error) {
            console.log(error)
        }
    })

}