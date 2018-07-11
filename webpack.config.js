const webpack = require("webpack"),
    path = require("path"),
    env = process.env.NODE_ENV

const UglifyJsPlugin = require("uglifyjs-webpack-plugin")


module.exports = {
    mode: env || 'development',
    optimization: {
        minimizer: env === 'production' ? [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: false
            })
        ] : []
    },
    devtool: env === 'production' ? undefined : 'source-map',
    entry: ["./src/index.js"],

    output: {
        path: path.join(__dirname, "/dist/"),
        library: "MKUtils",
        libraryTarget: "umd"
    },

    resolve: {
        extensions: [".js"]
    },

    externals: {
        "react": "React",
        "react-dom": "ReactDom",
        "moment": "moment",
        "lodash": "_"
    },

    module: {
        rules: [{
            test: /\.js?$/,
            exclude: /node_modules/,
            use: 'babel-loader'
        }]
    }
}
