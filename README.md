#web-performance-monitoring-system 前端性能监控系统


### 项目采用 koa2+gulp+mysql 搭建的一套后台前端集成模板
### 项目通过gulp-nodemon 实时编译刷新node服务

>  * 实时统计访问页面真实性能分析
>  * 实时统计页面AJAX性能分析
>  * 实时统计访问页面脚本错误分析 
>  * 实时统计页面所有资源加载性能分析 
>  * 实时统计慢加载资源追踪 
>  * 设置各项阀值，邮件通知，紧急修改维护
>  * 模拟单个http请求，并给出性能指标，可做接口测试
>  * 检查线上网页性能，给出详细性能指标

### 项目说明
```html
项目使用babel编译   
项目通过gulp-nodemon 实时编译刷新node服务
提供了mysql的封装函数 和案例 （我自己开发使用时做的）
提供了邮件发送 nodemailer 配置
提供了七牛云上传JDK
```

### 新增https部署方式 
https秘钥部署方式参考：[云服务器HTTPS实践，node.js + nginx https实践](https://blog.seosiwei.com/detail/29)

```js
如果项目不需要https部署，package.json中需要做如下操作
build命令 ：IS_HTTPS=FALSE
server命令：IS_HTTPS=FALSE
```

### 使用pm2启动项目方式(推荐第二或第三种方式启动)
```js
1、 直接启动app.js
pm2 start -i 2 --name web_performance app.js

2、 使用npm server命令 
pm2 start -i 2 --name web_performance npm -- run server

3、 使用npm pm2 命令
npm run pm2

```

### 项目总结
http://blog.seosiwei.com/detail/19

### 页面性能、资源、错误、ajax，fetch请求上报插件performance-report：
https://github.com/wangweianger/web-performance-report

### 新版本性能监控系统 性能更强，代码更健全，架构更清晰，支持高并发（开发中）
https://github.com/wangweianger/egg-mongoose-performance-system

# 项目详细安装说明

项目上传之后，比较受大家的关注，有些朋友不知道如何在本地正确的安装，让项目跑起来,鉴于此我在这里详细的说明项目安装步骤，希望对你有帮助。
### 一：安装环境
* node.js v8.0(推荐)
* 本项目需要node.js支持async await的语法因此node需要7.6版本以上，建议使用node.js 8.0版本，推荐大家使用nvm安装node.js
* nvm github官网：https://github.com/creationix/nvm    有详细的安装教程
* linux系统的童鞋安装请参考：[LINUX系统安装nvm 快速搭建Nodejs开发环境](http://blog.seosiwei.com/detail/3)

### 二：项目数据库为mysql，你需要在本地安装mysql,版本需要v5.6以上 
* 备注：安装mysql时会给你默认账户、密码，有提示，自己记录下后期项目配置需要
* 官网下载地址：https://www.mysql.com/downloads/   推荐大家直接百度搜索 mysql下载 关键词下载百度软件中心的mysql
* linux系统的童鞋安装请参考：[阿里云ECS在linux系统下手动安装MySQL5.6](http://blog.seosiwei.com/detail/1)
* 安装完mysql之后新建web-performance数据库，默认字符集选择：utf8mb4,默认排序规则选择：utf8mb4_bin,然后导入项目中的web-performance.sql文件

### 三：安装项目依赖
* cnpm install 
* 因为项目使用了phantomjs 在安装依赖的时候会去国外下载资源，推荐有vpm的开vpm,没有vpm的就使用淘宝镜像源，或者使用cnpm

### 四：安装完成后配置
* 做完以上步骤之后你需要修改下项目的配置文件，即：src/config.js 中的 DB 配置，
* HOST配置填写为 localhost 或者你本地ip地址
* USER 和 PASSWORD 请填写你本地的mysql账户和密码，安装mysql时会给你默认账户、密码，有提示。

如果你已经做完以上4步，请运行 npm run dev,项目应该会正常的跑起来；

### 其他说明：
* 1.项目数据库中有一个默认用户账号为：zane 密码：123456
* 2.src/config.js 中的 七牛云根路径配置和用户邮箱配置暂时未用上，可以不管理，后期项目开发邮件预警的时候会用上
* 3.项目打包时配置 也就是gulpfile.js 会有config.js的配置替换，如果需要在线上运行，需要去留意
* 4.如果需要在linux系统上跑起来请参考：[个人博客node.js，mysql 项目阿里云ECS部署完整流程介绍](http://blog.seosiwei.com/detail/6)

### 关于package.json的运行命令说明 
* 1.dev 是开发模式，开发运行
* 2.build是线上生产模式,打包时运行
* 3.server是开启一个node服务，需要先bulid之后再运行
* 4.pm2是使用pm2来守护我们的node.js进程以及记录日志，需要本地安装pm2，linux用户需要当前角色有写入目录日志的权限
* 5.test-build此命令是直接本地打包直接发布到服务端，服务端需要有相应的接受脚本，此命令大家用不上 

希望对前端性能监控有兴趣的有帮助，同时也希望大家有任何建议请给我反馈，同时我也会不断的更新优化迭代，有兴趣的请持续关注。

## 项目中有频繁的用到我封装的另一个库：mysqls
如果你对其api语法不了解可以关注：https://github.com/wangweianger/mysqls 项目，其中有完善的api文档说明

## 配置nginx反向代理
* 如果你的web服务为nginx，请加上如下配置，用以获取用户的真实ip 
```js
location / {
    #获取用户的真实ip
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    #代理的服务 
    proxy_pass    http://127.0.0.1:18088/;
}
```

## 运行方式
```js
开发环境：npm run dev

打包：npm run build

启动项目：npm run server

pm2启动方式：npm run pm2
```

### DEMO图片
![](https://github.com/wangweianger/web-performance-monitoring-system/blob/master/demo/01.png "")
![](https://github.com/wangweianger/web-performance-monitoring-system/blob/master/demo/02.png "")
![](https://github.com/wangweianger/web-performance-monitoring-system/blob/master/demo/03.png "")
![](https://github.com/wangweianger/web-performance-monitoring-system/blob/master/demo/04.png "")
![](https://github.com/wangweianger/web-performance-monitoring-system/blob/master/demo/05.png "")
![](https://github.com/wangweianger/web-performance-monitoring-system/blob/master/demo/06.png "")
![](https://github.com/wangweianger/web-performance-monitoring-system/blob/master/demo/07.png "")
