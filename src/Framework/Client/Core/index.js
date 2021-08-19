'use strict';
'use warning';

import moment from "moment";
import $ from "jquery";
import socket from "socket.io-client";
const io = socket(window.location.href + 'dka');
(async() => {
    global._DKACore = true;
    /** DKA Analytic System Idle**/
    let idleTime = 0;
    let idleTimeInterval = null
    /** End DKA Analytic System Idle**/
    $(document).ready(function (e) {

        moment.locale("id");

        io.on('connect', function (){
            console.debug(io.id);
        });




        idleTimeInterval = setInterval(function (e){
            idleTime = idleTime + 1
        },1000)
    });

    $(window).focus(function() {
        idleTimeInterval = setInterval(function (e){
            idleTime = idleTime + 1
        },1000)
    });

    $(window).blur(function() {
        clearInterval(idleTimeInterval);
        idleTime = 0
    });
})()



