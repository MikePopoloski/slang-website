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
		new webpack.IgnorePlugin(
	      /^((fs)|(path)|(os)|(crypto)|(source-map-support))$/,
	      /vs(\/|\\)language(\/|\\)typescript(\/|\\)lib/
	    ),
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
			{ test: /\.(png|svg|jpg|gif)$/, use: ['file-loader'] },
			{ test: /\.(woff|woff2|eot|ttf|otf)$/, use: ['file-loader'] }
		]
	}
};