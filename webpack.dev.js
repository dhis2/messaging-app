const merge = require('webpack-merge')
const webpack = require('webpack')
const common = require('./webpack.common.js')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const parse = require('url-parse')

const dhisConfigPath =
    process.env.DHIS2_HOME && `${process.env.DHIS2_HOME}/config`

let dhisConfig
try {
    dhisConfig = require(dhisConfigPath)
} catch (e) {
    // Failed to load config file - use default config
    console.warn(`\nWARNING! Failed to load DHIS config:`, e.message)
    dhisConfig = {
        baseUrl: 'http://localhost:8080',
        authorization: 'Basic c3lzdGVtOlN5c3RlbTEyMw==',
    }
}

const globals = {
    DHIS_CONFIG: JSON.stringify(dhisConfig),
}

const pathnamePrefix = parse(dhisConfig.baseUrl).pathname

module.exports = merge(common, {
    output: {
        publicPath: '/',
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: true,
            template: 'public/index.html',
            vendorScripts: [
                `.${pathnamePrefix}/dhis-web-core-resource/material-design-icons/material-icons.css`,
                `.${pathnamePrefix}/dhis-web-core-resource/fonts/roboto.css`,
            ]
                .map(asset => {
                    return /\.js$/.test(asset)
                        ? `<script src="${asset}"></script>`
                        : `<link type="text/css" rel="stylesheet" href="${asset}">`
                })
                .join('\n'),
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development'),
        }),
        new webpack.DefinePlugin(globals),
    ],
    devServer: {
        port: 3000,
        inline: true,
        contentBase: './app',
        historyApiFallback: true,
        disableHostCheck: true,
    },
    devtool: 'eval-source-map',
})
