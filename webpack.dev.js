const merge = require('webpack-merge');
const webpack = require('webpack');
const common = require('./webpack.common.js');

const dhisConfigPath = process.env.DHIS2_HOME && `${process.env.DHIS2_HOME}/config`;

let dhisConfig;
try {
    dhisConfig = require(dhisConfigPath);
} catch (e) {
    // Failed to load config file - use default config
    console.warn(`\nWARNING! Failed to load DHIS config:`, e.message);
    dhisConfig = {
        baseUrl: 'http://localhost:8080',
        authorization: 'Basic c3lzdGVtOlN5c3RlbTEyMw==',
    };
}

const globals = {
    DHIS_CONFIG: JSON.stringify(dhisConfig),
};

module.exports = merge(common, {
    output: {
        publicPath: '/',
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development'),
        }),
        new webpack.DefinePlugin(globals),
    ],
    devServer: {
        port: 9000,
        inline: true,
        contentBase: './app',
        historyApiFallback: true,
        disableHostCheck: true,
    },
    devtool: 'eval-source-map',
});
