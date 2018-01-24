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
    // 根据markPage获得页面资源信息
    async getSourcesForMarkPage(ctx){
        try {
            let markPage      = ctx.request.body.markPage
            if(!markPage){
                ctx.body = util.result({
                    code: 1001,
                    desc: 'markPage参数有误!'
                });
                return
            }
            // 请求列表数据
            let sqlstr = sql
                .table('web_sources')
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

