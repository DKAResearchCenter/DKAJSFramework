'use strict';
'use warning';

import _ from 'lodash';

class Router {

    static get METHOD_GET () {
        return "GET";
    }

    static get METHOD_POST () {
        return "POST";
    }

    /**
     *
     * @param AppEngine
     * @param {Object} RouteConfig
     * @param {String} RouteConfig.name
     * @param {String} RouteConfig.url
     *
     * @param {Object} RouteConfig.stylesheet
     * @param {Object} RouteConfig.stylesheet.header
     * @param {Array} RouteConfig.stylesheet.header.metadata
     * @param {Array} RouteConfig.stylesheet.header.css
     *
     * @param {Object} RouteConfig.stylesheet.footer
     * @param {Array} RouteConfig.stylesheet.footer.js
     *
     * @param {Function} RouteConfig.component
     */
    constructor(AppEngine, RouteConfig){
        this.RouteConfig = _.extend([
            {
                name : "",
                url : null,
                stylesheet : {
                    header : {
                      metadata : [],
                      css : []
                    },
                    footer : {
                        js : []
                    }
                },
                component : null,
                serverEngine : Server.FASTIFY_CORE_ENGINE,
                layout : {
                    method : Router.METHOD_GET,
                    component : null
                }
            }
        ], RouteConfig);



    };

}
export default Router;
