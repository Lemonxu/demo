"use strict";
const path = require("path");
const webpack = require("webpack");
const fs = require("fs");
const webpackBaseConfig = require("./webpack.base.conf");
const webpackMerge = require("webpack-merge");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const ExtractTextWebpackPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const config = require("../config");
const utils = require("./utils");
const env = require("../config/prod.env");
const HtmlWebpackExcludeAssetsPlugin = require('html-webpack-exclude-assets-plugin');

const projectName = utils.projectName();
const appConfigFiles = utils.appConfigFiles();

const webpackConfig = webpackMerge(webpackBaseConfig, {
	devtool: config.build.productionSourceMap ? config.build.devtool : false,
	module: {
		rules: utils.styleLoaders({
			sourceMap: config.build.productionSourceMap,
			extract: true,
			usePostCSS: true
		})
	},
	output: {
		path: config.build.assetsRoot,
		filename: utils.assetsPath("js/[name].[chunkhash].js"),
		chunkFilename: utils.assetsPath("js/[id].[chunkhash].js"),
		publicPath: config.build.assetsPublicPath
	},
	plugins: [
		new CleanWebpackPlugin(),
		new UglifyJsPlugin({
			uglifyOptions: {
				compress: {
					warnings: false,
					drop_debugger: true,
					drop_console: true
				}
			},
			sourceMap: config.build.productionSourceMap,
			parallel: true
		}),
		new webpack.DefinePlugin({
			'process.env': env
		}),
		// new webpack.DefinePlugin({
		// 	PRODUCTION: JSON.stringify(true),
		// 	BROWSER_SUPPORTS_HTML5: true,
		// 	"process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
		// }),
		new ExtractTextWebpackPlugin({
			filename: utils.assetsPath("css/[name].[chunkhash].css"),
			allChunks: true
		}),
		new OptimizeCssAssetsWebpackPlugin({
			cssProcessorOptions: config.build.productionSourceMap
				? { safe: true, map: { inline: false } }
				: { safe: true }
		}),
		new HtmlWebpackPlugin({
			filename: config.build.index,
			template: "index.html",
			inject: true,
			minify: {
				removeComments: true,
				collapseWhitespace: true,
				removeAttributeQuotes: true
			},
			chunksSortMode: "dependency",
			// excludeChunks: ['themes'],
			excludeAssets: [/themes.*.js/] //, /style.*.css/
		}),
		new HtmlWebpackExcludeAssetsPlugin(),
		new webpack.HashedModuleIdsPlugin(),
		new webpack.optimize.ModuleConcatenationPlugin(),
		new webpack.optimize.CommonsChunkPlugin({
			name: "vendor",
			minChunks (module) {
				// any required modules inside node_modules are extracted to vendor
				return (
					module.resource &&
					/\.js$/.test(module.resource) &&
					module.resource.indexOf(
						path.join(__dirname, "../node_modules")
					) === 0
				);
			}
		}),
		new webpack.optimize.CommonsChunkPlugin({
			name: "manifest",
			minChunks: Infinity
		}),
		new webpack.optimize.CommonsChunkPlugin({
			name: "app",
			async: "vendor-async",
			children: true,
			minChunks: 3
		}),
		new CopyWebpackPlugin([
			{
				from: path.resolve(__dirname, "../static"),
				to: config.build.assetsSubDirectory,
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

if (config.build.productionGzip) {
	const CompressionWebpackPlugin = require("compression-webpack-plugin");

	webpackConfig.plugins.push(
		new CompressionWebpackPlugin({
			asset: "[path].gz[query]",
			algorithm: "gzip",
			test: new RegExp(
				"\\.(" +
				config.build.productionGzipExtensions.join("|") +
				")$"
			),
			threshold: 10240,
			minRatio: 0.8
		})
	);
}

if (config.build.bundleAnalyzerReport) {
	const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
	webpackConfig.plugins.push(new BundleAnalyzerPlugin());
}

// console.log(webpackConfig.module.rules);
module.exports = webpackConfig;
