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
    // 获得首页banner
    async getPagePerformDatas(ctx){
        let datas={
            dnsTime:ctx.query.dnsTime,
            tcpTime:ctx.query.tcpTime,
            whiteTime:ctx.query.whiteTime,
            domTime:ctx.query.domTime,
            loadTime:ctx.query.loadTime,
            readyTime:ctx.query.readyTime,
            redirectTime:ctx.query.redirectTime,
            unloadTime:ctx.query.unloadTime,
            requestTime:ctx.query.requestTime,
            analysisDomTime:ctx.query.analysisDomTime,
        }
               
        console.log(datas)
        console.log(ctx.query.appId)
        
        ctx.body='base64'
    }
}

module.exports = new data();