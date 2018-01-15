import qiniu from 'qiniu'
import util from './util'

//config配置
class qiuniuyun {

    constructor() {
        //要上传的空间
        this.bucket = 'xxx';
        this.init()
    }

    init() {
        qiniu.conf.ACCESS_KEY = 'xxxxxxxx';
        qiniu.conf.SECRET_KEY = 'xxxxxxxx';
    }

    //调用uploadFile上传    
    async upload(filePath) {
        filePath = filePath 
            //上传到七牛后保存的文件名
        let key = util.randomString() + '.png';
        //生成上传 Token
        let token = this.uptoken(this.bucket, key);
        //要上传文件的本地路径


        let imgs = await this.uploadFile(token, key, filePath)
        return imgs
    }

    //构建上传策略函数
    uptoken(bucket, key) {
        let putPolicy = new qiniu.rs.PutPolicy(bucket + ":" + key);
        return putPolicy.token();
    }

    uploadFile(uptoken, key, localFile) {
        var extra = new qiniu.io.PutExtra();
        return new Promise((resolve, reject) => {
            qiniu.io.putFile(uptoken, key, localFile, extra, function(err, ret) {
                if (!err) {
                    // 上传成功， 处理返回值
                    resolve(ret.key)
                } else {
                    // 上传失败， 处理返回代码
                    reject(err)
                }
            });
        });
    }
}

module.exports = new qiuniuyun()

