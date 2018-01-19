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

// 拦截ajax
hookAjax({
    onreadystatechange:function(xhr){
        if(xhr.readyState === 4){
            urlXMLArr.push(0);
            if(urlXMLArr.length+1 === ajaxLength){
                setTimeout(()=>{
                    if(!urlOnload.length){
                        setTimeout(()=>{
                            console.log('走了AJAX onreadystatechange 方法')
                            resource = performance.getEntriesByType('resource')
                            ReportData();
                        },resourceTime)
                    }
                },500)
            }
        }
    },
    onload:function(xhr){
        urlOnload.push(0);
        if(urlOnload.length+1 === ajaxLength){
            setTimeout(()=>{
                console.log('走了AJAX onload 方法')
                resource = performance.getEntriesByType('resource')
                ReportData();
            },resourceTime)
        }
    },
    open:function(arg,xhr){
        haveAjax  = true;
        ajaxLength = ajaxLength+1;
    }
})

// 绑定onload事件
window.addEventListener("load",function(){
    if(!haveAjax){
        setTimeout(()=>{
            console.log('走了WINDOW onload 方法')
            resource = performance.getEntriesByType('resource')
            ReportData()
        },resourceTime)
    }
},true);

// 数据上报
function ReportData(){
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

    let domain      = 'http://127.0.0.1:18080/'
    let webscript   = document.getElementById('web_performance_script');
    let appId       = webscript.getAttribute('data-appId')
    if(!appId) return;

    /*----------------------------------打cookie标识----------------------------------*/
    let user_system_msgs = {};
    window.getCookies=function(data){
        console.log(data)
        user_system_msgs = data
        reportMain()
    }
    createElement(domain,'reportMark',appId,'script',{id:'web_script_reportMark'})

    // 正式开始上报
    function reportMain(){
        /*---------------------------------统计用户系统信息---------------------------------*/
        createElement(domain,'reportSystem',appId,'img',{
            appId:appId,
            url:encodeURIComponent(location.href)
        })

        /*---------------------------------统计页面性能-----------------------------------*/
        if (!window.performance && !window.performance.getEntries) return false;
        let timer1      = null;
        let timer2      = null;

        timer1 = setInterval(function(){
            let timing = performance.timing
            if(timing.loadEventEnd){
                clearInterval(timer1);
                clearTimeout(timer2)
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

                createElement(domain,'reportPage',appId,'img',{
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
                    appId:appId,
                    url:encodeURIComponent(location.href),
                    markPage:user_system_msgs.markPage,
                    markUser:user_system_msgs.markUser
                })
            }
        },500);
        timer2 = setTimeout(function(){
            clearInterval(timer1);
            clearTimeout(timer2)
        },20000)

        /*---------------------------------统计页面资源性能---------------------------------*/
        let resource = performance.getEntriesByType('resource')
        let pushArr = []
        resource.forEach((item)=>{
            pushArr.push({
                name:item.name,
                type:item.initiatorType,
                duration:item.duration.toFixed(2)||0,
                decodedBodySize:item.decodedBodySize||0,
                nextHopProtocol:item.nextHopProtocol,
            })
        })
        // ajax上报
        fetch(`${domain}reportResource`,{
            method: 'POST',
            body:JSON.stringify({
                markPage:user_system_msgs.markPage,
                markUser:user_system_msgs.markUser,
                list:pushArr
            })
        }).then(function(response) { return response.json(); }).then(function(data) {
            console.log(data);
        }).catch(function(e) {
            console.log(e)
            console.log("Oops, error");
        });
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

