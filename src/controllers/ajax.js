import sql from 'node-transform-mysql'
import {
    SYSTEM
} from '../config'
import {
    util,
    mysql,
    getsql,
} from '../tool'

class ajax {
    //初始化对象
    constructor() {

    };
    // 获得ajax页面列表
    async getajaxlist(ctx){
        try {
            // let selectTime    = ctx.request.body.selectTime
            let method    = ctx.request.body.method
            let sqlstr = sql
                .table('web_ajax')
                .where({method:method})
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
}

module.exports = new ajax();

