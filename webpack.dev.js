const merge = require('webpack-merge');
const webpack = require('webpack');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    output: {
        publicPath: '/',
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development'),
        }),
    ],
    devServer: {
        port: 9000,
        inline: true,
        contentBase: './app',
        historyApiFallback: true,
        disableHostCheck: true,
        host: '0.0.0.0',
    },
    devtool: 'eval-source-map',
});
