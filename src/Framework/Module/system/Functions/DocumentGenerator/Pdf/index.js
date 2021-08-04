import _ from "lodash";
import PDFDocument from "pdfkit";

class Pdf {

    constructor (options) {

        this.doc = new PDFDocument();

        this.options = _.extend({

        });


    }

}