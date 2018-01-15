import {
    util,
    mysql,
    getsql,
    qiniu,
} from '../tool'
import {
    SYSTEM
} from '../config'

class common {

    constructor() {

    }

    // 验证github来源信息
    async checkGitHubInfo(ctx,next){
        let req = ctx.request.body

        if(!req.state || req.state!='merged'){
            console.log('不是出于合并状态!')
            return false
        }

        if(!req.target_branch || req.target_branch!='master'){
            console.log('提交代码的分支不是master分支!')
            return false
        }
        if(req.password != 'qimingxing'){
            console.log('请求地址验证密码有误!')    
            return false
        }

        return next();
    };

    // 验证来源 && 验证签名
    async checkRequestUrl(ctx, next) {
        let verSource = util.verSource(ctx)
        let checkSigin = util.checkSiginHttp(ctx);
        if (verSource && checkSigin) {
            return next();
        } else {
            console.log('域名来源验证有误')
        }
    };

    // 验证来源 && 验证签名 && 验证是否登录
    async checkIsLogin(ctx, next){
        let verSource = util.verSource(ctx)
        let checkSigin = util.checkSiginHttp(ctx);
        let username = ctx.cookies.get('npm-username');
        let secretKey = ctx.cookies.get('npm-secretKey');

        if(!username || !secretKey){
            ctx.body = util.result({
                code: 1004,
                desc: "该用户未登录！"
            });
        }
        
        if(username != SYSTEM.USERMSG.USERNAME){
            ctx.body = util.result({
                code: 1004,
                desc: "用户登录异常，请重新登录！"
            });
            return;
        }

        if(!secretKey){
            ctx.body = util.result({
                code: 1004,
                desc: "用户登录异常，请重新登录！"
            });
            return;
        }
      
        /*⬆️⬆️⬆️⬆通过了登录验证️⬆️⬆️⬆️⬆️⬆️⬆️*/
        if (verSource && checkSigin) {
            return next();
        } else {
            ctx.body = util.result({
                code: 1001,
                desc: "验证有误！"
            });
            console.log('域名来源验证有误')
            return;
        }
    }

    // 上传图片接口
    async uploadImgs(ctx, next) {
        try {
            let file = ctx.request.body.files.file;
            let key = await qiniu.upload(file.path)
            if (key) {
                ctx.body = util.result({
                    data: key
                });
            } else {
                ctx.body = util.result({
                    code: 1001,
                    desc: "上传失败"
                });
            }
        } catch (err) {
            console.log(err)
            ctx.body = util.result({
                code: 1001,
                desc: "参数错误"
            });
            return;
        }
    }

    // 富文本上传文件地址
    async fwbUploadImgs(ctx, next) {
        try {
            let file = ctx.request.body.files.file;
            let key = await qiniu.upload(file.path)
            if (key) {
                ctx.body = util.result({
                    code: 1000,
                    errno: 0,
                    data: key
                });
            } else {
                ctx.body = util.result({
                    code: 1001,
                    errno: 1,
                    desc: "上传失败"
                });
            }
        } catch (err) {
            console.log(err)
            ctx.body = util.result({
                code: 1001,
                errno: 1,
                desc: "参数错误"
            });
            return;
        }
    }

}

module.exports = new common();