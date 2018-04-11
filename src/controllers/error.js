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
    // 获得error页面列表
    async getErrorList(ctx){
        try {
            let systemId    = ctx.cookie.systemId;
            let pageNo      = ctx.request.body.pageNo || 1
            let pageSize    = ctx.request.body.pageSize || SYSTEM.PAGESIZE
            let beginTime   = ctx.request.body.beginTime || ''
            let endTime     = ctx.request.body.endTime || ''
            
            // 公共参数
            let data={systemId:systemId}
            if(beginTime&&endTime) data.createTime = {egt:beginTime,elt:endTime}

            let totalNum = 0
            let sqlTotal = sql.field('count(1) as count').table('web_error').where(data).group('resourceUrl,msg,category').select() 
            let total = await mysql(sqlTotal);
            if(total.length) totalNum = total.length

            // 请求列表数据
            let sqlstr = sql.field(`resourceUrl,msg,category,count(resourceUrl) as count`)
                .table('web_error')
                .group('resourceUrl,category,msg')
                .order('count desc')
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
    
    // 获得error列表详情
    async getErrorListDetail(ctx){
        try {
            let pageNo      = ctx.request.body.pageNo || 1
            let pageSize    = ctx.request.body.pageSize || SYSTEM.PAGESIZE
            let beginTime   = ctx.request.body.beginTime || ''
            let endTime     = ctx.request.body.endTime || ''
            let category    = ctx.request.body.category || ''
            let resourceUrl = ctx.request.body.resourceUrl
            
            if(!resourceUrl){
                ctx.body = util.result({
                    code: 1001,
                    desc: 'resourceUrl参数有误!'
                });
                return
            }

            // 公共参数
            let data={resourceUrl:resourceUrl}
            if(beginTime&&endTime) data.createTime = {egt:beginTime,elt:endTime}

            let totalNum = 0
            let sqlTotal = sql.field('count(1) as count').table('web_error').where(data).select() 
            let total = await mysql(sqlTotal);
            if(total.length) totalNum = total.length

            // 请求列表数据
            let field = ''
            switch(category){
                case 'ajax':
                    field = 'id,msg,category,createTime,pageUrl,resourceUrl,text,status,querydata,method'
                    break;
                case 'resource':
                    field = 'id,msg,category,createTime,pageUrl,resourceUrl,target,type,querydata,method'
                    break;
                case 'js':
                    field = 'id,msg,category,createTime,pageUrl,resourceUrl,line,col,method'
                    break;        
            }
            let sqlstr = sql.field(field)
                .table('web_error')
                .order('createTime desc')
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
    
    // 错误item详情
    async getErrorItemDetail(ctx){
        try {
            let id      = ctx.request.body.id

            if(!(id+'')){
                ctx.body = util.result({
                    code: 1001,
                    desc: 'id参数有误!'
                });
                return
            }
            let sqlstr = sql
                .table('web_error')
                .where({id:id})
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

module.exports = new ajax();

