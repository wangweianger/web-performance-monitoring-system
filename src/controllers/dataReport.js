import moment from 'moment'
import sql from 'node-transform-mysql'
import UAParser from 'ua-parser-js'
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
        let datas={
            loadTime:ctx.query.loadTime,
            dnsTime:ctx.query.dnsTime,
            tcpTime:ctx.query.tcpTime,
            domTime:ctx.query.domTime,
            whiteTime:ctx.query.whiteTime,
            redirectTime:ctx.query.redirectTime,
            unloadTime:ctx.query.unloadTime,
            requestTime:ctx.query.requestTime,
            analysisDomTime:ctx.query.analysisDomTime,
            readyTime:ctx.query.readyTime,
            url:ctx.query.url,
            createTime:moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss')
        }
        if(ctx.query.preUrl&&ctx.query.preUrl.trim())datas.preUrl = ctx.query.preUrl;
        //------------检测token是否存在-----------------------------------------------------  
        let appId = ctx.query.appId
        if(!appId) return;
        let sqlstr = sql
            .table('web_system')
            .field('isUse,systemDomain,id')
            .where({appId:appId})
            .select()
        let systemMsg = await mysql(sqlstr); 
        if(!systemMsg || !systemMsg.length) return;
        let systemItem = systemMsg[0]
        if(systemItem.isUse !== 0) return;

        datas.systemId = systemItem.id

        let sqlstr1 = sql
            .table('web_pages')
            .data(datas)
            .insert()
        let result1 = await mysql(sqlstr1);  

        ctx.body='base64'   
    }
    // 用户系统信息上报
    async getSystemPerformDatas(ctx){
        let userAgent = ctx.request.header['user-agent']
        ctx.body='base64'   
        // ctx.body='base64'
        // return
        // var address = require('address');
        // console.log(address.ip());   // '192.168.0.2'
        // console.log(address.ipv6()); // 'fe80::7aca:39ff:feb0:e67d'
        // address.mac(function (err, addr) {
        //   console.log(addr); // '78:ca:39:b0:e6:7d'
        // });
        
        //------------检测token是否存在-----------------------------------------------------   
        let appId = ctx.query.appId
        if(!appId) return;
        let sqlstr = sql
            .table('web_system')
            .field('isUse,systemDomain,id')
            .where({appId:appId})
            .select()
        let systemMsg = await mysql(sqlstr); 
        if(!systemMsg || !systemMsg.length) return;
        let systemItem = systemMsg[0]
        if(systemItem.isUse !== 0) return;

        // 检测用户UA相关信息
        let parser = new UAParser();
        parser.setUA(userAgent);
        let result = parser.getResult();

        let environment={
            systemId:systemItem.id,
            IP:ctx.query.IP||'',
            // province:ctx.query.province||'',
            // city:ctx.query.city||'',
            // county:ctx.query.county||'',
            // operator:ctx.query.operator||'',
            browser:result.browser.name||'',
            borwserVersion:result.browser.version||'',
            system:result.os.name||'',
            systemVersion:result.os.version||'',
            createTime:moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss')
        }

        console.log(environment)

        let sqlstr1 = sql
            .table('web_environment')
            .data(environment)
            .insert()
        let result1 = await mysql(sqlstr1);  

        ctx.body='base64'   
    }
}

module.exports = new data();
