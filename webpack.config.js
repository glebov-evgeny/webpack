const webpack = require('webpack');

const webpackConfig = {
    entry: "./.distr/pages/js/index.js",
    output: {
        path: __dirname,
        filename: "bundle.js",
        publicPath: "/assets/js/"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: "babel-loader",
                exclude: /(node_modules|bower_components)/,
                options: {
                    compact: true
                }
            },
            {
                test: /\.js$/,
                loader: 'imports-loader?define=>false'
            }
        ]
    },
    resolve: {
        modules: ['./src/js', 'node_modules']
    },
    mode: "development",
    devtool: "source-map"
};

module.exports = webpackConfig;
