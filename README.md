#web-performance-monitoring-system 前端自动发布系统


### 项目采用 koa2+gulp+mysql 搭建的一套后台前端集成模板
### 项目通过gulp-nodemon 实时编译刷新node服务

>  * 实时统计访问页面真实性能分析
>  * 实时统计页面AJAX性能分析
>  * 实时统计访问页面脚本错误分析
>  * 实时统计页面所有资源加载性能分析
>  * 实时统计慢加载资源追踪
>  * 设置各项阀值，邮件通知，紧急修改维护


### 项目说明
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




