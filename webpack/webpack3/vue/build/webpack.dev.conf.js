"use strict";
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const FriendlyErrorsPlugin = require("friendly-errors-webpack-plugin");
const webpackMerge = require("webpack-merge");
const portfinder = require("portfinder");
const webpackBaseConfig = require("./webpack.base.conf");
const utils = require("./utils");
const config = require("../config");
const env = require("../config/dev.env");
const HtmlWebpackExcludeAssetsPlugin = require('html-webpack-exclude-assets-plugin');

const HOST = process.env.HOST;
const PORT = process.env.PORT && Number(process.env.PORT);
const projectName = utils.projectName(true);
const appConfigFiles = utils.appConfigFiles();

const webpackConfig = webpackMerge(webpackBaseConfig, {
	module: {
		rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
	},
	devtool: config.dev.devtool,
	// mode: 'development',
	devServer: {
		contentBase: config.build.assetsRoot,
		publicPath: config.dev.assetsPublicPath,
		// contentBase: false, // since we use CopyWebpackPlugin.
		disableHostCheck: true,
		clientLogLevel: "warning",
		historyApiFallback: {
			rewrites: [
				{ from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, "index.html") }
			]
		},
		hot: true,
		compress: true,
		host: HOST || config.dev.host,
		port: PORT || config.dev.port,
		open: config.dev.autoOpenBrowser,
		overlay: config.dev.errorOverlay
			? { warnings: false, errors: true }
			: false,
		proxy: config.dev.proxyTable,
		quiet: true, // necessary for FriendlyErrorsPlugin
		watchOptions: {
			poll: config.dev.poll
		},
		// socket: 'socket'
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': env
		}),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NamedModulesPlugin(),
		new webpack.NoEmitOnErrorsPlugin(),
		new HtmlWebpackPlugin({
			filename: "index.html",
			template: "index.html",
			inject: true,
			// excludeChunks: ['themes']
			excludeAssets: [/themes.*.js/] //, /style.*.css/
		}),
		new HtmlWebpackExcludeAssetsPlugin(),
		new CopyWebpackPlugin([
			{
				from: path.resolve(__dirname, "../static"),
				to: config.dev.assetsSubDirectory,
				ignore: [".*", "*.config.js"]
			},
			{
				from: projectName && appConfigFiles.includes(projectName)
					? `${path.resolve(__dirname, "../static")}/${projectName}.config.js`
					: `${path.resolve(__dirname, "../static")}/app.config.js`,
				to: `${config.build.assetsSubDirectory}/app.config.js`,
				ignore: [".*"]
			}
		])
	]
});

// module.exports = webpackConfig;
module.exports = new Promise((resolve, reject) => {
	portfinder.basePort = process.env.Port || config.dev.port;
	portfinder.getPort((err, port) => {
		if (err) {
			reject(err);
		} else {
			process.env.PORT = port;
			webpackConfig.devServer.port = port;
			webpackConfig.plugins.push(new FriendlyErrorsPlugin({
				compilationSuccessInfo: {
					messages: [`Your application is running here: http://${webpackConfig.devServer.host}:${port}`]
				},
				onErrors: config.dev.notifyOnErrors
					? utils.createNotifierCallback()
					: undefined
			}));
			resolve(webpackConfig);
		}
	});
});
