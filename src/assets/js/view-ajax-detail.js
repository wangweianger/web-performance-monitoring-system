new Vue({
    el: '#pagesDetail',
    data(){
        return{
            table:1,
            listdata:[],
            listAjax:[],
            listslowpages:[],
            listresources:[],
            pageNo:1,
            pageSize:config.pageSize,
            totalNum:0,
            isLoadEnd:false,
            url:'',
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
        this.pagesItemData=util.getStorage('session','ajaxItemData')?JSON.parse(util.getStorage('session','ajaxItemData')):{}
        this.url = this.pagesItemData.url
        // this.changeTable(1);
        // this.getDataForEnvironment(1);
        // this.getDataForEnvironment(2);
        // this.getDataForEnvironment(3);
    },
    mounted(){
        
    },
    methods:{
        changeTable(number){
            this.isLoadEnd  =false
            this.pageNo     = 1
            this.table      = number
            let api         = ''
            let pageName    = ''
            switch(number){
                case 1:
                    if(!this.listdata.length){
                        api         = 'api/pages/getPageItemDetail',
                        pageName    = '#copot-page-pages'
                        this.getinit(api,pageName);
                    } 
                    break;
                case 2:
                    if(!this.listAjax.length){
                        api         = 'api/ajax/getPageItemDetail',
                        pageName    = '#copot-page-ajax'
                        this.getinit(api,pageName);
                    }
                    break;
                case 3:
                    if(!this.listslowpages.length){
                        api         = 'api/slowpages/getSlowPageItem',
                        pageName    = '#copot-page-slowpages'
                        this.getinit(api,pageName);
                    }
                    break;
                case 4:
                    if(!this.listresources.length){
                        api         = 'api/slowresources/getSlowResourcesItem',
                        pageName    = '#copot-page-slowresources'
                        this.getinit(api,pageName);
                    }
                    break;            
            }
        },
        // 获得page详情
        getinit(api,pageName){
            util.ajax({
                url:config.baseApi+api,
                data:{
                    pageNo:this.pageNo,
                    pageSize:this.pageSize,
                    url:this.url,
                    callUrl:this.url,
                    beginTime:'',
                    endTime:'',
                },
                success:data => {
                    this.isLoadEnd=true;
                    switch(this.table){
                        case 1:
                            this.listdata = this.listdata.concat(data.data.datalist||[]);
                            break;
                        case 2:
                            this.listAjax = this.listAjax.concat(data.data.datalist||[]);
                            break;
                        case 3:
                            this.listslowpages = this.listslowpages.concat(data.data.datalist||[]);
                            break;
                        case 4:
                            this.listresources = this.listresources.concat(data.data.datalist||[]);
                            break;            
                    }
                    new Page({
                         parent: $(pageName),
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
        // 获得浏览器分类情况
        getDataForEnvironment(type){
            util.ajax({
                url:config.baseApi+'api/environment/getDataForEnvironment',
                data:{
                    url:this.url,
                    beginTime:'',
                    endTime:'',
                    type:type
                },
                success:data => {
                    this.isLoadEnd=true;
                    switch(type){
                        case 1:
                            this.getData(data.data,'echartBorwsers-borwser','browser','borwserVersion')
                            break;
                        case 2:
                            this.getData(data.data,'echartBorwsers-system','system','systemVersion')
                            break;
                        case 3:
                            this.getData(data.data,'echartBorwsers-address','city')
                            break;        
                    }
                    
                }
            })
        },
        getData(datas,id,tyle,typeVersion){
            let seriesData=[];
            let legendData=[]
            let totalcount=0
            if(!datas.length) return;
            datas.forEach(item=>{
                totalcount+=item.count
            })
            datas.forEach(item=>{
                let name = typeVersion?item[tyle]+' '+item[typeVersion]:item[tyle]
                legendData.push({
                    name:name,
                    icon: 'pin'
                })
                seriesData.push({
                    name:name,
                    value:item.count,
                    percentage:((item.count/totalcount)*100).toFixed()+'%'
                })
            })
            this.echartBorwsers(id,legendData,seriesData)
        },
        // echart表
        echartBorwsers(id,legendData,seriesData){
            var myChart = echarts.init(document.getElementById(id));
            var option = {
                tooltip: {
                    formatter: "{b} : {c} ({d}%)"
                },
                color:['#f44336','#e91e63','#9c27b0','#00bcd4','#3cd87f','#ffeb3b','#ff9800','#ff5722'],
                legend: {
                    orient: 'vertical',
                    right: 0,
                    top: 20,
                    bottom: 20,
                    data:legendData,
                    formatter:function(name){
                        for(let i=0;i<seriesData.length;i++){
                            if(name === seriesData[i].name){
                                return name+'   '+seriesData[i].value+'   '+seriesData[i].percentage;    
                            }
                        }
                    }
                },
                series: [{
                    type: 'pie',
                    radius : '50%',
                    center: ['25%', '50%'],
                    label: {
                        normal: {
                            show: false,
                        },
                    },
                    data: seriesData
                }]
            };
            myChart.setOption(option);
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
                color:['#f44336','#e91e63','#9c27b0','#00bcd4','#3cd87f','#ffeb3b','#ff9800','#ff5722'],
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
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap : false,
                        data : xAxisData
                    }
                ],
                yAxis : [
                    {
                        type : 'value'
                    }
                ],
                series : seriesData
            };
            myChart.setOption(option);
        }
       
    }
})