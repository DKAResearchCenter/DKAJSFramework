'use strict';
const path = require('path');


module.exports = {
    mode: "development",
    entry : {
        core : path.resolve(__dirname, 'src/Framework/Client/Core/index.js'),
        analytic : path.resolve(__dirname, 'src/Framework/Client/Analytic/index.js')
    },
    output: {
        path: path.resolve(__dirname, "dist/Framework/Client"),
        filename: "DKA[name].js",
        library: "DKA",
        libraryTarget: "umd",
        globalObject: 'this'
    },
    module: {
        rules: [
            {
                test: /\.(js)$/,
                exclude: /node_modules/,
                use: "babel-loader",
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    target: 'web'
}