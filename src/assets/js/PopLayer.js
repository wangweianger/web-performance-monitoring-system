
var Layer=(function(){
	return new PopLayer();
})(window);

//构造函数
function PopLayer(){
	this.setting={
		width:350,
		height:160,
		time:2000,
		header:"信息",
		type:"msg",
		title:"请填写提示信息！"
	}
}

//信息层
PopLayer.prototype.alert=function(json){
	this.setting.height=json.height||160;
	var type=defAttr(json,this.setting,"type");
	var str="<div class='PopLayer PopLayer-alert PopLayer-alert-type alertMask'><div class='PopLayer-h1'>"+defAttr(json,this.setting,"header")+"<span class='closeButton alertClose'></span></div> <div class='PopLayer-body PopLayer-body-"+type+"'><span></span><b>"+defAttr(json,this.setting,"title")+"</b></div> <div class='PopLayer-bottom'> <div class='PopLayer-bottom-OK alertOK'>确定</div> </div> </div>";                   
	$('body').append(str);
	this.mask("alertMask");  //显示遮罩
	animate($('.PopLayer-alert-type'),defAttr(json,this.setting,"width"),defAttr(json,this.setting,"height"));
	closeLayer($('.alertClose'),'alertMask');  //点击关闭按钮关闭
	closeLayer($('.alertOK'),'alertMask');  //确定	
	if(json.closeMask){
		closeLayer($('.alertMask'),'alertMask');//点击遮罩关闭
	}
}

//确认层
PopLayer.prototype.confirm=function(json,fn){
	this.setting.title="你确认这样吗？";
	var str="<div class='PopLayer PopLayer-alert PopLayer-confirm confirmMask'><div class='PopLayer-h1'>"+defAttr(json,this.setting,"header")+"<span class='closeButton confirmClose'></span></div> <div class='PopLayer-body PopLayer-body-confirm'><span></span><b>"+defAttr(json,this.setting,"title")+"</b></div> <div class='PopLayer-bottom'> <div class='PopLayer-bottom-left confirmLeft'>确定</div> <div class='PopLayer-bottom-right confirmRight'>取消</div> </div> </div>";                   
	$('body').append(str);
	this.mask("confirmMask");  //显示遮罩
	animate($('.PopLayer-confirm'),defAttr(json,this.setting,"width"),defAttr(json,this.setting,"height"));
	closeLayer($('.confirmClose'),'confirmMask');  //点击关闭按钮关闭
	closeLayer($('.confirmRight'),'confirmMask');  //点击取消按钮关闭
	deteButton($('.confirmLeft'),'confirmMask',fn); //确定
	if(json.closeMask){
		closeLayer($('.confirmMask'),'confirmMask');//点击遮罩关闭
	}
}

//页面层
PopLayer.prototype.page=function(json){
	this.setting.width=600;
	this.setting.height=400;
	var str="<div class='PopLayer PopLayer-alert PopLayer-page pageMask'><div class='PopLayer-h1'>"+defAttr(json,this.setting,"header")+"<span class='closeButton pageClose'></span></div> <div class='PopLayer-HTML'>"+json["pageHtml"]+"</div></div>";                   
	$('body').append(str);
	$('.PopLayer-HTML').css({"height":(defAttr(json,this.setting,"height")-60)+"px"});
	this.mask("pageMask");  //显示遮罩
	animate($('.PopLayer-page'),defAttr(json,this.setting,"width"),defAttr(json,this.setting,"height"));
	closeLayer($('.pageClose'),'pageMask');  //点击关闭按钮关闭
	if(json.closeMask){
		closeLayer($('.pageMask'),'pageMask');//点击遮罩关闭
	}
}

