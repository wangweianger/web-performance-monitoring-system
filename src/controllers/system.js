import moment from 'moment'
import sql from 'node-transform-mysql'
import {
    SYSTEM
} from '../config'
import {
    util,
    mysql,
} from '../tool'

class user {
    //初始化对象
    constructor() {

    };

    // 查询应用list
    async getSystemList(ctx){
        try {
            let userId    = ctx.request.body.userId

            if(!userId){
                ctx.body = util.result({
                    code: 1001,
                    desc: 'userId参数有误!'
                });
                return
            }

            let sqlstr = sql
                .table('web_system')
                .where({userId:userId})
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

    //查询某个应用
    async getItemSystem(ctx){
        try {
            let id    = ctx.cookie.systemId;

            let sqlstr = sql
                .table('web_system')
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

    // 新增应用
    async addSystem(ctx){
        try {
            let systemName      = ctx.request.body.systemName
            let systemDomain    = ctx.request.body.systemDomain
            let slowPageTime    = ctx.request.body.slowPageTime
            let slowJsTime      = ctx.request.body.slowJsTime
            let slowCssTime     = ctx.request.body.slowCssTime
            let slowImgTime     = ctx.request.body.slowImgTime
            let userId          = ctx.request.body.userId
            let createTime      = moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss')
            
            if(!systemName || !systemDomain){
                ctx.body = util.result({
                    code: 1001,
                    desc: '参数错误!'
                });
                return
            }

            // 判断应用是否存在
            let sqlstr1 = sql
                .table('web_system')
                .where({systemName:systemName})
                .select()
            let systemNameMsg = await mysql(sqlstr1);
            if(systemNameMsg.length){
                ctx.body = util.result({
                    code: 1001,
                    desc: '应用名称已存在!'
                });
                return
            }

            // 判断域名是否存在
            let sqlstr2 = sql
                .table('web_system')
                .where({systemDomain:systemDomain})
                .select()
            let systemDomainMsg = await mysql(sqlstr2);
            if(systemDomainMsg.length){
                ctx.body = util.result({
                    code: 1001,
                    desc: '此域名已存在!'
                });
                return
            }

            let timestamp = new Date().getTime();
            let token = util.signwx({
                systemName:systemName,
                systemDomain:systemDomain,
                timestamp:timestamp,
                random:util.randomString()
            }).paySign;
            let script = `<script id="web_performance_script" data-appId="${token}" src="${SYSTEM.ORIGIN}/js/web_get_datas.js"><\/script>`;

            // 插入数据
            let data={
                systemName:systemName,
                systemDomain:systemDomain,
                script:script,
                appId:token,
                userId:userId,
                createTime:createTime
            }
            if(slowPageTime) data.slowPageTime = slowPageTime;
            if(slowJsTime) data.slowJsTime = slowJsTime;
            if(slowCssTime) data.slowCssTime = slowCssTime;
            if(slowImgTime) data.slowImgTime = slowImgTime;
            
            let sqlstr3 = sql
                .table('web_system')
                .data(data)
                .insert()
            let datas = await mysql(sqlstr3);

            ctx.body = util.result({
                data:{
                    script:script,
                    token:token
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
    // 设置系统是否需要统计数据
    async isStatisData(ctx){
        try {
            let id    = ctx.cookie.systemId
            let key   = ctx.request.body.key
            let value = ctx.request.body.value

            let data = {}
            data[key]=value

            let sqlstr = sql
                .table('web_system')
                .data(data)
                .where({id:id})
                .update()

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
    // 修改应用
    async updateSystem(ctx){
        try {
            let id              = ctx.request.body.id
            let slowPageTime    = ctx.request.body.slowPageTime
            let slowJsTime      = ctx.request.body.slowJsTime
            let slowCssTime     = ctx.request.body.slowCssTime
            let slowImgTime     = ctx.request.body.slowImgTime
            let slowAajxTime    = ctx.request.body.slowAajxTime
            let systemDomain    = ctx.request.body.systemDomain
            let systemName      = ctx.request.body.systemName

            if(!systemDomain || !systemName){
                ctx.body = util.result({
                    code: 1001,
                    desc: '参数错误!'
                });
                return
            }

            let sqlstr = sql
                .table('web_system')
                .data({
                    slowPageTime:slowPageTime,
                    slowJsTime:slowJsTime,
                    slowCssTime:slowCssTime,
                    slowImgTime:slowImgTime,
                    slowAajxTime:slowAajxTime,
                    systemDomain:systemDomain,
                    systemName:systemName,
                })
                .where({id:id})
                .update()

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

module.exports = new user();

