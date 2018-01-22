let Filter = {
    // 图片地址过滤器
    imgBaseUrl:function(img) {
        if (!img) return '../images/index/bg-0.png';
        if (img.indexOf('http:') !== -1 || img.indexOf('HTTP:') !== -1 || img.indexOf('https:') !== -1 || img.indexOf('HTTPS:') !== -1) {
            return img + '?imageslim';
        } else {
            return config.imgBaseUrl + img + '?imageslim';
        }
    },
    toFixed(val){
        val = parseFloat(val)
        return val.toFixed(2);
    },
}
window.Filter = {};
for(let n in Filter){
    window['Filter'][n] = Filter[n];
}
