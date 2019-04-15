"use strict";
const base = require("./base.conf");
const webpackMerge = require("webpack-merge");

const processArgv = require("../build/process.argv.json");
const argvArguments = processArgv || [];
const indexArgv = argvArguments.indexOf("--project");
let projectName = null;
if (indexArgv > 0) {
	projectName = argvArguments[indexArgv + 1];
}

const config = webpackMerge(base, {
	build: {
		assetsPublicPath: projectName ? `/${projectName}/` : '/'
	}
});

console.log(projectName, config.build.assetsPublicPath, "assetsPublicPath");

module.exports = config;
