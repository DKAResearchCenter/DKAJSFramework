import mStream from "node-rtsp-stream";
import _ from "lodash";

class RSTP {


    constructor(config) {
        this.config = _.extend({
            name: 'name',
            streamUrl: 'rtsp://184.72.239.149/vod/mp4:BigBuckBunny_115k.mov',
            wsPort: 9999,
            ffmpegOptions: { // options ffmpeg flags
                '-stats': '', // an option with no neccessary value uses a blank string
                '-r': 30 // options with required values specify the value after the key
            }
        }, config);
    }

    execute = async () =>
        new Promise(async (resolve, rejected) => {
            const stream = new mStream(this.config);

        })
}

export default RSTP;