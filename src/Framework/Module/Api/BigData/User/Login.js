


const Login = async (app, opts, next) => {

    const url = "/login";

    /**
     * Post For Insert Data From Database
     */
    await app.post(url, (request, response) => {

    });

    /**
     * Get For Get Data From Database
     */
    await app.get(url, (request, response) => {

    });

    /**
     * put For Update Data From Database
     */
    await app.put(url, (request, response) => {


    });

    /**
     * Delete For Deleted Data From Database
     */
    await app.delete(url, (request, response) => {

    });

    await next();
}