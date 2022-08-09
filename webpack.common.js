const path = require('path');
const webpack = require('webpack');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
	entry: './source/main.js',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'static')
	},
	plugins: [
		new webpack.ProvidePlugin({
			$: "jquery",
			jQuery: "jquery"
		}),
		new CleanWebpackPlugin(),
		new MonacoWebpackPlugin(languages=[])
	],
	module: {
		rules: [
			{ test: /\.css$/, use: ['style-loader', 'css-loader' ] },
			{
                test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                type: 'asset',
                parser: {dataUrlCondition: {maxSize: 8192}},
            },
		]
	}
};
