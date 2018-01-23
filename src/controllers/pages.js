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
    // 获得pages页面列表
    async getPageList(ctx){
        try {
            let pageNo    = ctx.request.body.pageNo || 1
            let pageSize  = ctx.request.body.pageSize || SYSTEM.PAGESIZE
            let beginTime = ctx.request.body.beginTime || ''
            let endTime = ctx.request.body.endTime || ''
            
            let sqlTotal = `SELECT count(1) as count FROM web_pages group by url`
            let total = await mysql(sqlTotal);
            let totalNum = 0
            if(total.length) totalNum = total.length

            // let 
            let data = beginTime&&endTime?{createTime:{egt:beginTime,elt:endTime}}:{}
            let sqlstr = sql.field(`url,
                                avg(loadTime) as loadTime,
                                avg(dnsTime) as dnsTime,
                                avg(tcpTime) as tcpTime,
                                avg(domTime) as domTime,
                                avg(pageTime) as pageTime,
                                avg(resourceTime) as resourceTime,
                                avg(whiteTime) as whiteTime,
                                avg(redirectTime) as redirectTime,
                                avg(unloadTime) as unloadTime,
                                avg(requestTime) as requestTime,
                                avg(analysisDomTime) as analysisDomTime,
                                avg(readyTime) as readyTime,
                                count(url) as count
                                `).table('web_pages')
                            .group('url')
                            .page(pageNo,pageSize)
                            .where(data)
                            .select()
            console.log(sqlstr)
            // let sqlstr =`select avg(loadTime) as loadTime,
            //                     avg(dnsTime) as dnsTime,
            //                     avg(tcpTime) as tcpTime,
            //                     avg(domTime) as domTime,
            //                     avg(resourceTime) as resourceTime,
            //                     avg(whiteTime) as whiteTime,
            //                     avg(redirectTime) as redirectTime,
            //                     avg(unloadTime) as unloadTime,
            //                     avg(requestTime) as requestTime,
            //                     avg(analysisDomTime) as analysisDomTime,
            //                     avg(readyTime) as readyTime,
            //                     url,count(url) as count from web_pages group by url limit 0,4
            //                     `
            let result = await mysql(sqlstr);

            ctx.body = util.result({
                data: {
                    totalNum:totalNum,
                    datalist:result
                }
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

