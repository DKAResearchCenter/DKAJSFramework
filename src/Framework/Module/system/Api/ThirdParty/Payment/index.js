import Banking from "./Banking";
import Fintech from "./Fintech";
import MasterCard from "./CreditCard";

const Payment = {
    Banking : Banking,
    Fintech : Fintech
};


export default Payment;
export { Banking, Fintech }