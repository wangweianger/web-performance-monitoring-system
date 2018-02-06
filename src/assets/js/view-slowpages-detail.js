new Vue({
    el: '#pagesDetail',
    data(){
        return{
            listdata:[],
            pageNo:1,
            pageSize:config.pageSize,
            totalNum:0,
            isLoadEnd:false,
            url:util.getQueryString('url'),
            pagesItemData:{},
            isShowCharts:false,
        }
    },
    filters:{
        toFixed:window.Filter.toFixed,
        toSize:window.Filter.toSize,
        date:window.Filter.date,
        limitTo:window.Filter.limitTo,
    },
    beforeMount(){
        if(this.url){
            this.getAverageValues()
        }else{
            this.pagesItemData=util.getStorage('session','slowpagesItemData')?JSON.parse(util.getStorage('session','slowpagesItemData')):{}
            this.url = this.pagesItemData.url
        }
        this.getinit();
    },
    mounted(){
        
    },
    methods:{
        // 获得平均性能
        getAverageValues(){
            util.ajax({
                url:config.baseApi+'api/slowpages/getSlowpagesList',
                data:{
                    url:this.url,
                    isAllAvg:false,
                },
                success:data=>{
                    this.pagesItemData=data.data   
                }
            })
        },
        // 获得page详情
        getinit(){
            this.isLoadend=false;
            let times = util.getSearchTime()
            let beginTime = times.beginTime 
            let endTime = times.endTime 

            util.ajax({
                url:config.baseApi+'api/slowpages/getSlowPageItem',
                data:{
                    pageNo:this.pageNo,
                    pageSize:this.pageSize,
                    url:this.url,
                    callUrl:this.url,
                    beginTime:beginTime,
                    endTime:endTime,
                },
                success:data => {
                    this.isLoadend=true;
                    this.listdata = data.data.datalist
                    new Page({
                         parent: $('#copot-page-pages'),
                         nowPage: this.pageNo,
                         pageSize: this.pageSize,
                         totalCount: data.data.totalNum,
                         callback:(nowPage, totalPage) =>{
                             this.pageNo = nowPage;
                             this.getinit();
                         }
                    });

                }
            })
        },
        showCharts(){
            this.isShowCharts = !this.isShowCharts
            setTimeout(()=>{
                if(this.isShowCharts) this.echartShowPages()
            },200)
        },
        echartShowPages(){
            let datas       = this.listdata;
            if(!datas.length) return;
            let legendData  = ['页面加载时间','白屏时间','资源加载耗时','DOM构建时间','解析dom耗时','request请求耗时','页面准备时间']
            let xAxisData   = []
            let seriesData  = []
            legendData.forEach((item,index)=>{
                let data = {
                    name:item,
                    type: 'line',
                    data:[],
                }
                datas.forEach(proItem=>{
                    switch(index){
                        case 0:
                            data.data.push(proItem.loadTime)
                            break;
                        case 1: 
                            data.data.push(proItem.whiteTime)
                            break; 
                        case 2: 
                            data.data.push(proItem.resourceTime)
                            break;   
                        case 3: 
                            data.data.push(proItem.domTime)
                            break;   
                        case 4: 
                            data.data.push(proItem.analysisDomTime)
                            break;   
                        case 5: 
                            data.data.push(proItem.requestTime)
                            break;
                        case 6: 
                            data.data.push(proItem.readyTime)
                            break;                                        
                    }
                })
                seriesData.push(data)
            })
            datas.forEach(item=>{
                xAxisData.push( new Date(item.dateTime).format('MM/dd'));
            })

            var myChart=  echarts.init(document.getElementById('charts-pages'));
            let option=  {
                tooltip : {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    }
                },
                color:['#f44336','#00bcd4','#3cd87f','#ffeb3b','#e91e63','#9c27b0','#ff9800','#ff5722'],
                legend: {
                    data:legendData
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis : [{
                    type : 'category',
                    boundaryGap : false,
                    data : xAxisData
                }],
                yAxis : [{ type : 'value' } ],
                series : seriesData
            };
            myChart.setOption(option);
        }
       
    }
})