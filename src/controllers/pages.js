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
    // 获得pages页面列表
    async getPageList(ctx){
        try {
            let pageNo    = ctx.request.body.pageNo || 1
            let pageSize  = ctx.request.body.pageSize || SYSTEM.PAGESIZE
            let beginTime = ctx.request.body.beginTime || ''
            let endTime = ctx.request.body.endTime || ''
            
            // 公共参数
            let data = beginTime&&endTime?{createTime:{egt:beginTime,elt:endTime}}:{}
            let sqlTotal = sql.field('count(1) as count').table('web_pages').where(data).group('url').select() 
            let total = await mysql(sqlTotal);
            let totalNum = 0
            if(total.length) totalNum = total.length

            // 请求列表数据
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
    // 页面性能详情
    async getPageItemDetail(ctx){
        try {
            let pageNo    = ctx.request.body.pageNo || 1
            let pageSize  = ctx.request.body.pageSize || SYSTEM.PAGESIZE
            let beginTime = ctx.request.body.beginTime || ''
            let endTime = ctx.request.body.endTime || ''
            let url    = ctx.request.body.url

            if(!url){
                ctx.body = util.result({
                    code: 1001,
                    desc: '参数有误!'
                });
                return
            }

            // 请求参数
            let data={url:url}
            if(beginTime&&endTime) data.createTime={egt:beginTime,elt:endTime}

            // 获得总条数
            let sqlTotal = sql.field('count(1) as count').table('web_pages').where(data).select() 
            let total = await mysql(sqlTotal);
            let totalNum = 0
            if(total.length) totalNum = total.length

            // 获得列表
            let sqlstr = sql
                .table('web_pages')
                .where(data)
                .order('createTime')
                .select()
            let result = await mysql(sqlstr);

            if(result&&result.length){
                result.forEach(item=>{
                    item.dateTime = moment(new Date(item.createTime)).format('YYYY-MM-DD HH:mm:ss') 
                })
            }

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

