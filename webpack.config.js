const path = require('path')
const webpack = require('webpack')

module.exports = {
	entry: './source/main.js',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'static')
	},
	devtool: 'inline-source-map',
	plugins: [
		new webpack.ProvidePlugin({
			$: "jquery",
			jQuery: "jquery"
		})
	],
	module: {
		rules: [
			{ test: /\.css$/, use: ['style-loader', 'css-loader' ] },
			{ test: /\.(png|svg|jpg|gif)$/, use: ['file-loader'] },
			{ test: /\.(woff|woff2|eot|ttf|otf)$/, use: ['file-loader'] }
		]
	}
};