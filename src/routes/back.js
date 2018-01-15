//前端路由
import KoaRouter from 'koa-router'
import controllers from '../controllers'
import moment from 'moment'
import {
	SYSTEM
} from '../config'
const router = new KoaRouter()

// 请求接口校验中间件
const checkfn 		= 	controllers.common.checkRequestUrl;
const checkIsLogin  = 	controllers.common.checkIsLogin;

// 上传图片接口
router.post('/api/back/common/uploadImgs', controllers.common.uploadImgs)
// 编辑器上传图片
router.post('/upload', controllers.common.fwbUploadImgs)

/*--------------------------------------------首页相关-----------------------------------------------------------*/

/*后台首页*/
router.get(['/back/home'], async(ctx, next) => {
	let datas = {
		title:'后台首页',
	}
	await ctx.render('back/home',{
		datas:datas
	}); 
});


// 获得商品列表
router.post('/api/back/goods/getList',checkIsLogin, controllers.back.home.getList)



module.exports = router






