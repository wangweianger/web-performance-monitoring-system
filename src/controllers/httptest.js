import moment from 'moment'
import sql from 'node-transform-mysql'
import axios from 'axios'
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
    async getHttpResponseData(ctx){
        try {
            let url    = ctx.request.body.url||''
            let method    = ctx.request.body.method||'GET'
            let params    = ctx.request.body.params
            let headers    = ctx.request.body.headers

            if(!url){
                ctx.body = util.result({
                    code: 1001,
                    desc: 'url参数有误!'
                });
                return
            }
            let beginTime = new Date().getTime()
            function getHttpData(){
                return new Promise(function(resolve, reject) {
                    axios({
                        method: method,
                        url: url,
                        data: params,
                        headers:headers,

                    }).then(function(response) {
                        let endTime = new Date().getTime()
                        resolve({
                            duration:endTime-beginTime,
                            data:response.data,
                            header:response.headers,
                            size:response.headers['content-length'],
                            status:response.status
                        })
                    }).catch(function(thrown) {
                        let response = thrown.response
                        let endTime = new Date().getTime()
                        resolve({
                            duration:endTime-beginTime,
                            status:response.status,
                            data:response.data,
                            header:response.headers,
                        })
                    });
                });
            }

            let result = await getHttpData();

            ctx.body = util.result({
                data: result
            });

        } catch (err) {
            // console.log(err)
            ctx.body = util.result({
                code: 1001,
                desc: '系统错误!'
            });
            return '';
        }
    }

}

module.exports = new user();

