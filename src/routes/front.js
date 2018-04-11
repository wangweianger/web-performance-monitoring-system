//前端路由
import KoaRouter from 'koa-router'
import controllers from '../controllers'
import moment from 'moment'
import fs from 'fs'
import path from 'path'
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

//慢资源统计列表
router.get(['/slowresources'], async(ctx, next) => {
	let datas = {
		title:'慢资源统计列表',
	}
	await ctx.render('slowresources',{
		datas:datas
	}); 
});

//慢资源统计列表详情
router.get(['/slowresources/detail'], async(ctx, next) => {
	let datas = {
		title:'慢资源统计列表详情',
	}
	await ctx.render('slowresourcesDetail',{
		datas:datas
	}); 
});

// 系统设置
router.get(['/setting'], async(ctx, next) => {
	let datas = {
		title:'系统设置',
	}
	await ctx.render('setting',{
		datas:datas
	}); 
});

// httptest
router.get(['/httptest'], async(ctx, next) => {
	let datas = {
		title:'HTTP测试分析',
	}
	await ctx.render('httptest',{
		datas:datas
	}); 
});

// webpagetest
router.get(['/webpagetest'], async(ctx, next) => {
	let datas = {
		title:'WEB页面性能分析测试',
	}
	await ctx.render('webpagetest',{
		datas:datas
	}); 
});

// 错误信息列表
router.get(['/error'], async(ctx, next) => {
	let datas = {
		title:'错误分析',
	}
	await ctx.render('error',{
		datas:datas
	}); 
});

// 错误信息详情
router.get(['/error/detail'], async(ctx, next) => {
	let datas = {
		title:'错误分析列表详情',
	}
	await ctx.render('errorDetail',{
		datas:datas
	}); 
});
// 错误信息Item详情
router.get(['/error/detail/item'], async(ctx, next) => {
	let datas = {
		title:'错误分析Item详情',
	}
	await ctx.render('errorDetailItem',{
		datas:datas
	}); 
});

/*-------------------------------------其他相关处理-----------------------------------------------*/
router.get(['/.well-known/pki-validation/fileauth.txt'], async(ctx, next) => {
	let string = fs.readFileSync(path.resolve(__dirname, '../assets/other/fileauth.txt')).toString()
	ctx.body=string
})


module.exports = router






