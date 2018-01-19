import moment from 'moment'
import sql from 'node-transform-mysql'
import UAParser from 'ua-parser-js'
import axios from 'axios'
import {
    SYSTEM
} from '../config'
import {
    util,
    mysql,
    getsql,
} from '../tool'
const imgsrc = 'console.log(0)'

class data {
    //初始化对象
    constructor() {
        
    };
    // 页面打cookie
    async setMarkCookies(ctx){
        try{
            const cookies = ctx.cookie;
            let timestamp = new Date().getTime();
            let markUser,markPage,IP;
            let maxAge = 864000000;  //cookie超时时间

            if(cookies && cookies.markUser){}else{
                // 第一次访问
                markUser = util.signwx({
                    mark:'markUser',
                    timestamp:timestamp,
                    random:util.randomString()
                }).paySign;
                ctx.cookies.set('markUser',markUser)
            }

            // 每次页面标识
            markPage = util.signwx({
                mark:'markPage',
                timestamp:timestamp,
                random:util.randomString()
            }).paySign;
            ctx.cookies.set('markPage',markPage)

            // 用户IP标识
            let userSystemInfo = {}
            if(cookies && cookies.IP){}else{
                const publicIp = require('public-ip');
                function getUserIpMsg(){
                    return new Promise(function(resolve, reject) {
                        publicIp.v4().then(ip => {
                            userSystemInfo.ip = ip;
                            axios.get(`http://ip.taobao.com/service/getIpInfo.php?ip=${ip}`).then(function (response) {
                                resolve(response.data)
                            }).catch(function (error) {
                                console.log(error)
                                resolve(null)
                            });
                        });
                    })
                }
                let datas = await getUserIpMsg();
                if(datas.code == 0) userSystemInfo = datas.data;
                IP = userSystemInfo.ip
                // 设置页面cookie
                ctx.cookies.set('IP',userSystemInfo.ip,{maxAge:maxAge})
                ctx.cookies.set('isp',encodeURIComponent(userSystemInfo.isp),{maxAge:maxAge})
                ctx.cookies.set('country',encodeURIComponent(userSystemInfo.country),{maxAge:maxAge})
                ctx.cookies.set('region',encodeURIComponent(userSystemInfo.region),{maxAge:maxAge})
                ctx.cookies.set('city',encodeURIComponent(userSystemInfo.city),{maxAge:maxAge})
            }
            
            // 获得markUser值
            if(!markUser&&cookies&&cookies.markUser){
                markUser = cookies.markUser
            }
            // 获得用户IP等信息
            if(!IP&&cookies&&cookies.IP){
                userSystemInfo.ip = decodeURIComponent(cookies.IP)
                userSystemInfo.isp = decodeURIComponent(cookies.isp)
                userSystemInfo.country = decodeURIComponent(cookies.country)
                userSystemInfo.region = decodeURIComponent(cookies.region)
                userSystemInfo.city = decodeURIComponent(cookies.city)
            }

            let script = `if(window.getCookies){
                getCookies({
                    markPage:'${markPage}',
                    markUser:'${markUser}',
                    IP:'${userSystemInfo.ip}',
                    isp:'${userSystemInfo.isp}',
                    county:'${userSystemInfo.country}',
                    province:'${userSystemInfo.region}',
                    city:'${userSystemInfo.city}',
                });}`

            ctx.body=script

        }catch(err){
            console.log(err)
            ctx.body=imgsrc
        }
    }
    // page页面参数上报
    async getPagePerformDatas(ctx){
        try{
            //------------检测token是否存在-----------------------------------------------------  
            let appId = ctx.query.appId
            if(!appId){
                ctx.body=imgsrc;
                return; 
            };  
            let sqlstr = sql
                .table('web_system')
                .field('isUse,id,slowPageTime')
                .where({appId:appId})
                .select()
            let systemMsg = await mysql(sqlstr); 
            if(!systemMsg || !systemMsg.length){
                ctx.body=imgsrc;
                return; 
            };
            let systemItem = systemMsg[0]
            if(systemItem.isUse !== 0){
                ctx.body=imgsrc;
                return; 
            };

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
                markUser:ctx.query.markUser,
                markPage:ctx.query.markPage,
                createTime:moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss'),
                systemId:systemItem.id,
                preUrl:ctx.query.preUrl||''
            }

            let table = 'web_pages';
            // 判断是否存入慢表
            if(ctx.query.loadTime >= systemItem.slowPageTime*1000) table = 'web_slowpages';

            let sqlstr1 = sql
                .table(table)
                .data(datas)
                .insert()
            let result1 = await mysql(sqlstr1);  

            ctx.body=imgsrc 
        }catch(err){
            ctx.body=imgsrc
        }  
    }
    // 用户系统信息上报
    async getSystemPerformDatas(ctx){
        try{
            //------------校验token是否存在-----------------------------------------------------   
            let appId = ctx.query.appId
            if(!appId){
                ctx.body=imgsrc;
                return; 
            }; 
            let sqlstr = sql
                .table('web_system')
                .field('isUse,id')
                .where({appId:appId})
                .select()
            let systemMsg = await mysql(sqlstr); 
            if(!systemMsg || !systemMsg.length){
                ctx.body=imgsrc;
                return; 
            };
            let systemItem = systemMsg[0]
            if(systemItem.isUse !== 0){
                ctx.body=imgsrc;
                return; 
            };

            // 获取userAgent
            let userAgent   = ctx.request.header['user-agent']

            // var address = require('address');
            // console.log(address.ip());   // '192.168.0.2'
            // console.log(address.ipv6()); // 'fe80::7aca:39ff:feb0:e67d'
            // address.mac(function (err, addr) {
            //   console.log(addr); // '78:ca:39:b0:e6:7d'
            // });

            // 检测用户UA相关信息
            let parser = new UAParser();
            parser.setUA(userAgent);
            let result = parser.getResult();
            // environment表数据
            let environment={
                systemId:systemItem.id,
                IP:ctx.query.ip||'',
                isp:ctx.query.isp||'',
                county:ctx.query.country||'',
                province:ctx.query.region||'',
                city:ctx.query.city||'',
                browser:result.browser.name||'',
                borwserVersion:result.browser.version||'',
                system:result.os.name||'',
                systemVersion:result.os.version||'',
                markUser:markUser||'',
                markPage:markPage||'',
                url:ctx.query.url||'',
                createTime:moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss')
            }

            let sqlstr1 = sql
                .table('web_environment')
                .data(environment)
                .insert()
            let result1 = await mysql(sqlstr1);  

            ctx.body=imgsrc 
        }catch(err){
            ctx.body=imgsrc
        }    
    }
    // 页面资源上报
    async getPageResources(ctx){
        ctx.set('Access-Control-Allow-Origin','*');
        try{
            let resourceDatas = ctx.request.body?JSON.parse(ctx.request.body):{}
            console.log(resourceDatas)
            
            ctx.body=imgsrc
        }catch(err){
            console.log(err)
            ctx.body=imgsrc
        }  
    }
}

module.exports = new data();
