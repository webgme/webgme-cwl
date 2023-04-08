var path = require('path');
var WrapperPlugin = require('wrapper-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    entry: './src/visualizers/widgets/CommonWorkflowEditor/src/index.jsx',
    output: {
        filename: 'CommonWorkflowEditorWidget.bundle.js',
        path: path.join(__dirname, './src/visualizers/widgets/CommonWorkflowEditor/')
    },
    plugins: [
        new WrapperPlugin({
            test: /\.js$/,
            header: 'define([], function () {\nreturn function (VISUALIZER_INSTANCE_ID, WEBGME_CONTROL, WEBGME_PANEL) {',
            footer: '};\n});'
        }),
        new MiniCssExtractPlugin({
            filename: './styles/CommonWorkflowEditorWidget.bundle.css'
        })
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader',
                ],
            },
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            }
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
};