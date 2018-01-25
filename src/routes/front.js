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

/*-------------------------------------首页相关-----------------------------------------------*/

/*首页页面*/
router.get(['/'], async(ctx, next) => {
	let datas = {
		title:'HOME首页',
		imgBase:SYSTEM.BASEIMG,
		datas:[{
			name:'zhang san',
			age:20,
		},{
			name:'li si',
			age:25,
		},{
			name:'wang wu',
			age:22,
		},{
			name:'xiao zhang',
			age:28,
		}],
	}

	await ctx.render('system',{
		datas:datas
	}); 
});

/*登录*/
router.get(['/login'], async(ctx, next) => {
	let datas = {
		title:'用户登录',
	}

	await ctx.render('login',{
		datas:datas
	}); 
});

//新增应用
router.get(['/addSystem'], async(ctx, next) => {
	let datas = {
		title:'新增应用',
	}

	await ctx.render('addSystem',{
		datas:datas
	}); 
});

//pages性能分析页面
router.get(['/pages'], async(ctx, next) => {
	let datas = {
		title:'page性能分析',
	}
	await ctx.render('pages',{
		datas:datas
	}); 
});
// page详情性能分析
router.get(['/pages/detail'], async(ctx, next) => {
	let datas = {
		title:'page详情性能分析',
	}
	await ctx.render('pagesDetail',{
		datas:datas
	}); 
});
router.get(['/pages/detail/item'], async(ctx, next) => {
	let datas = {
		title:'单个页面详情性能分析',
	}
	await ctx.render('pagesDetailItem',{
		datas:datas
	}); 
});

//ajax列表
router.get(['/ajax'], async(ctx, next) => {
	let datas = {
		title:'Ajax列表',
	}
	await ctx.render('ajax',{
		datas:datas
	}); 
});
// ajaxDetail详情
router.get(['/ajax/detail'], async(ctx, next) => {
	let datas = {
		title:'单个Ajax性能分析',
	}
	await ctx.render('ajaxDetail',{
		datas:datas
	}); 
});

// 慢页面加载页面列表
router.get(['/slowpages/detail'], async(ctx, next) => {
	let datas = {
		title:'慢页面加载页面列表',
	}
	await ctx.render('slowPagesDetail',{
		datas:datas
	}); 
});



module.exports = router






