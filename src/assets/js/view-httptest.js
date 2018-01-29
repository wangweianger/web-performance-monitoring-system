new Vue({
    el: '#setting',
    data: function(){
        return{
            table:1,
            checknav:1,
            checknavtwo:1,
            method:'GET',
            url:'',
            selectval:'',
            requestBodyText:'',
            requestHeaderText:'Content-Type: application/json\r\n',
            rex:/Content-Type(.*\r\n)?/,
            httptestData:{
                duration:0,
            },
            isLoading:false
        }
    },
    filters:{
        toFixed:window.Filter.toFixed,
        toSize:window.Filter.toSize,
        date:window.Filter.date,
        limitTo:window.Filter.limitTo,
    },
    watch:{
        'selectval'(val){
            let str = ''
            if(!val)return;
            this.checknav=2;
            switch(parseInt(val)){
                case 1:
                    str = this.requestHeaderText.replace(this.rex,'application/xml')
                    break;
                case 2:
                    str = this.requestHeaderText.replace(this.rex,'application/json')
                    break;
                case 3:
                    str = this.requestHeaderText.replace(this.rex,'multipart/form-data')
                    break;
                case 4:
                    str = this.requestHeaderText.replace(this.rex,'application/x-www-form-urlencoded')
                    break;            
            }
            this.requestHeaderText = `Content-Type: ${str}\r\n`
        }
    },
    mounted(){
        
    },
    methods:{
        getDetail(){
            util.ajax({
                url:config.baseApi+'api/system/getItemSystem',
                data:{
                    appId:this.appId
                },
                success:data=>{
                    this.systemInfo = data.data||{}
                    this.pagexingneng()
                }
            })
        },
        // 开始测试
        getHttptest(){
            let params = {}
            let headers= {}

            if(this.requestBodyText){
                let split = this.requestBodyText.split('\n')
                split.forEach(item=>{
                    let split1 = item.split('=')
                    if(split1[0].trim()){
                        params[split1[0].trim()]=split1[1].trim()
                    }
                })
            }
            if(this.requestHeaderText){
                let split = this.requestHeaderText.split('\n')
                split.forEach(item=>{
                    let split1 = item.split(':')
                    if(split1[0].trim()){
                        headers[split1[0].trim()]=split1[1].trim()
                    }
                })
            }

            this.isLoading=true
            util.ajax({
                url:config.baseApi+'api/httptest/getHttpResponseData',
                data:{
                    url:this.url,
                    method:this.method,
                    params:params,
                    headers:headers,
                },
                success:data=>{
                    popup.miss({title:'请求成功!'})
                    let scriptObj = $('#script-https')
                    if(scriptObj&&scriptObj.length){
                        scriptObj.remove()
                    }
                    this.httptestData = data.data

                    let responseData = data.data.data
                    let responseHeader = data.data.header

                    if(typeof(responseData)==='object'){
                        responseData = JSON.stringify(responseData, null, 4)
                    }
                    if(typeof(responseHeader)==='object'){
                        responseHeader = JSON.stringify(responseHeader, null, 4)
                    }
                    $('#viewShowDatas').text(responseData)
                    $('#viewShowHeaders').text(responseHeader)
                    $('body').append('<script id="script-https" src="https://cdn.bootcss.com/prism/1.9.0/prism.min.js"></script>')
                },
                complete:()=>{
                    this.isLoading=false
                }
            })
        },
        changeTable(number){
            this.table = number
        },
    }
})