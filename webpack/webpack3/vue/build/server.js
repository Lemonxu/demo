"use strict";
const path = require("path");
const webpack = require("webpack");
const rm = require("rimraf");
const fs = require('fs');
const webpackBaseConfig = require("./webpack.base.conf");
const WebpackDevServer = require("webpack-dev-server");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpackMerge = require("webpack-merge");
const FriendlyErrorsPlugin = require("friendly-errors-webpack-plugin");
const HtmlWebpackExcludeAssetsPlugin = require('html-webpack-exclude-assets-plugin');
const portfinder = require("portfinder");
const config = require("../config");
const utils = require("./utils");
const env = require("../config/dev.env");

const HOST = process.env.HOST;
const PORT = process.env.PORT && Number(process.env.PORT);
const projectName = utils.projectName(true);

fs.writeFile('./build/process.argv.json', JSON.stringify(process.argv || []), function(err) {
	if (err) {
		console.error(err);
	}
	console.log('----------新增成功-------------');
});

//使用node来启动webpack-dev-server
//暂时废弃不用，无法做到webpack-dev-server热更新（无法自动刷新浏览器）
const webpackConfig = webpackMerge(webpackBaseConfig, {
	// module: {
	// 	rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
	// },
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
		socket: 'socket'
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
			excludeAssets: [/themes.*.js/]
		}),
		new HtmlWebpackExcludeAssetsPlugin(),
		new CopyWebpackPlugin([
			{
				from: path.resolve(__dirname, "../static"),
				to: config.dev.assetsSubDirectory,
				ignore: [".*", "*.config.js"]
			},
			{
				from: projectName
					? `${path.resolve(__dirname, "../static")}/${projectName}.config.js`
					: `${path.resolve(__dirname, "../static")}/app.config.js`,
				to: `${config.build.assetsSubDirectory}/app.config.js`,
				ignore: [".*"]
			}
		])
	]
});

portfinder.basePort = process.env.Port || config.dev.port;
portfinder.getPort((err, port) => {
	if (err) {
		throw err;
	}
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
	// config.entry.unshift("webpack-dev-server/client?http://localhost:8080/", 'webpack/hot/dev-server');
	webpackConfig.entry = Object.assign(webpackConfig.entry, {
		webpackdevserver: `webpack-dev-server/client?http://l${webpackConfig.devServer.host}:${port}`,
		devserver: 'webpack/hot/dev-server'
	});
	const devServerOptions = Object.assign({}, webpackConfig.devServer, {
		stats: {
			colors: true
		},
		inline: true,
		progress: true
	});
	console.log(webpackConfig.output, webpackConfig.devServer);
	const compiler = webpack(webpackConfig);
	console.log(devServerOptions);

	const server = new WebpackDevServer(compiler, devServerOptions);
	server.listen(webpackConfig.devServer.port, webpackConfig.devServer.host, () => {
		console.log(`Your application is running here: http://${webpackConfig.devServer.host}:${port}`);
	});
});


