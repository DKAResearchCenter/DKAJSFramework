import BigData from "./BigData";
import ThirdParty from "./ThirdParty";
import Google from "./Google";
import Base from "./Base";


const Api = {
    BigData : BigData,
    ThirdParty : ThirdParty,
    Google : Google
};

Api.Base = Base;

export default Api;
export { BigData, ThirdParty, Google }