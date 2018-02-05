;(function(){
//--------------------------错误信息上报--------------------------------------
var reportDataList = [];
;(function(){
    if (window.jsErrorReport){
        return window.jsErrorReport
    };
    /*默认上报的错误信息*/
    var defaults = {
        t:'',   //发送数据时的时间戳
        n:'js',//模块名,
        msg:'',  //错误的具体信息,
        a:navigator.appVersion,
        data:{}
    };
    /*格式化参数*/
    function formatParams(data) {
        var arr = [];
        for (var name in data) {
            arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
        }
        return arr.join("&");
    }
    /*上报函数*/
    // function report(url,data){
    //     var img = new Image();
    //     img.src = url+'?v=1&' +formatParams(data) ;
    // }
    /**js错误监控**/
    var jsErrorReport=function(params){
        if(!params.url){return}
        defaults.n = params.moduleName;
        var url = params.url;

        //重写send方法,监控xhr请求
        var s_ajaxListener = new Object();
        s_ajaxListener.tempSend = XMLHttpRequest.prototype.send;//复制原先的send方法
        s_ajaxListener.tempOpen= XMLHttpRequest.prototype.open;//复制原先的open方法
        //重写open方法,记录请求的url
        XMLHttpRequest.prototype.open = function(method,url,boolen){
            defaults.method = method
            s_ajaxListener.tempOpen.apply(this, [method,url,boolen]);
            this.ajaxUrl = url;

        };
        XMLHttpRequest.prototype.send = function(_data){
            s_ajaxListener.tempSend.apply(this, [_data]);
            this.onreadystatechange = function(){
                if (this.readyState==4) {
                    if (this.status >= 200 && this.status < 300) {
                        return true;
                    }else {
                        defaults.t =new Date().getTime();
                        defaults.msg = 'ajax请求错误';
                        defaults.data = {
                            resourceUrl:this.ajaxUrl,
                            pageUrl:location.href,
                            category:'ajax',
                            text:this.statusText,
                            status:this.status
                        }
                        // 合并上报的数据，包括默认上报的数据和自定义上报的数据
                        var reportData=Object.assign({},params.data || {},defaults);
                        reportDataList.push(reportData)
                    }
                }
            }
        };
        //监控资源加载错误(img,script,css,以及jsonp)
        window.addEventListener('error',function(e){
            defaults.t =new Date().getTime();
            defaults.msg =e.target.localName+' is load error';
            defaults.method = 'GET'
            defaults.data ={
               target: e.target.localName,
               type: e.type,
               resourceUrl:e.target.currentSrc,
               pageUrl:location.href,
               category:'resource'
            };
            if(e.target!=window){//抛去js语法错误
                // 合并上报的数据，包括默认上报的数据和自定义上报的数据
                var reportData=Object.assign({},params.data || {},defaults);
                reportDataList.push(reportData)
            }
        },true);

        //监控js错误
        window.onerror = function(msg,_url,line,col,error){
            //采用异步的方式,避免阻塞
            setTimeout(function(){
                //不一定所有浏览器都支持col参数，如果不支持就用window.event来兼容
                col = col || (window.event && window.event.errorCharacter) || 0;
                if (error && error.stack){
                    //msg信息较少,如果浏览器有追溯栈信息,使用追溯栈信息
                    defaults.msg = error.stack.toString();

                }else{
                    defaults.msg = msg;
                }
                defaults.method = 'GET'
                defaults.data={
                    resourceUrl:_url,
                    pageUrl:location.href,
                    category:'js',
                    line:line,
                    col:col
                };
                defaults.t=new Date().getTime();
                defaults.level='error';
                // 合并上报的数据，包括默认上报的数据和自定义上报的数据
                var reportData=Object.assign({},params.data || {},defaults);
                reportDataList.push(reportData)
            },0);

            // return true;   //错误不会console浏览器上,如需要，可将这样注释
        };
    }
    window.jsErrorReport=jsErrorReport;
})();

let domain      = 'http://127.0.0.1:18088/'

// error错误上报
jsErrorReport({
    url:domain+'reportErrorMsg',//上报地址
    moduleName:'error',//上报模块名
    data:{}//自定义参数
});

//-----------------------页面性能数据上报--------------------------------------
// 资源列表信息
let resource = null;
// 延迟请求resourceTime资源时间
let resourceTime = 2000;
// onreadystatechange请求的XML信息
let urlXMLArr   = [];
// onload的xml请求信息
let urlOnload   = [];
// 页面ajax数量
let ajaxLength = 0
// 页面是否有ajax请求
let haveAjax  = false;

let timer10,timer11,timer12,timer13;

let ajaxMsg = [];


!function (ob) {
    ob.hookAjax = function (funs) {
        window._ahrealxhr = window._ahrealxhr || XMLHttpRequest
        XMLHttpRequest = function () {
            this.xhr = new window._ahrealxhr;
            for (let attr in this.xhr) {
                let type = "";
                try {
                    type = typeof this.xhr[attr]
                } catch (e) {}
                if (type === "function") {
                    this[attr] = hookfun(attr);
                } else {
                    Object.defineProperty(this, attr, {
                        get: getFactory(attr),
                        set: setFactory(attr)
                    })
                }
            }
        }
        function getFactory(attr) {
            return function () {
                return this.hasOwnProperty(attr + "_")?this[attr + "_"]:this.xhr[attr];
            }
        }
        function setFactory(attr) {
            return function (f) {
                let xhr = this.xhr;
                let that = this;
                if (attr.indexOf("on") != 0) {
                    this[attr + "_"] = f;
                    return;
                }
                if (funs[attr]) {
                    xhr[attr] = function () {
                        funs[attr](that) || f.apply(xhr, arguments);
                    }
                } else {
                    xhr[attr] = f;
                }
            }
        }
        function hookfun(fun) {
            return function () {
                let args = [].slice.call(arguments)
                if (funs[fun] && funs[fun].call(this, args, this.xhr)) {
                    return;
                }
                return this.xhr[fun].apply(this.xhr, args);
            }
        }
        return window._ahrealxhr;
    }
    ob.unHookAjax = function () {
        if (window._ahrealxhr)  XMLHttpRequest = window._ahrealxhr;
        window._ahrealxhr = undefined;
    }
}(window)

// 拦截ajax
hookAjax({
    onreadystatechange:function(xhr){
        if(xhr.readyState === 4){
            urlXMLArr.push(0);
            if(urlXMLArr.length === ajaxLength){
                setTimeout(()=>{
                    if(!urlOnload.length){
                        clearTimeout(timer10)
                        timer10 = setTimeout(()=>{
                            console.log('走了AJAX onreadystatechange 方法')
                            ajaxLength = 0
                            resource = performance.getEntriesByType('resource')
                            ReportData();
                        },resourceTime)
                    }
                },800)
            }
        }
    },
    onerror:function(){

    },
    onload:function(xhr){
        urlOnload.push(0);
        console.log(urlOnload.length+'---'+ajaxLength)
        if(urlOnload.length === ajaxLength){
            clearTimeout(timer11)
            timer11 = setTimeout(()=>{
                console.log('走了AJAX onload 方法')
                ajaxLength = 0
                resource = performance.getEntriesByType('resource')
                ReportData();
            },resourceTime)
        }
    },
    open:function(arg,xhr){
        if(arg[1].indexOf('http://localhost:8000/sockjs-node/info')!=-1) return;
        ajaxMsg.push(arg)
        haveAjax  = true;
        if(ajaxLength===0)performance.clearResourceTimings();
        ajaxLength = ajaxLength+1;
    }
})

// 绑定onload事件
window.addEventListener("load",function(){
    if(!haveAjax){
        clearTimeout(timer12)
        timer12=setTimeout(()=>{
            console.log('走了WINDOW onload 方法')
            performance.clearResourceTimings()
            resource = performance.getEntriesByType('resource')
            ReportData()
        },resourceTime)
    }
},true);

// 数据上报
function ReportData(){
    ajaxLength  = 0
    urlXMLArr   = []
    urlOnload   = []
    ajaxMsg     = []
    haveAjax    = false
    resource = null

    // return
    // fetch('http://httpbin.org/ip').then(function(response) { return response.json(); }).then(function(data) {
    //   console.log(data);
    // }).catch(function(e) {
    //   console.log("Oops, error");
    // });
    
    // fetch('https://ipv4.icanhazip.com/').then(function(response) { return response.text(); }).then(function(data) {
    //   console.log(data);
    // }).catch(function(e) {
    //   console.log(e);
    // });

    
    let webscript   = document.getElementById('web_performance_script');
    let appId       = webscript.getAttribute('data-appId')
    if(!appId) return;

    /*----------------------------------打cookie标识----------------------------------*/
    let user_system_msgs = {};
    window.getCookies=function(data){
        user_system_msgs = data
        reportMain()
    }
    createElement(domain,'reportMark',appId,'script')

    // 正式开始上报
    function reportMain(){
        /*---------------------------------错误信息上报---------------------------------*/
        if(reportDataList&&reportDataList.length){
            // 错误信息上报
            fetch(`${domain}reportErrorMsg`,{
                method: 'POST',
                body:JSON.stringify({
                    appId:appId,
                    reportDataList:reportDataList,
                })
            }).then(function(response) { 
                // console.log(response)
            })
            reportDataList=[]
        }

        /*---------------------------------统计用户系统信息---------------------------------*/
        createElement(domain,'reportSystem',appId,'img',{
            appId:appId,
            url:encodeURIComponent(location.href),
            markPage:user_system_msgs.markPage,
            markUser:user_system_msgs.markUser,
            IP:user_system_msgs.IP,
            city:user_system_msgs.city,
            county:user_system_msgs.county,
            isp:user_system_msgs.isp,
            province:user_system_msgs.province
        })

        /*---------------------------------统计页面性能及其资源性能---------------------------------*/
        if (!window.performance && !window.performance.getEntries) return false;

        let resource = performance.getEntriesByType('resource')

        let pushArr = []
        let resourceTime = 0
        resource.forEach((item)=>{
            let json = {
                name:item.name,
                method:'GET',
                type:item.initiatorType,
                duration:item.duration.toFixed(2)||0,
                decodedBodySize:item.decodedBodySize||0,
                nextHopProtocol:item.nextHopProtocol,
            }
            for(let i=0,len=ajaxMsg.length;i<len;i++){
                if(ajaxMsg[i][1]===item.name){
                    json.method = ajaxMsg[i][0]||'GET'
                }
            }
            resourceTime+=item.duration
            pushArr.push(json)
        })

        console.log(pushArr)

        /*---------------------------------统计页面性能-----------------------------------*/
        let timing = performance.timing
        // DNS解析时间
        let dnsTime = timing.domainLookupEnd-timing.domainLookupStart || 0
        //TCP建立时间
        let tcpTime = timing.connectEnd-timing.connectStart || 0
        // 白屏时间
        let whiteTime = timing.responseStart-timing.navigationStart || 0
        //dom渲染完成时间
        let domTime = timing.domContentLoadedEventEnd-timing.navigationStart || 0
        //页面onload时间
        let loadTime = timing.loadEventEnd - timing.navigationStart || 0
        // 页面准备时间
        let readyTime = timing.fetchStart-timing.navigationStart || 0
        // 页面重定向时间
        let redirectTime = timing.redirectEnd - timing.redirectStart || 0
        // unload时间
        let unloadTime = timing.unloadEventEnd - timing.unloadEventStart || 0
        //request请求耗时
        let requestTime = timing.responseEnd - timing.requestStart || 0
        //页面解析dom耗时
        let analysisDomTime = timing.domComplete - timing.domInteractive || 0
        let preUrl = document.referrer&&document.referrer!==location.href?document.referrer:''

        let pageTimes={
            dnsTime:dnsTime,
            tcpTime:tcpTime,
            whiteTime:whiteTime,
            domTime:domTime,
            loadTime:loadTime,
            readyTime:readyTime,
            redirectTime:redirectTime,
            unloadTime:unloadTime,
            requestTime:requestTime,
            analysisDomTime:analysisDomTime,
            resourceTime:resourceTime,
            preUrl:preUrl
        }

        // ajax上报
        fetch(`${domain}reportResource`,{
            method: 'POST',
            body:JSON.stringify({
                appId:appId,
                markPage:user_system_msgs.markPage,
                markUser:user_system_msgs.markUser,
                url:encodeURIComponent(location.href),
                list:pushArr,
                pageTimes:pageTimes,
            })
        }).then(function(response) { 
            // console.log(response)
        })
    }

    // 公共函数新增dom节点
    function createElement(domain,apiName,appId,type='img',option={}){
        let imgBjc  = document.createElement(type)
        let src     = domain+apiName
        for(let key in option){
            if(src.indexOf('?')!==-1){
                src = `${src}&${key}=${option[key]}`
            }else{
                src = `${src}?${key}=${option[key]}`
            }
        }
        imgBjc.setAttribute('src',src);
        imgBjc.setAttribute("style","display:none;");
        document.body.appendChild(imgBjc);
    }
}
})();
