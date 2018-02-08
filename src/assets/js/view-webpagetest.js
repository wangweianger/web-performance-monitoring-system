new Vue({
    el: '#webpagetest',
    data: function(){
        return{
            isLoading:false,
            screenlist:[
                {   
                    width:1920,
                    height:1080,
                },
                {   
                    width:320,
                    height:568,
                },
                {   
                    width:375,
                    height:667,
                },
                {   
                    width:414,
                    height:736,
                },
                {   
                    width:375,
                    height:812,
                },
            ],
            screentype:0,
            screenWidth:1920,
            screenHeight:1080,
            weburl:'',
            listdata:[],
            divwidth:'',
            pageTotalTime:0,
            responseTotal:0,
            bodySizeSize:0,
            pageTotalsize:0,
            allData:[],
            XHRData:[],
            CSSData:[],
            JSData:[],
            IMGData:[],
            OtherData:[],
            className:'allData',
            widndowWidth:'',
            widndowHeight:'',
        }
    },
    filters:{
        toFixed:window.Filter.toFixed,
        toSize:window.Filter.toSize,
        date:window.Filter.date,
        limitTo:window.Filter.limitTo,
    },
    watch:{
        'screentype'(val){
            this.screenWidth = this.screenlist[val].width
            this.screenHeight = this.screenlist[val].height
        }
    },
    mounted(){
        this.$nextTick(() => {
            this.divwidth = $('#thbox').width()-80;
            this.widndowWidth = $(window).width();
            this.widndowHeight = $(window).height();
        })
    },
    methods:{
        biginTest(){
            this.isLoading=true;
            util.ajax({
                timeout:20000,
                url:config.baseApi+'api/webpagetest/getWebHttpResponseData',
                data:{
                    url:this.weburl,
                    screenWidth:this.screenWidth,
                    screenHeight:this.screenHeight,
                },
                success:data=>{
                    this.pageTotalTime=0
                    this.pageTotalsize=0
                    this.responseTotal=0
                    this.bodySizeSize=0
                    this.listdata={}

                    this.allData= [];
                    this.XHRData= [];
                    this.CSSData= [];
                    this.JSData= [];
                    this.IMGData= [];
                    this.OtherData= [];
                    this.listdata = [];
                    
                    this.pageTotalsize = data.data.entries[0].response.bodySize;
                    let lasitem = data.data.entries[data.data.entries.length-1];
                    let lastReqleft = lasitem.requestStartTime
                    let lastReqright =  lasitem.timings.time   
                    let totalTime = lastReqleft+lastReqright
                    let W1 = lastReqleft/totalTime*this.divwidth;
                    let W2 = lastReqright/totalTime*this.divwidth;
                    this.pageTotalTime = data.data.pages.onLoad
                    if(data.data.entries&&data.data.entries.length){
                        let lastres = data.data.entries[data.data.entries.length-1]
                        this.responseTotal = lastres.requestStartTime+lastres.timings.time+lastres.timings.wait
                    }
                    
                    data.data.entries.forEach((i,v) => {
                        i.shows = false;
                        i.parster = '';
                        i.timewidth = i.timings.time/totalTime*this.divwidth;
                        i.waitwidth = i.timings.wait/totalTime*this.divwidth;
                        i.lefts = i.requestStartTime/lastReqleft*W1;
                        i.boxleft = i.requestStartTime/lastReqleft*W1 > this.divwidth-150 ? this.divwidth-200:i.requestStartTime/lastReqleft*W1;
                        i.boxtop = i.requestStartTime/lastReqleft*W1 > this.divwidth-150 ? '30':'-110';
                        // this.pageTotalTime = this.pageTotalTime+i.timings.time;
                        // this.responseTotal = this.responseTotal+i.timings.wait;
                        this.bodySizeSize = this.bodySizeSize+i.response.bodySize;
                        
                        let mimeType = i.response.content.mimeType;
                        if (mimeType.indexOf('text/css') != -1) {
                            this.CSSData.push(i)
                        }else if (mimeType.indexOf('application/javascript') != -1) {
                            this.JSData.push(i);
                        }else if (mimeType.indexOf('image') != -1) {
                            this.IMGData.push(i);
                        }else if(mimeType.indexOf('application/json') != -1 || mimeType.indexOf('application/xml') != -1 || mimeType.indexOf('multipart/form-data') != -1 || mimeType.indexOf('application/x-www-form-urlencoded') != -1){
                            this.XHRData.push(i);
                        }else {
                            this.OtherData.push(i);
                        }
                        this.allData.push(i);
                    });
                    this.listdata = data.data;
                },
                complete:data=>{
                    this.isLoading=false;
                    popup.miss({title:'测评成功!'});
                }
            })
        },
        setdata(type) {
            this.className = type;
            this.listdata.entries = this[type];
        },
        showtr(item,index) {
            // let newitem  = JSON.parse(JSON.stringify(item));
            // newitem.shows = !newitem.shows;
            // Vue.set(this.listdata,index,newitem);
            // $($event.target).parents('.sliders').next().slideToggle();
            item.shows = !item.shows;
            console.log(item.shows)
        }
    }
})