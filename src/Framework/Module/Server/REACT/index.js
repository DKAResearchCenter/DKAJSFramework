import ReactDOM from "react-dom";
import React from "react";

export default (config, app) => new Promise((resolve, reject) => {
    ReactDOM.render(app, document.getElementById('dka'))
    resolve();
});