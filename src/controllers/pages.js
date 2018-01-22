import sql from 'node-transform-mysql'
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
    // 获得ajax页面列表
    async getPageList(ctx){
        console.log('---------')
        try {
            // let selectTime    = ctx.request.body.selectTime
            // let method    = ctx.request.body.method
            let sqlstr =`select avg(loadTime) as loadTime,
                                avg(dnsTime) as dnsTime,
                                avg(tcpTime) as tcpTime,
                                avg(domTime) as domTime,
                                avg(resourceTime) as resourceTime,
                                avg(whiteTime) as whiteTime,
                                avg(redirectTime) as redirectTime,
                                avg(unloadTime) as unloadTime,
                                avg(requestTime) as requestTime,
                                avg(analysisDomTime) as analysisDomTime,
                                avg(readyTime) as readyTime,
                                url,count(url) as count from web_pages group by url
                                `
            console.log(sqlstr)

            let result = await mysql(sqlstr);

            console.log(result)

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

module.exports = new pages();

