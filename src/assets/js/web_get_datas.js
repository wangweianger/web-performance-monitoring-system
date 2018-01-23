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
                            ajaxLength = 0
                            resource = performance.getEntriesByType('resource')
                            ReportData();
                        },resourceTime)
                    }
                },800)
            }
        }
    },
    onload:function(xhr){
        urlOnload.push(0);
        if(urlOnload.length+1 === ajaxLength){
            setTimeout(()=>{
                console.log('走了AJAX onload 方法')
                ajaxLength = 0
                resource = performance.getEntriesByType('resource')
                ReportData();
            },resourceTime)
        }
    },
    open:function(arg,xhr){
        haveAjax  = true;
        if(ajaxLength===0)performance.clearResourceTimings();
        ajaxLength = ajaxLength+1;
    }
})

// 绑定onload事件
window.addEventListener("load",function(){
    if(!haveAjax){
        setTimeout(()=>{
            console.log('走了WINDOW onload 方法')
            performance.clearResourceTimings()
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
        user_system_msgs = data
        reportMain()
    }
    createElement(domain,'reportMark',appId,'script')

    // 正式开始上报
    function reportMain(){
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
            resourceTime+=item.duration
            pushArr.push({
                name:item.name,
                type:item.initiatorType,
                duration:item.duration.toFixed(2)||0,
                decodedBodySize:item.decodedBodySize||0,
                nextHopProtocol:item.nextHopProtocol,
            })
        })

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

