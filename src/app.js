import Koa from 'koa'
import KoaBody from 'koa-body'
import serve from 'koa-static'
import KoaLogger from 'koa-logger'
import cors from 'koa-cors'
import path from 'path'
import fs from 'fs'
import render from 'koa-ejs'
import cookie from 'koa-cookie'
import session from 'koa-session'
import koa2Common from 'koa2-common'
import enforceHttps from 'koa-sslify'
import http from 'http'
import https from 'https'
import {
    SYSTEM
} from './config'
import { 
    front,
    back
} from './routes'

const app = new Koa()
const env = process.env.BABEL_ENV || 'development'
const IS_HTTPS = process.env.IS_HTTPS || 'FALSE'

// 打印日志
app.on('error', (err, ctx) => {
    console.log(err)
});

render(app, {
    root: path.join(__dirname, 'view'),
    layout: 'template',
    viewExt: 'html',
    cache: true,
    debug: SYSTEM.DEBUG
});
 
// 生产环境启用https
let options = null;
if(IS_HTTPS == 'TRUE'){
    // Force HTTPS on all page 
    app.use(enforceHttps())

    options = {
      key: fs.readFileSync(path.resolve(__dirname, './assets/cert/214545337340023.key')),
      cert: fs.readFileSync(path.resolve(__dirname, './assets/cert/214545337340023.pem'))
    }
}

app
    .use(cookie())
    .use(session(app))
    .use(KoaBody({
        multipart: true,
        formidable: {
            uploadDir: path.join(__dirname, '/upload')
        }
    }))
    .use(serve(__dirname + "/assets",{
        maxage: 365 * 24 * 60 * 60 
    }))
    .use(koa2Common())
    .use(cors({
        origin: SYSTEM.ORIGIN,
        headers: 'Origin, X-Requested-With, Content-Type, Accept',
        methods: ['GET', 'PUT', 'POST'],
        credentials: true,
    }))
    .use(front.routes())
    .use(front.allowedMethods())
    .use(back.routes())
    .use(back.allowedMethods())
    .use((ctx, next) => {
        const start = new Date()
        return next().then(() => {
            const ms = new Date() - start
            console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
        })
    })

// app.listen(SYSTEM.PROT);

if(IS_HTTPS == 'FALSE') http.createServer(app.callback()).listen(SYSTEM.PROT);
if(IS_HTTPS == 'TRUE')  https.createServer(options, app.callback()).listen(SYSTEM.PROT);


console.log(`服务启动了：路径为：127.0.0.1:${SYSTEM.PROT}`,`orgin:${SYSTEM.ORIGIN}`)

export default app
