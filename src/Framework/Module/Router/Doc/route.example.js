import _ from "lodash";

const RouteExample = [
    {
        title : "",
        url : "",
        assets : {
            css : [],
            js : [],
        },
        component : "",
        data : {}
    }
]

class route {

    /**
     *
     * @param {Array}RouteMaps
     */
    constructor(AppEngine, RouteMaps) {
        /**
         *
         * @type {Object}
         */
        this.RouteMaps = _.extend([
            {
                title : "",
                url : "",
                assets : {
                    css : [],
                    js : [],
                },
                component : "",
                data : {}
            }
        ], RouteMaps);

        this.RouteMaps.forEach(object => {
            AppEngine.get((object.url !== undefined) ? object.url : "/", (request, response) => {
                response.view((object.component !== undefined) ? object.component : "", (object.data !== undefined) ? object.data : {})
            })
        });
    }
}

export default route;