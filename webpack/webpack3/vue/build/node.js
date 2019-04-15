const fs = require('fs');
//写入json文件选项
function writeProcessArgv() {
	console.log(process.argv);
	fs.writeFile('./build/process.argv.json', JSON.stringify(process.argv || []), function(err) {
		if (err) {
			console.error(err);
		}
		// console.log('----------新增成功-------------');
	})
}
writeProcessArgv();//执行一下;
