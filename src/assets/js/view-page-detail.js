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
        }
    },
    filters:{
        toFixed:window.Filter.toFixed,
        toSize:window.Filter.toSize,
        date:window.Filter.date,
        limitTo:window.Filter.limitTo,
    },
    beforeMount(){
        this.pagesItemData=util.getStorage('session','pagesItemData')?JSON.parse(util.getStorage('session','pagesItemData')):{}
        this.url = this.pagesItemData.url
        this.changeTable(1);
        this.getDataForEnvironment(1);
        this.getDataForEnvironment(2);
        this.getDataForEnvironment(3);
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
                color:['#447ed9','#c945dc','#8b3cd8','#3c8bd8','#3cd87f','#cad83c','#d8893c','#d8483c'],
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
        }
       
    }
})