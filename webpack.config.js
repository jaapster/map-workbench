const HtmlWebpackPlugin = require('html-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const flags = require('./server/flags');

console.log(flags.mode); // remove me

const getConfig = (name, mode) => {
	return {
		name,
		mode,
		entry: [
			'@babel/polyfill',
			`./packages/${ name }/src/index.tsx`
		],
		devtool: 'source-map',
		output: {
			filename: `${ name }.bundle.js`,
			path: '/',
			publicPath: `/${ name }/`
		},
		node: {
			fs: 'empty'
		},
		resolve: {
			plugins: [
				new TsconfigPathsPlugin({
					configFile: `./packages/${ name }/tsconfig.json`
				})
			],
			extensions: ['.ts', '.tsx', '.js', '.json']
		},
		plugins: [
			new HtmlWebpackPlugin()
		],
		module: {
			rules: [
				{
					test: /\.(ts|js)x?$/,
					loader: 'babel-loader',
					exclude: /node_modules/,
					options: {
						presets: [
							[
								'@babel/preset-env',
								{
									targets: {
										browsers: ['last 2 versions']
									},
									modules: false // Needed for tree shaking to work.
								}
							],
							'@babel/preset-typescript',
							'@babel/react'
						],
						plugins: [
							['@babel/plugin-proposal-decorators', { legacy: true }],
							'@babel/plugin-proposal-object-rest-spread',
							'@babel/plugin-proposal-class-properties'
						]
					}
				},
				{
					test: /\.(s*)css$/,
					use: ['style-loader', 'css-loader', 'sass-loader']
				},
				{
					test: /\.(woff|ttf|eot|svg)(\?v=[a-z0-9]\.[a-z0-9]\.[a-z0-9])?$/,
					use: ['file-loader']
				}
			]
		}
	};
};

module.exports = [
	getConfig('lite', 'development') // ,
	// getConfig('portal', 'development')
];