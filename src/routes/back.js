//前端路由
import KoaRouter from 'koa-router'
import controllers from '../controllers'
import moment from 'moment'
import {
    SYSTEM
} from '../config'
const router = new KoaRouter()

// 请求接口校验中间件
const checkfn = controllers.common.checkRequestUrl;

// 注册用户信息
router.post('/api/user/userRegister',checkfn, controllers.login.userRegister)
// 用户登录
router.post('/api/user/userLogin',checkfn, controllers.login.userLogin)

module.exports = router






