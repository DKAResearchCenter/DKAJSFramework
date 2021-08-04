import Lib from "./Lib";


new Lib().get('/', async (request, response) => {
    response.send("rtesr");
})