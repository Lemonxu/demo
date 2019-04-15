### XTP通用权限管理系统

依次使用命令
```$xslt
npm install

npm run dev //运行

npm run build //打包

```
#### 按照配置打包相应的项目
在./static中进行配置项目信息 <br/>
```$xslt
例如xtp项目,则命名为:xtp.config.js
```
在./package.json中配置命令<br/>
```
"build:xtp": "node build/node.js --project xtp --mode project && npm run build:default"
```
打包的时候直接使用命令
```$xslt
npm run build:xtp
或者直接使用一下命令
node build/node.js --project xtp --mode project && npm run build:default 
注：--project xtp（--project 当前项目名称）
```
配置具体信息注解查看 ./app.config.js



