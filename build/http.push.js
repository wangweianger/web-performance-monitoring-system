/**
 * @author wangwei
 * @since 17/4/1
 */
var fs = require('fs');
var path = require('path');
var u = require('underscore');
var request = require('request');
var log = require('log-util');
var chalk = require('chalk');
var Promise = require('bluebird')
var targz = require('tar.gz');
var exec = require('child_process').exec;

/**
 * http上传插件
 *
 * @param options
 * @param options.receiver
 * @param options.to
 * @param options.token
 *
 * @constructor
 */
class HttpPush {
    //初始化对象
    constructor(option){
        this.option=option
        this.uploadFiles();
    };

    //上传文件
    uploadFiles(){
        this.walkDir(this.option.buildDir+'/',src=>{
            let arr=this.option.buildDir.split('/')
            let arr1=[]
            arr.forEach((item,index)=>{
                if( item != '.' ){
                    arr1.push(item)
                }
            })
            let base=arr1.join('/')
            let file=src.replace(base+'/','')
            let json={
                receiver: this.option.receiver,
                data:this.option.data,
                src:src,
                file:file,
            }
            json.data.basesrc=this.option.to
            if(this.option.tarGzName){
                json.data.to=this.option.to+'/'+this.option.tarGzName
            }else{
                json.data.to=this.option.to+'/'+file
            }

            this.upload(json.receiver,json.data,json.src,json.file,function(err, res){
                if (err) {
                    log.error(json.file + ' - ' + chalk.red('[error] [' + err + ']'));
                }
                else {
                    log.info(json.file +  chalk.green(' [DONE]'));
                }
            });
        });
    };

    //遍历文件
    walkDir (dirPath,fn) {
        let _this=this;
        fs.readdir(dirPath, function (err, entires) {
            for (var idx in entires) {
                var fullPath = path.join(dirPath, entires[idx]);
                (function (fullPath) {
                    fs.stat(fullPath, function (err, stats) {
                        if (stats && stats.isFile()) {
                            fn&&fn(fullPath)
                        } else if(stats && stats.isDirectory()) {
                            _this.walkDir(fullPath,fn);
                        }
                    })
                })(fullPath);
            }
        });
    };

    //http上传函数
    upload(url, data, filepath, subpath, callback) {
        let formData = u.extend(data, {
            file: {
                value: fs.createReadStream(filepath),
                options: {
                    filename: subpath
                }
            }
        });
        request.post({
            url: url,
            formData: formData
        },(err, res, body)=>{
            if (err) {
                callback(err);
                return;
            }
            callback();
        })
    };
};


/*-------------发布代码的类--------------------*/
class httpPushTarGz {

    //初始化对象
    constructor(option){
        //default 设置
        this.option={
            receiver  : 'http://127.0.0.1:1234/receiver',
            distDir   : path.resolve(__dirname, '../dist/targz'),  //生成tar.gz包的文件夹
            proDir    : path.resolve(__dirname, '../dist/test'), //上传的目标文件夹
            copyDir   : path.resolve(__dirname, '../dist/html'), //复制的目标文件夹
            tarGzName : 'build.tar.gz', //压缩后的名字
            to        : '../html',  //服务器 放置目录
            data:{
                isDelDir  : 'yse',  //是否删除服务端文件   no || yes
                exclude   : '',   //服务器不需要删除的文件夹
            }

        }
        this.option=this.extend(this.option,option);

        this.init();
    };

    init(){
        let isHave=fs.existsSync(this.option.distDir)
        if(isHave){
            this.httpPushForTar();
        }else{
            fs.mkdirSync(this.option.distDir)
            this.httpPushForTar();
        }
    };

    //压缩并上传
    httpPushForTar(){
        this.copyDirFn(()=>{
            targz().compress(this.option.copyDir, `${this.option.distDir}/${this.option.tarGzName}`)
                .then(()=>{
                    console.log('Job done!');
                    new HttpPush({
                        receiver: this.option.receiver,
                        buildDir: this.option.distDir,
                        to: this.option.to,
                        data:this.option.data,
                        tarGzName:this.option.tarGzName,
                    })
                })
                .catch((err)=>{
                    console.log('Something is wrong ', err.stack);
                });
        });
    };

    // 复制文件
    copyDirFn(fn){
        let isProDirHave=fs.existsSync(this.option.proDir)
        let isCopyDirHave=fs.existsSync(this.option.copyDir)

        if(!isProDirHave) return false;

        // 没有目标文件创建
        if(isProDirHave&&!isCopyDirHave){
            exec(`cp -a ${this.option.proDir} ${this.option.copyDir}` , (err,out)=>{
                if(err){console.log(err); };
                fn&&fn()
            });
            //有目标文件先删除再创建
        }else if(isProDirHave&&isCopyDirHave){
            exec(`rm -rf ${this.option.copyDir}` ,(err,out)=>{
                if(err){console.log(err); };
                exec(`cp -a ${this.option.proDir} ${this.option.copyDir}` ,(err,out)=>{
                    if(err){console.log(err); };
                    fn&&fn()
                });
            });
        }
    };

    // extend
    extend(json1,json2){
        for(let key in json2){
            if(typeof(json2[key])=='object'){
                for(let k in json2[key]){
                    json1[key][k] = json2[key][k]
                }
            }else{
                json1[key] = json2[key]
            }
        }
        return json1;
    };
}

module.exports = httpPushTarGz;