"use strict";
const path = require("path");
const webpack = require("webpack");
const rm = require("rimraf");

//删除文件夹以及文件夹里的文件
rm(path.join(path.resolve(__dirname, "../dist")), (err) => {
	if (err) {throw err;}
	// console.log(msg);
	// webpack(webpackConfig, (err, stats) => {
	// 	if (err) {throw err;}
	// 	// console.log(JSON.parse(stats).errors);
	// });
});