//自定义HTML页面层
PopLayer.prototype.customHtml=function(json){
	this.setting.width=600;
	this.setting.height=400;
	var str="<div class='PopLayer PopLayer-alert PopLayer-customHtml customHtmlMask'><div class='PopLayer-h1'>"+defAttr(json,this.setting,"header")+"<span class='closeButton customHtmlClose'></span></div> <div class='PopLayer-HTML'>"+json["html"]+"</div></div>";                   
	$('body').append(str);
	$('.PopLayer-HTML').css({"height":(defAttr(json,this.setting,"height")-60)+"px"});
	this.mask("customHtmlMask");  //显示遮罩
	animate($('.PopLayer-customHtml'),defAttr(json,this.setting,"width"),defAttr(json,this.setting,"height"));
	closeLayer($('.customHtmlClose'),'customHtmlMask');  //点击关闭按钮关闭
	if(json.closeMask){
		closeLayer($('.customHtmlMask'),'customHtmlMask');//点击遮罩关闭
	}
}
//iframe层
PopLayer.prototype.iframe=function(json){
	this.setting.width=600;
	this.setting.height=400;
	var str="<div class='PopLayer PopLayer-alert PopLayer-iframe iframeMask'><div class='PopLayer-h1'>"+defAttr(json,this.setting,"header")+"<span class='closeButton iframeClose'></span></div> <div class='PopLayer-HTML'><iframe src='"+json["href"]+"' width='100%' height='97%' frameborder='0'></iframe></div></div>";                   
	$('body').append(str);
	$('.PopLayer-HTML').css({"height":(defAttr(json,this.setting,"height")-60)+"px"});
	this.mask("iframeMask");  //显示遮罩
	animate($('.PopLayer-iframe'),defAttr(json,this.setting,"width"),defAttr(json,this.setting,"height"));
	closeLayer($('.iframeClose'),'iframeMask');  //点击关闭按钮关闭
	if(json.closeMask){
		closeLayer($('.iframeMask'),'iframeMask');//点击遮罩关闭
	}
}

//提示层
PopLayer.prototype.miss=function(json){
	this.setting.height=90;
	var str="<div class='PopLayer PopLayer-alert PopLayer-miss missMask'><div class='PopLayer-body PopLayer-body-miss'><span></span><b>"+defAttr(json,this.setting,"title")+"</b></div> </div>";                   
	$('body').append(str);
	this.mask("missMask");  //显示遮罩
	animate($('.PopLayer-miss'),defAttr(json,this.setting,"width"),defAttr(json,this.setting,"height"));
	closeLayer($('.missClose'),'missMask');  //点击关闭按钮关闭
	if(json.closeMask){
		closeLayer($('.missMask'),'missMask');//点击遮罩关闭
	}
	setTimeout(function(){
		$('.missMask').remove();
	},defAttr(json,this.setting,"time"))
}

//加载层
PopLayer.prototype.loading=function(json){
	this.setting.height=110; 
	this.setting.title="正在加载中，请稍后...";
	var src="loading-1";
	if(json){
		switch(json["srcType"]){
			case 1:
				src="loading-1";
				break;
			case 2:
				src="loading-2";
				break;
			case 3:
				src="loading-3";
				break;
			case 4:
				src="loading-4";
				break;			
		}	
	}
	
	var str="<div class='PopLayer PopLayer-alert PopLayer-loading loadingMask'><div class='PopLayer-body PopLayer-body-loading'><img src='images/"+src+".gif'><b>"+defAttr(json,this.setting,"title")+"</b></div> </div>";
	$('body').append(str);
	this.mask("loadingMask");  //显示遮罩
	$('.loadingMask').css({"cursor":"wait"})
	animate($('.PopLayer-loading'),defAttr(json,this.setting,"width"),defAttr(json,this.setting,"height"));
}

//创建遮罩
PopLayer.prototype.mask=function(Class){
    var str="<div class='PopLayer PopLayer-mask "+Class+"'></div>";
	$('body').append(str);
}

//关闭加载层
PopLayer.prototype.closeLoading=function(){
	$('.loadingMask').remove();
}

//弹出层默认大小处理函数
function defAttr(json,setting,attr){
	return json?json[attr]||setting[attr]:setting[attr];	
}

//关闭层
PopLayer.prototype.closeNowLayer=function(sClass){
	$('.'+sClass).remove();
}

//关闭所有层
PopLayer.prototype.closeAllLayer=function(){
	$('.PopLayer').remove();
}

//关闭遮罩
function closeLayer(but,Class){
	but.click(function(){
		$('.'+Class).remove();
   });
}

//确定点击事件
function deteButton(button,Class,fn){
	button.click(function(){
		$('.'+Class).remove();
		fn();
	});
}

//弹出层动态效果
function animate(obj,wid,hei){
	obj.animate({
		width:wid+'px',
		height:hei+'px',
		marginLeft:(-parseInt(wid))/2+"px",
		marginTop:(-parseInt(hei))/2+"px",
		opacity:1
	},"fast")
}



