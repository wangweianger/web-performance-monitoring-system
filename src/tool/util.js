import md5 from 'md5'
import fs from 'fs'
import path from 'path'
import {
    SYSTEM
} from '../config'

//config配置
class util {

    constructor() {

    }

    // 返回结果json
    result(jn = {}) {
        return Object.assign({
            code: 1000,
            desc: '成功',
            data: ''
        }, jn);
    }

    // 错误返回
    /*  
    **  ctx        //ctx
    **  err      //err
    **  code    //错误码
    */
    errResult(ctx, err, code = '') {
        let errCode = [
            {code:1002,desc:'服务异常'},
            {code:1003,desc:'必填参数缺失！'},
            {code:1004,desc:'用户未登录！'},
        ];
        let desc = '未知错误！';
        errCode.forEach((item)=>{
            if(item.code == code){
                desc = item.desc; 
            }
        });
        console.log(err);
        ctx.body = this.result({
            desc:desc,
            code:code
        });
    }

    // 检查接口来源权限
    checkReferer(cxt) {
        let begin = false;
        let url = SYSTEM.ORIGIN
        let header = cxt.request.header

        url = SYSTEM.ORIGIN

        if (header.referer.indexOf(url) != -1 ) {
            begin = true;
        }
        return begin;
    }

    // 验证域名来源、
    verSource(ctx) {
        let referer = this.checkReferer(ctx);
        if (!referer) {
            ctx.body = this.result({
                code: 1001,
                desc: '域名来源未通过！'
            });
            return false;
        } else {
            return true;
        }
    };

    // http 签名验证验证参数
    checkSiginHttp(ctx) {
        let datas = ctx.request.body
        if (!datas) {
            ctx.body = this.result({
                code: 1001,
                desc: '缺少必要的验证签名参数！'
            });
            return false;
        }
        let getSign = null;


        if (typeof(datas) == 'string') {
            datas = JSON.parse(datas)
        }

        if (datas.fields) {
            getSign = datas.fields.getSign
        } else {
            getSign = datas.getSign
        }

        if (typeof(getSign) == 'string') {
            getSign = JSON.parse(getSign)
        }

        if (!getSign || !getSign.time || !getSign.random || !getSign.paySign) {
            return false;
        };
        let sigin = this.signwx({
            name: 'wangwei',
            company: 'morning-star',
            time: getSign.time,
            random: getSign.random
        });
        if (sigin.paySign === getSign.paySign) {
            return true;
        } else {
            ctx.body = this.result({
                code: 1001,
                desc: '签名验证未通过！'
            });
            return false;
        }
    };

    /*本地加密算法*/
    signwx(json) {
        var wxkey = 'ZANEWANGWEI123456AGETEAMABmiliH';
        /*对json的key值排序 */
        var arr = [];
        var sortJson = {};
        var newJson = json;
        for (var key in json) {
            if (json[key]) {
                arr.push(key);
            }
        }
        arr.sort(function(a, b) {
            return a.localeCompare(b);
        });
        for (var i = 0, len = arr.length; i < len; i++) {
            sortJson[arr[i]] = json[arr[i]]
        }
        /*拼接json为key=val形式*/
        var str = "";
        for (var key in sortJson) {
            str += key + "=" + sortJson[key] + '&';
        }
        str += 'key=' + wxkey;
        /*md5*/
        var md5Str = md5(str);
        var signstr = md5Str.toUpperCase();
        /*获得有sign参数的json*/
        newJson['paySign'] = signstr;
        return newJson;
    }

    //返回备注
    returnBeiZhu(str) {
        return `
            --------------------------------------------------------------------------------------------------------------------
            --------------------------------------------------------------------------------------------------------------------
            --------------------------------------------------------------------------------------------------------------------
            --------------------------------------------------------------------------------------------------------------------
            --------------------------------------------------${str}---------------------------------------------
            --------------------------------------------------------------------------------------------------------------------
            --------------------------------------------------------------------------------------------------------------------
            --------------------------------------------------------------------------------------------------------------------
            --------------------------------------------------------------------------------------------------------------------
        `
    }

    /*生成随机字符串*/
    randomString(len) {　　
        len = len || 32;　　
        var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/ 　　
        var maxPos = $chars.length;　　
        var pwd = '';　　
        for (let i = 0; i < len; i++) {　　　　
            pwd += $chars.charAt(Math.floor(Math.random() * maxPos));　　
        }　　
        return pwd;
    }

    // 文件大小换算
    returnFileSize(bumber){
        let size    =   bumber;
        let defaudw =   1024;
            size    =   Math.ceil(size/defaudw)
        if(size >= defaudw){
            size    =   (size/defaudw).toFixed(2)
            if(size >= defaudw){
                size    =   (size/defaudw).toFixed(2)
                return size+'G'
            }else{
                return size+'M'
            }
        }else{
            return size+'KB'
        }    
    }

    // 遍历某文件下面文件列表信息
    getSomeFileChildDirList(dir){
        let val = []
        let result = fs.readdirSync(dir)
        if(result&&result.length){
            result.forEach(item=>{
                let stat = fs.lstatSync(dir+item)
                if(stat.isDirectory()&&item!='.git'){
                    val.push(item)
                }
            })
        }
        return val;
    }

    //Pager分页
    /*  
    **  list        //数据源
    **  page      //当前页数
    **  pageSize    //每页个数
    */
    Pager(obj){
        let result = {};
        result['data'] = obj.data||[];
        result['pageNo'] = obj.pageNo||1;
        result['pageSize'] = obj.pageSize||result.data.length;
        result['totalNum'] = result.data.length;
        result['list'] = result.data.splice((result.pageNo-1)*result.pageSize, result.pageSize);
        delete result.data;
        return result;
    }

    /*传入一个对象，返回该对象的值不为空的所有参数，并返回一个对象
    obj   object    传入的对象
    */
    objDislodge(obj) {
        var objData = JSON.parse(JSON.stringify(obj));
        for (var n in objData) {
            if (objData[n] == null || objData[n] == '') {
                delete objData[n]
            }
        }
        return objData;
    }

    /*传入一个json对象，返回该对象的值不为空的所有参数，并返回一个对象
    json   object    传入的对象
    */
    jsonDislodge(json) {
        var objData = JSON.parse(JSON.stringify(obj));
        objData.forEach((item, index) => {
            for (let n in item) {
                if (item[n] == null || item[n] == '') {
                    delete item[n]
                }
            }
        })
        return objData;
    }

    //node删除文件夹内的所有文件
    cleanFiles(pathImg){
        //删除上传到本地的文件
        let files = fs.readdirSync(pathImg);
        files.forEach(function (file, index) {
            var curPath = pathImg + "/" + file;
            if(fs.statSync(curPath).isDirectory()) { // recurse  
                deleteall(curPath);  
            } else { // delete file  
                fs.unlinkSync(curPath);  
            }  
        })
    }
}

module.exports = new util();



