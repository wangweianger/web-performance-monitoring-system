import moment from 'moment'
import sql from 'node-transform-mysql'
import axios from 'axios'
import querystring from 'querystring'
import urls from 'url'
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

    // 查询webpage性能
    async getWebHttpResponseData(ctx){
        try {
            let url          = ctx.request.body.url||''
            let screenWidth     = ctx.request.body.screenWidth
            let screenHeight    = ctx.request.body.screenHeight

            if(!url){
                ctx.body = util.result({
                    code: 1001,
                    desc: 'url参数有误!'
                });
                return
            }


            let resources   = [];
            let startTime   = ''
            let endTime     =''

            const phantom = require('phantom');
            const instance = await phantom.create();
            const page = await instance.createPage();

            await page.property('viewportSize', {width: screenWidth, height: screenHeight})

            await page.on('onLoadStarted', function() {
                startTime = new Date().getTime();
            });

            await page.on('onResourceRequested', function(req) {
                resources[req.id] = {
                    request: req,
                    startReply: null,
                    endReply: null
                };
            });
         
            await page.on('onResourceReceived', function(res) {
                if (res.stage === 'start') {
                    resources[res.id].startReply = res;
                }
                if (res.stage === 'end') {
                    resources[res.id].endReply = res;
                }
            });


            const status = await page.open(url);
            // const content = await page.property('content');

            endTime = new Date().getTime();

            const title = await page.property('title');

            await instance.exit();   

            var entries = [];
            resources.forEach(function (resource) {
                var request     = resource.request,
                    startReply  = resource.startReply,
                    endReply    = resource.endReply;

                if (!request || !startReply || !endReply) {
                    return;
                }

                // Exclude Data URI from HAR file because
                // they aren't included in specification
                // if (request.url.match(/(^data:image\/.*)/i)) {
                //     return;
                // }

                let  endReplyTime   = new Date(endReply.time).getTime()  
                let  requestTime    = new Date(request.time).getTime()
                let  startReplyTime = new Date(startReply.time).getTime()
                let  urlObj         = urls.parse(request.url)
                entries.push({
                    pathname:urlObj.pathname=='/'?urlObj.href:urlObj.pathname,
                    requestStartTime:requestTime-startTime,
                    startedDateTime: requestTime,
                    request: {
                        method: request.method,
                        url: request.url,
                        headers: request.headers,
                    },
                    response: {
                        status: endReply.status,
                        statusText: endReply.statusText,
                        headers: endReply.headers,
                        bodySize: startReply.bodySize,
                        content: {
                            size: startReply.bodySize,
                            mimeType: endReply.contentType
                        }
                    },
                    timings: {
                        time: endReplyTime - requestTime,
                        wait: startReplyTime - requestTime,
                        receive: endReplyTime - startReplyTime,
                    },
                });
            });

            
            let result = {
                pages: {
                    startedDateTime: startTime,
                    title: title,
                    onLoad: endTime - startTime,
                },
                entries: entries
            };
                    

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

