import $ from "jquery";
import cookie from "js-cookie";
import {io} from "socket.io-client";

(async () => {
    if (window._DKACore !== undefined) {
        console.debug("DKA Core Exist");
        const socket = io("http://localhost:8002");

        socket.on("connect", function () {
            socket.emit('browser_state', {
                title : $(document).attr('title'),
                url : $(location).attr('href'),
                user : {
                    agent : navigator.userAgent
                }
            });
        });
        $(window).on('load',function (e) {
            socket.emit('browser_state', {type: "window load"})
        });
        $(window).blur(function (e) {
            socket.emit('browser_state', {type: "window blur"})
        });
        $(window).focus(function (e) {
            socket.emit('browser_state', {type: "window focus"})
        });
        $(document).ready(function (e) {
            socket.emit('browser_state', {
                type: "document ready"
            });
        });


        socket.on('error', function (error) {
            console.log(error)
        })
    } else {
        console.error('DKACore Not Exist');
    }
})();