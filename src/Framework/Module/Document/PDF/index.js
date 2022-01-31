import path from "path";
import fs from "fs";
import _ from "lodash";
import pdfkit from "pdfkit";


class PDF {


    static get ENGINE_PDFKIT(){
        return 1;
    }

    static get PAPER_SIZE_A4(){
        return 'A4';
    }
    constructor(config) {
        this.config = _.merge({
            engine : PDF.ENGINE_PDFKIT,
            paper : PDF.PAPER_SIZE_A4,
            dist : path.join(process.cwd(), "./output.pdf")
        }, config);

        // Create a document
        this.Document = new pdfkit();
        let getWriteFile = fs.createWriteStream(this.config.dist);
        this.Document.pipe(getWriteFile);
        return this;
    }

    addPage = (size) => {
        this.Document.addPage({ size : size });
        return this;
    }

    addFont = (config) => {
        let fontConfig = _.merge({
            fontLocation : path.join(__dirname, "./Template/fonts/arial.ttf"),
            fontSize : 12
        }, config);
        this.Document
            .font(fontConfig.fontLocation)
            .fontSize(fontConfig.fontSize);
        return this;
    }

    addText = (string) => {
        this.Document.text(`${string}`)
        return this;
    }

    end = () => {
        this.Document.end();
        //callback({ status : true, msg : 'Successfully. Create PDF Document'});
    }
}

export default PDF;