import moment from 'moment'
import sql from 'node-transform-mysql'
import {
    SYSTEM
} from '../config'
import {
    util,
    mysql,
    getsql,
} from '../tool'

class data {
    //初始化对象
    constructor() {

    };
    // page页面参数上报
    async getPagePerformDatas(ctx){
        // let datas={
        //     loadTime:ctx.query.loadTime,
        //     dnsTime:ctx.query.dnsTime,
        //     tcpTime:ctx.query.tcpTime,
        //     domTime:ctx.query.domTime,
        //     whiteTime:ctx.query.whiteTime,
        //     redirectTime:ctx.query.redirectTime,
        //     unloadTime:ctx.query.unloadTime,
        //     requestTime:ctx.query.requestTime,
        //     analysisDomTime:ctx.query.analysisDomTime,
        //     readyTime:ctx.query.readyTime,
        //     url:ctx.query.url,
        //     createTime:moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss')
        // }
        // if(ctx.query.preUrl&&ctx.query.preUrl.trim())datas.preUrl = ctx.query.preUrl;

        // let appId = ctx.query.appId
        // if(!appId) return;

        // let sqlstr = sql
        //     .table('web_system')
        //     .field('isUse,systemDomain,id')
        //     .where({appId:appId})
        //     .select()
        // let systemMsg = await mysql(sqlstr); 
        // if(!systemMsg || !systemMsg.length) return;
        // let systemItem = systemMsg[0]
        // if(systemItem.isUse !== 0) return;

        // datas.systemId = systemItem.id

        // let sqlstr1 = sql
        //     .table('web_pages')
        //     .data(datas)
        //     .insert()
        // let result = await mysql(sqlstr1);     
        // console.log(result)         

        ctx.body='base64'
    }
}

module.exports = new data();
