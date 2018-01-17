// 绑定onload事件
window.addEventListener("load",function(){
    if (!window.performance && !window.performance.getEntries) return false;

    //user-agent 上报

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

    // return

    var domain      = 'http://127.0.0.1:18080/'
    var webscript   = document.getElementById('web_performance_script');
    var appId       = webscript.getAttribute('data-appId')

    if(!appId) return;
    /*---------------------------------统计用户系统信息---------------------------------*/
    var imgBjc2  = document.createElement('img')
    var src2     = domain+'reportSystem?appId='+appId
    imgBjc2.setAttribute('src',src2);
    imgBjc2.setAttribute("style","display:none;");
    document.body.appendChild(imgBjc2);

    return
    /*---------------------------------统计页面性能-----------------------------------*/
    var timer1      = null;
    var timer2      = null;

    timer1 = setInterval(function(){
        var timing = performance.timing
        if(timing.loadEventEnd){
            clearInterval(timer1);
            clearTimeout(timer2)
            // DNS解析时间
            var dnsTime = timing.domainLookupEnd-timing.domainLookupStart || 0
            //TCP建立时间
            var tcpTime = timing.connectEnd-timing.connectStart || 0
            // 白屏时间
            var whiteTime = timing.responseStart-timing.navigationStart || 0
            //dom渲染完成时间
            var domTime = timing.domContentLoadedEventEnd-timing.navigationStart || 0
            //页面onload时间
            var loadTime = timing.loadEventEnd - timing.navigationStart || 0
            // 页面准备时间
            var readyTime = timing.fetchStart-timing.navigationStart || 0
            // 页面重定向时间
            var redirectTime = timing.redirectEnd - timing.redirectStart || 0
            // unload时间
            var unloadTime = timing.unloadEventEnd - timing.unloadEventStart || 0
            //request请求耗时
            var requestTime = timing.responseEnd - timing.requestStart || 0
            //页面解析dom耗时
            var analysisDomTime = timing.domComplete - timing.domInteractive || 0

            var imgBjc  = document.createElement('img')
            var src     = domain+'reportPage?dnsTime='+dnsTime
                            +'&tcpTime='+tcpTime
                            +'&whiteTime='+whiteTime
                            +'&domTime='+domTime
                            +'&loadTime='+loadTime
                            +'&readyTime='+readyTime
                            +'&redirectTime='+redirectTime
                            +'&unloadTime='+unloadTime
                            +'&requestTime='+requestTime
                            +'&analysisDomTime='+analysisDomTime
                            +'&appId='+appId
                            +'&url='+encodeURIComponent(location.href)

            if(document.referrer && document.referrer!=location.href){
                src+='&preUrl='+encodeURIComponent(document.referrer)
            }
            imgBjc.setAttribute('src',src);
            imgBjc.setAttribute("style","display:none;");
            document.body.appendChild(imgBjc);
        }
    },500);
    timer2 = setTimeout(function(){
        clearInterval(timer1);
        clearTimeout(timer2)
    },20000)

    /*---------------------------------统计页面资源性能---------------------------------*/
    let recoseList = performance.getEntriesByType('resource')
    recoseList.forEach((item)=>{
        console.log(item.duration)
    })

},true);

