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
    // 获得ajax页面列表
    async getSlowresourcesList(ctx){
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
                let sqlTotal = sql.field('count(1) as count').table('web_slowresources').where(data).group('name').select() 
                let total = await mysql(sqlTotal);
                if(total.length) totalNum = total.length
            }  
                
            // 请求列表数据
            let sqlstr = sql.field(`name,method,
                    avg(duration) as duration,
                    avg(decodedBodySize) as decodedBodySize,
                    count(name) as count
                    `).table('web_slowresources')
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
    // 根据url查询慢加载资源
    async getSlowResourcesItem(ctx){
        try {
            let pageNo      = ctx.request.body.pageNo || 1
            let pageSize    = ctx.request.body.pageSize || SYSTEM.PAGESIZE
            let beginTime   = ctx.request.body.beginTime || ''
            let endTime     = ctx.request.body.endTime || ''
            let callUrl         = ctx.request.body.callUrl

            if(!callUrl){
                ctx.body = util.result({
                    code: 1001,
                    desc: 'url参数有误!'
                });
                return
            }

            // 公共参数
            let data={callUrl:callUrl}
            if(beginTime&&endTime) data.createTime = {egt:beginTime,elt:endTime}
            let sqlTotal = sql.field('count(1) as count').table('web_slowresources').where(data).select() 
            let total = await mysql(sqlTotal);
            let totalNum = 0
            if(total.length) totalNum = total.length

            // 请求列表数据
            let sqlstr = sql.field(`name,duration,decodedBodySize,createTime,callUrl`).table('web_slowresources')
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
    // 根据name查询慢加载资源
    async getSlowResourcesForName(ctx){
        try {
            let pageNo      = ctx.request.body.pageNo || 1
            let pageSize    = ctx.request.body.pageSize || SYSTEM.PAGESIZE
            let beginTime   = ctx.request.body.beginTime || ''
            let endTime     = ctx.request.body.endTime || ''
            let name         = ctx.request.body.name

            if(!name){
                ctx.body = util.result({
                    code: 1001,
                    desc: 'url参数有误!'
                });
                return
            }

            // 公共参数
            let data={name:name}
            if(beginTime&&endTime) data.createTime = {egt:beginTime,elt:endTime}
            let sqlTotal = sql.field('count(1) as count').table('web_slowresources').where(data).select() 
            let total = await mysql(sqlTotal);
            let totalNum = 0
            if(total.length) totalNum = total.length

            // 请求列表数据
            let sqlstr = sql.field(`name,duration,decodedBodySize,createTime,callUrl,querydata`).table('web_slowresources')
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

module.exports = new pages();

