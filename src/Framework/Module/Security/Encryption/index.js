import DKA from "./DKA";
import JWT from "./JWT";
import ALPHA from "./ALPHA";
import CRYPTO from "./CRYPTO";

const Encryption = {
    DKA : DKA,
    Jwt : JWT,
    Alpha : ALPHA,
    Crypto : CRYPTO
};

export default Encryption;
export { DKA, JWT, ALPHA, CRYPTO };