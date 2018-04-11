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
            let systemId    = ctx.cookie.systemId;
            let pageNo      = ctx.request.body.pageNo || 1
            let pageSize    = ctx.request.body.pageSize || SYSTEM.PAGESIZE
            let beginTime   = ctx.request.body.beginTime || ''
            let endTime     = ctx.request.body.endTime || ''
            let isAllAvg    = ctx.request.body.isAllAvg || true
            let name         = ctx.request.body.name 
            
            // 公共参数
            let data={systemId:systemId}

            if(isAllAvg=='false'){
                if(!name){
                    ctx.body = util.result({
                        code: 1001,
                        desc: 'name参数有误!'
                    });
                    return
                }
                data.name = name
            }

            if(beginTime&&endTime) data.createTime = {egt:beginTime,elt:endTime}

            let totalNum = 0
            if(isAllAvg != 'false'){    
                let sqlTotal = sql.field('count(1) as count').table('web_ajax').where(data).group('name,method').select() 
                let total = await mysql(sqlTotal);
                if(total.length) totalNum = total.length
            }     

            // 请求列表数据
            let sqlstr = sql.field(`name,method,
                    avg(duration) as duration,
                    avg(decodedBodySize) as decodedBodySize,
                    count(name) as count
                    `).table('web_ajax')
                .group('name,method')
                .order('count desc')
                .page(pageNo,pageSize)
                .where(data)
                .select()

            let result = await mysql(sqlstr);

            let valjson = {}
            if(isAllAvg=='false'){
                valjson = result&&result.length?result[0]:{}
            }else{
                valjson.totalNum = totalNum;
                valjson.datalist = result
            }

            ctx.body = util.result({
                data: valjson
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

    // 根据url查询ajax
    async getAjaxMsgForUrl(ctx){
        try {
            let pageNo      = ctx.request.body.pageNo || 1
            let pageSize    = ctx.request.body.pageSize || SYSTEM.PAGESIZE
            let beginTime   = ctx.request.body.beginTime || ''
            let endTime     = ctx.request.body.endTime || ''
            let callUrl     = ctx.request.body.callUrl

            if(!callUrl){
                ctx.body = util.result({
                    code: 1001,
                    desc: '参数有误!'
                });
                return
            }

            // 请求参数
            let data={callUrl:callUrl}
            if(beginTime&&endTime) data.createTime={egt:beginTime,elt:endTime}
            let sqlTotal = sql.field('count(1) as count').table('web_ajax').where(data).group('name').select() 
            let total = await mysql(sqlTotal);
            let totalNum = 0
            if(total.length) totalNum = total.length

            // 请求列表数据
            let sqlstr = sql.field(`name,callUrl,
                                avg(duration) as duration,
                                avg(decodedBodySize) as decodedBodySize
                                `).table('web_ajax')
                            .group('name')
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

    // 根据name字段查询ajax列表信息
    async getAjaxListForName(ctx){
        try {
            let pageNo      = ctx.request.body.pageNo || 1
            let pageSize    = ctx.request.body.pageSize || SYSTEM.PAGESIZE
            let beginTime   = ctx.request.body.beginTime || ''
            let endTime     = ctx.request.body.endTime || ''
            let name        = ctx.request.body.name

            if(!name){
                ctx.body = util.result({
                    code: 1001,
                    desc: 'name参数有误!'
                });
                return
            }

            // 请求参数
            let data={name:name}
            if(beginTime&&endTime) data.createTime={egt:beginTime,elt:endTime}
            let sqlTotal = sql.table('web_ajax').where(data).select() 
            let total = await mysql(sqlTotal);
            let totalNum = 0
            if(total.length) totalNum = total.length

            // 请求列表数据
            let sqlstr = sql
                .table('web_ajax')
                .page(pageNo,pageSize)
                .order('createTime desc')
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
}

module.exports = new ajax();

