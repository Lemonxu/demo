"use strict";
const path = require("path");
const webpack = require('webpack');
const fs = require('fs');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const utils = require("./utils");
const config = require("../config");

const createLintingRule = () => ({
	test: /\.(js|vue|ts|tsx)$/,
	loader: "eslint-loader",
	enforce: "pre",
	include: [utils.resolve("src"), utils.resolve("test")],
	options: {
		formatter: require("eslint-friendly-formatter"),
		emitWarning: !config.dev.showEslintErrorsInOverlay
	}
});

module.exports = {
	context: path.resolve(__dirname, '../'),
	entry: {
		app: "./src/main.js"
	},
	output: {
		filename: "[name].js",
		path: config.build.assetsRoot,
		publicPath: process.env.NODE_ENV === "production"
			? config.build.assetsPublicPath
			: config.dev.assetsPublicPath
	},
	resolve: {
		extensions: [".js", ".ts", ".vue", ".json"],
		alias: {
			"vue$": "vue/dist/vue.esm.js",
			"@": utils.resolve("src")
		}
	},
	module: {
		rules: [
			...(config.dev.useEslint ? [createLintingRule()] : []),
			{
				test: /\.tsx?$/,
				loader: "ts-loader",
				//这个必须写，不然无法匹配vue文件，上面必须是loader，否则报错
				options: {
					appendTsSuffixTo: [/\.vue$/]
				}
			},
			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				enforce: "pre",
				loader: "tslint-loader"
			},
			{
				test: /\.vue$/,
				loader: "vue-loader",
				options: {
					loaders: utils.cssLoaders({
						sourceMap: process.env.NODE_ENV === "production" ? config.build.productionSourceMap : config.dev.cssSourceMap,
						extract: process.env.NODE_ENV === "production"
					}),
					cssSourceMap: process.env.NODE_ENV === "production" ? config.build.productionSourceMap : config.dev.cssSourceMap,
					cacheBusting: config.dev.cacheBusting,
					transformToRequire: {
						video: ["src", "poster"],
						source: "src",
						img: "src",
						image: "xlink:href"
					}
				}
			},
			{
				test: /\.js$/,
				loader: "babel-loader",
				include: [utils.resolve("src"), utils.resolve("test"), utils.resolve("node_modules/webpack-dev-server/client")]
			},
			{
				test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
				loader: "url-loader",
				options: {
					limit: 10000,
					name: utils.assetsPath("img/[name].[hash:7].[ext]")
				}
			},
			{
				test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
				loader: "url-loader",
				options: {
					limit: 10000,
					name: utils.assetsPath("media/[name].[hash:7].[ext]")
				}
			},
			{
				test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
				loader: "url-loader",
				options: {
					limit: 10000,
					name: utils.assetsPath("fonts/[name].[hash:7].[ext]")
				}
			},
			{
				test: /.html$/,
				use: [
					{
						loader: 'html-loader'
					}
				]
			}
		]
	},
	plugins: [
		new webpack.NamedModulesPlugin()
	],
	node: {
		setImmediate: false,
		dgram: "empty",
		fs: "empty",
		net: "empty",
		tls: "empty",
		child_process: "empty"
	}
};
