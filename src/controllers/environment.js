import sql from 'node-transform-mysql'
import moment from 'moment'
import {
    SYSTEM
} from '../config'
import {
    util,
    mysql,
    getsql,
} from '../tool'

class pages {
    //初始化对象
    constructor() {

    };
    // 根据url查询浏览器分类情况
    async getDataForEnvironment(ctx){
        try {
            let beginTime   = ctx.request.body.beginTime || ''
            let endTime     = ctx.request.body.endTime || ''
            let url         = ctx.request.body.url
            let type        = ctx.request.body.type || 1

            if(!url){
                ctx.body = util.result({
                    code: 1001,
                    desc: 'url参数有误!'
                });
                return
            }


            let field = ''
            let group = ''
            switch(parseInt(type)){
                case 1:
                    field = 'browser,borwserVersion,count(1) as count'
                    group = 'browser,borwserVersion'
                    break;
                case 2:
                    field = 'system,systemVersion,count(1) as count'
                    group = 'system,systemVersion'
                    break;
                case 3:
                    field = 'city,count(1) as count'
                    group = 'city'
                    break;        
            }

            // 公共参数
            let data={url:url}
            if(beginTime&&endTime) data.createTime = {egt:beginTime,elt:endTime}

            // 请求列表数据
            let sqlstr = sql.field(field).table('web_environment')
                .where(data)
                .group(group)
                .limit(0,6)
                .select()

            let result = await mysql(sqlstr);
            ctx.body = util.result({
                data: result
            });

        } catch (err) {
            console.log(err)
            ctx.body = util.result({
                code: 1001,
                desc: '系统错误!'
            });
            return '';
        }
    }
    // 根据markPage获取用户系统信息
    async getUserEnvironment(ctx){
        try {
            let markPage   = ctx.request.body.markPage

            if(!markPage){
                ctx.body = util.result({
                    code: 1001,
                    desc: 'markPage参数有误!'
                });
                return
            }

            // 请求列表数据
            let sqlstr = sql
                .table('web_environment')
                .where({markPage:markPage})
                .select()

            let result = await mysql(sqlstr);

            ctx.body = util.result({
                data: result&&result.length?result[0]:{}
            });

        } catch (err) {
            console.log(err)
            ctx.body = util.result({
                code: 1001,
                desc: '系统错误!'
            });
            return '';
        }
    }

    
    
}

module.exports = new pages();

