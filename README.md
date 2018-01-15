#zane-koa2-ejs-mysql


### 项目采用 koa2+gulp+mysql 搭建的一套后台前端集成模板

##项目通过gulp-nodemon 实时编译刷新node服务


##项目目录结构
```js
	assets    
	build 
		server.js     	项目启动文件 babel 编译
	dist   				打包好的项目文件	
	logs                pm2运行时生成的日志文件
	noode_modules      
	src
		controllers     
			index.js    controller入口文件
			email.js    nodemailer 邮件发送controller
			common.js   公共接口，比如：验证接口来源，检测接口参数，公共用户信息等
			......
		models
		routes
			index.js    路由入口
			......
		tool
			index.js    入口文件
			getsql.js   对mysql 的增删改查 语句的封装
			mysql.js    mysql配置文件
			util.js     工具函数
	.babelrc
	.gitignore
	gulpfile.js         gulp配置
	package.json
	pm2.config.json     pm2配置
	README.md		

```

### 说明

```html
	项目使用babel编译
	项目通过gulp-nodemon 实时编译刷新node服务
	提供了mysql的封装函数 和案例 （我自己开发使用时做的）
	提供了邮件发送 nodemailer 配置
	提供了七牛云上传JDK

```



##运行方式
```js
	开发环境：npm run dev

	打包：npm run build

	启动项目：npm run server

	pm2启动方式：npm run pm2

```




