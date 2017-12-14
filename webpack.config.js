var webpack = require("webpack");
var path = require("path");
var env = process.env.NODE_ENV
var compress = process.env.COMPRESS

var ExtractTextPlugin = require("extract-text-webpack-plugin");

var plugins = []

plugins.push(new webpack.DefinePlugin({
    "process.env.NODE_ENV": JSON.stringify(env)
}))

if (env === 'production' && compress) {
    plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            output: {
                "ascii_only": true
            },
            compressor: {
                warnings: false
            }
        })
    )
}

const extractCSS = new ExtractTextPlugin('mk-utils.' + (env === 'production' ? 'min.':'') +  'css')
plugins.push(extractCSS)

module.exports = {
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
            test: /\.css$/,
            use: extractCSS.extract({
                fallback: "style-loader",
                use: ['css-loader']
            })
        },{
            test: /\.js?$/,
            exclude: /node_modules/,
            use: 'babel-loader'
        }]
    },

    plugins: plugins
}

if (env === 'development') {
    module.exports.devtool = 'source-map'
}
