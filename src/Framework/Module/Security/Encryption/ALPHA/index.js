import _ from "lodash";

class AlphaCrypt {

    /**
     * @param {Object} config
     * @param {String} config.secretKey
     */
    constructor(config) {
        this.config = _.extend({
            secretKey : "Cyberhack2010"
        }, config);
    }

    /**
     *
     * @param {String} text
     */
    encode(text) {

        //#######################################################################################

        /** Change Text To Hex Variable **/
        let firstFase = Buffer.from(text).toString("hex");
        //#######################################################################################
        /** Replacing Variable To Algortm Symbol * */
        let twoStep = firstFase.replaceAll("a", "@").replaceAll("b", "?").replaceAll("c","-")
            .replaceAll("d", "!").replaceAll("e", "^").replaceAll("f", "&").replaceAll("g", "(")
            .replaceAll("h", ".").replaceAll("i", ";").replaceAll("j", ":").replaceAll("k", "]")
            .replaceAll("l", "#").replaceAll("m", "%").replaceAll("n", ",").replaceAll("o", "{")
            .replaceAll("p", "|").replaceAll("q", "+").replaceAll("r", "'").replaceAll("s", "=")
            .replaceAll("t", '"').replaceAll("u", "/").replaceAll("v", "*").replaceAll("w", ")")
            .replaceAll("x", "[").replaceAll("y", "}").replaceAll("z", ">").replaceAll(" ", "~");
        //#######################################################################################

        /** Convert Variable Replacing To Base 64 String **/
        let treeStep = Buffer.from(twoStep).toString("hex");

        //#######################################################################################

        let fourStep = treeStep.replaceAll(1, "a").replaceAll(2, "?").replaceAll(3,"-")
            .replaceAll(4, "!").replaceAll(5, "^").replaceAll(6, "&").replaceAll(7, "(")
            .replaceAll(8, ".").replaceAll(9, ";").replaceAll(0, ":");

        //#######################################################################################
        /** Replacing Variable To Algortm Symbol */

        return fourStep;
    }

    decode(text){

        let firstStep = text.replaceAll("a",1).replaceAll("?", 2).replaceAll("-", 3)
            .replaceAll("!", 4).replaceAll("^",5).replaceAll("&", 6).replaceAll("(", 7)
            .replaceAll(".", 8).replaceAll(";", 9).replaceAll(":",0);


        const twoStep = Buffer.from(firstStep, "hex").toString("utf-8");

        const treeStep = twoStep.replaceAll("@","a").replaceAll("?", "b").replaceAll("-","c")
            .replaceAll("!", "d").replaceAll("^", "e").replaceAll("&","f").replaceAll("(","g")
            .replaceAll(".","h").replaceAll(";","i").replaceAll(":","j").replaceAll("]","k")
            .replaceAll("#","l").replaceAll("%","m").replaceAll(",","n").replaceAll("{","o")
            .replaceAll("|","p").replaceAll("+","q").replaceAll("'","r").replaceAll("=","s")
            .replaceAll('"',"t").replaceAll("/", "u").replaceAll("*","v").replaceAll(")","w")
            .replaceAll("[","x").replaceAll("}","y").replaceAll(">","z").replaceAll("~", " ");

        /** Convert to Replacing 2 Step Hex **/
        const fourStep = Buffer.from(treeStep, "hex").toString("utf-8");



        return fourStep;
    }
}

export default AlphaCrypt;