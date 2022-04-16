


const Login = async (app, opts, next) => {

    const url = "/login";

    /**
     * Post For Insert Data From Connector
     */
    await app.post(url, (request, response) => {

    });

    /**
     * Get For Get Data From Connector
     */
    await app.get(url, (request, response) => {

    });

    /**
     * put For Update Data From Connector
     */
    await app.put(url, (request, response) => {


    });

    /**
     * Delete For Deleted Data From Connector
     */
    await app.delete(url, (request, response) => {

    });

    await next();
}