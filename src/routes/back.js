//前端路由
import KoaRouter from 'koa-router'
import controllers from '../controllers'
import {
    SYSTEM
} from '../config'
const router = new KoaRouter()

// 请求接口校验中间件
const checkfn           = controllers.common.checkRequestUrl;
const loginCheckfn      = controllers.common.checkIsLogin;
const checkHaveSystemId = controllers.common.checkHaveSystemId;

// router.post('/api/test',checkfn, controllers.login.test)

// 统计页面cookie打点标识
router.get('/reportMark',controllers.dataReport.setMarkCookies);
// 页面poage|资源数据上报
router.post('/reportResource',controllers.dataReport.getPageResources);
// 用户系统上报
router.get('/reportSystem',controllers.dataReport.getSystemPerformDatas);


// 注册用户信息
router.post('/api/user/userRegister',checkfn, controllers.login.userRegister)
// 用户登录
router.post('/api/user/userLogin',checkfn, controllers.login.userLogin)
// 退出登录
router.post('/api/user/loginOut',checkfn, controllers.login.loginOut)

//----------------------------SYSTEMS--------------------------------------
// 新增应用
router.post('/api/system/addSystem',loginCheckfn, controllers.system.addSystem)
// 请求某个应用详情
router.post('/api/system/getItemSystem',loginCheckfn, controllers.system.getItemSystem)

//获得系统列表
router.post('/api/system/getSystemList',loginCheckfn, controllers.system.getSystemList)

//----------------------------PAGES--------------------------------------
// 获得page列表
router.post('/api/pages/getPageList',checkHaveSystemId, controllers.pages.getPageList)
// 获得page详情性能信息
router.post('/api/pages/getPageItemDetail',checkHaveSystemId, controllers.pages.getPageItemDetail)
// 根据ID获得page详情性能信息
router.post('/api/pages/getPageItemForId',checkHaveSystemId, controllers.pages.getPageItemForId)

//----------------------------AJAX--------------------------------------
//获得ajax页面列表
// router.post('/api/ajax/getajaxlist',checkHaveSystemId, controllers.ajax.getajaxlist)
// 根据url查询ajax列表
router.post('/api/ajax/getPageItemDetail',checkHaveSystemId, controllers.ajax.getAjaxMsgForUrl)

//----------------------------慢页面--------------------------------------
// 根据url参数获取慢加载页面
router.post('/api/slowpages/getSlowPageItem',checkHaveSystemId, controllers.slowpages.getSlowPageItem)
// 根据id获得慢资源详情
router.post('/api/slowpages/getslowPageItemForId',checkHaveSystemId, controllers.slowpages.getslowPageItemForId)

//----------------------------慢资源--------------------------------------
// 根据url参数获取慢资源加载
router.post('/api/slowresources/getSlowResourcesItem',checkHaveSystemId, controllers.slowresources.getSlowResourcesItem)

//----------------------------页面资源--------------------------------------
// 根据markPage获得页面资源信息
router.post('/api/sources/getSourcesForMarkPage',checkHaveSystemId, controllers.sources.getSourcesForMarkPage)


//----------------------------SYSTEM表--------------------------------------
router.post('/api/environment/getDataForEnvironment',checkHaveSystemId, controllers.environment.getDataForEnvironment)
// 根据markPage获取用户系统信息
router.post('/api/environment/getUserEnvironment',checkHaveSystemId, controllers.environment.getUserEnvironment)


module.exports = router






