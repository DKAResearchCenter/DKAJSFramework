'use strict';
'use warning';

import moment from "moment";
import $ from "jquery";
import io from "socket.io-client";

import Library from "./../Lib";

(async() => {
    global._DKACore = true;
    /** DKA Analytic System Idle**/
    let idleTime = 0;
    let idleTimeInterval = null
    $(document).ready(function (e) {
        moment.locale("id");
        const mDateNow = new Date(Date.now());
        const unixNow = moment(mDateNow).unix();
        const humanize = moment(mDateNow).format(`MMMM Do YYYY, h:mm:ss:SS`);

            /*new Library.Navigator.Location()
                .getCurrentPosition(function (pos){
                    console.log(pos)
                }, function (error){
                    console.log(error)
                })*/

        idleTimeInterval = setInterval(function (e){
            idleTime = idleTime + 1
            console.log(idleTime);
            //console.log(navigator.userAgent)
        },1000)
    });

    $(window).focus(function() {
        idleTimeInterval = setInterval(function (e){
            idleTime = idleTime + 1
            console.log(idleTime);
        },1000)
    });

    $(window).blur(function() {
        clearInterval(idleTimeInterval);
        idleTime = 0
    });
})()



