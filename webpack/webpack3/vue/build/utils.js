"use strict";
const path = require("path");
const config = require("../config");
const ExtractTextWebpackPlugin = require("extract-text-webpack-plugin");
const packageConfig = require("../package.json");
const fs = require("fs");

const assetsPath = function(_path) {
	const assetsSubDirectory = process.env.NODE_ENV === "production"
	? config.build.assetsSubDirectory : config.dev.assetsSubDirectory;
	return path.posix.join(assetsSubDirectory, _path);
};

const resolve = function(dir) {
	return path.join(__dirname, "..", dir);
};

const cssLoaders = function (options) {
	options = options || {};
	const cssLoader = {
		loader: "css-loader",
		options: {
			sourceMap: options.sourceMap
		}
	};
	const postcssLoader = {
		loader: "postcss-loader",
		options: {
			sourceMap: options.sourceMap
		}
	};
	function generateLoaders (loader, loaderOptions) {
		const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader];
		if (loader) {
			loaders.push({
				loader: loader + "-loader",
				options: Object.assign({}, loaderOptions, {
					sourceMap: options.sourceMap
				})
			});
		}
		if (options.extract) {
			return ExtractTextWebpackPlugin.extract({
				use: loaders,
				fallback: "vue-style-loader"
			});
		} else {
			return ["vue-style-loader"].concat(loaders);
		}
	}
	return {
		css: generateLoaders(),
		postcss: generateLoaders(),
		less: generateLoaders("less"),
		sass: generateLoaders("sass", { indentedSyntax: true }),
		scss: generateLoaders("sass"),
		stylus: generateLoaders("stylus"),
		styl: generateLoaders("stylus")
	};
};

const styleLoaders = function (options) {
	const output = [];
	const loaders = cssLoaders(options);
	for (const extension in loaders) {
		const loader = loaders[extension];
		output.push({
			test: new RegExp("\\." + extension + "$"),
			use: loader
		});
	}
	return output;
};

const createNotifierCallback = () => {
	const notifier = require("node-notifier");

	return (severity, errors) => {
		if (severity !== "error") {return;}

		const error = errors[0];
		const filename = error.file && error.file.split("!").pop();

		notifier.notify({
			title: packageConfig.name,
			message: severity + ": " + error.name,
			subtitle: filename || "",
			icon: path.join(__dirname, "logo.png")
		});
	};
};

const getArgv = (config, argv = []) => {
	const argvArguments = process.argv || argv;
	const indexArgv = argvArguments.indexOf(config);
	let name = null;
	if (indexArgv > 0) {
		name = argvArguments[indexArgv + 1];
	}
	return name;
};

const projectName = () => {
	const processArgv = require("./process.argv.json");
	const argvArguments = processArgv || [];
	const indexArgv = argvArguments.indexOf("--project");
	let projectName = null;
	if (indexArgv > 0) {
		projectName = argvArguments[indexArgv + 1];
	}
	return projectName;
};

const appConfigFiles = () => {
	const components = [];
	const files = fs.readdirSync(path.resolve(__dirname, "../static"));
	files.map((file) => {
		components.push(file.split(".")[0]);
	});
	return components;
};

module.exports = {
	assetsPath,
	resolve,
	cssLoaders,
	styleLoaders,
	createNotifierCallback,
	projectName,
	getArgv,
	appConfigFiles
};
