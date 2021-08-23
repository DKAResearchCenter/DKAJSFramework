import path from "path";
import fsExtra from "fs-extra";
class File {

    constructor() {

    }

    destroyProject = function (fileName) {
        fsExtra.emptydir(fileName);
    }

    getFileRoot = function () {
        return path.join(process.cwd(), ".");
    }
}

export default File;