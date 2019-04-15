'use strict'
const fs = require('fs');
const path = require("path");
const utils = require("./utils");
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const { STYLE_DEBUG } = process.env;
const config = require("../config");

//多主题分离打包（暂时弃用）
//选择其中一套主题输出
const THEME_PATH = './src/assets/styles/scss/themes';
const extractLess = new ExtractTextWebpackPlugin(utils.assetsPath(`css/style.[hash].css`));
const styleLoaders = [
	{ loader: 'css-loader', options: {sourceMap: true}},
	{loader: "postcss-loader", options: {sourceMap: true}},
	{ loader: 'sass-loader', options: {sourceMap: true}}];
const resolveToThemeStaticPath = (fileName) => path.resolve(THEME_PATH, fileName);
const themeFileNameSet = fs.readdirSync(`${path.resolve(THEME_PATH)}`);


//全部主题样式集合
const themePaths = themeFileNameSet.map(resolveToThemeStaticPath);
const getThemeName = (fileName) => `theme-${path.basename(fileName, path.extname(fileName))}`;
// 全部 ExtractLessS 的集合
const themesExtractLessSet = themeFileNameSet.map((fileName) => new ExtractTextWebpackPlugin(utils.assetsPath(`css/${getThemeName(fileName)}.[hash].css`)));

//获取当前配置的node的传进来的参数
const processArgv = require("./process.argv.json");
const argvArguments = processArgv || [];
const indexArgv = argvArguments.indexOf("--theme");
let theme = null;
if (indexArgv > 0) {
	theme = argvArguments[indexArgv + 1];
}
// console.log(processArgv, "我是主题", theme);
//配置选择的ExtractLessSet集合
const selectThemes = themeFileNameSet.filter((fileName) => theme === fileName || fileName === "default");
const selectTheme = selectThemes.filter((fileName, index) => {
	const length = selectThemes.length;
	if (length > 1) {
		return fileName !== "default"
	} else {
		return fileName === "default"
	}
});
const selectThemePaths = selectTheme.map(resolveToThemeStaticPath);
const selectThemesExtractLessSet = selectTheme.map((fileName) => new ExtractTextWebpackPlugin(utils.assetsPath(`css/${getThemeName(fileName)}.[hash].css`)));
// 主题 Loader 的集合
const themeLoaderSet = selectTheme.map((fileName, index) => ({
	test: /.(scss|css)$/,
	include: resolveToThemeStaticPath(fileName),
	loader: selectThemesExtractLessSet[index].extract({
		use: styleLoaders,
		fallback: "vue-style-loader"
	})
}));

module.exports = {
	THEME_PATH,
	extractLess,
	styleLoaders,
	resolveToThemeStaticPath,
	themeFileNameSet,
	themePaths,
	themesExtractLessSet,
	selectThemes,
	selectTheme,
	selectThemePaths,
	selectThemesExtractLessSet,
	themeLoaderSet
};
