const webpack = require('webpack');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const common = require('./webpack.common.js');

module.exports = merge(common, {
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
        }),
        new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            comments: false,
        }),
        new CleanWebpackPlugin(['build']),

        // Only bundle english locales for moment
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),
        new CopyWebpackPlugin([
            {
                from: './assets/icon.png',
                to: './icon.png',
            },
        ]),
    ],
});
