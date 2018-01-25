new Vue({
    el: '#pagesDetail',
    data(){
        return{
            table:1,
            listdata:[],
            pageNo:1,
            pageSize:config.pageSize,
            totalNum:0,
            name:'',
            pagesItemData:{},
            isLoadEnd:false,
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
        this.name = this.pagesItemData.name
        this.getAjaxListForName();
    },
    mounted(){
        
    },
    methods:{
        getAjaxListForName(){
            util.ajax({
                url:config.baseApi+'api/ajax/getAjaxListForName',
                data:{
                    name:this.name,
                    pageNo:this.pageNo,
                    pageSize:this.pageSize,
                    beginTime:'',
                    endTime:'',
                },
                success:data=>{
                    this.isLoadEnd=true;
                    if(!data.data.datalist&&!data.data.datalist.length)return;
                    this.listdata = data.data.datalist;
                    new Page({
                         parent: $("#copot-page-pages"),
                         nowPage: this.pageNo,
                         pageSize: this.pageSize,
                         totalCount: data.data.totalNum,
                         callback:(nowPage, totalPage) =>{
                            this.pageNo = nowPage;
                            this.getAjaxListForName();
                        }
                    });
                    this.charts();
                }
            })
        },
        charts(){
            let datas       = this.listdata;
            let xAxisData   = []
            let seriesData  = []

            datas.forEach(item=>{
                xAxisData.push(new Date(item.createTime).format('hh:mm:ss'))
                seriesData.push({
                    value:item.duration,
                    name:new Date(item.createTime).format('yyyy/MM/dd hh:mm:ss'),
                })
            })

            console.log(seriesData)

            var myChart = echarts.init(document.getElementById('charts-pages'));
            var option = {
                title: {
                    text: 'AJAX性能分析表(单位ms)'
                },
                grid: {
                    top:50,
                    bottom: 50,
                    left:40,
                    right:10
                },
                tooltip: {
                    formatter: "{a} : {c}"
                },
                color:['#03a9f4'],
                xAxis: {
                    data: xAxisData,
                    axisTick:{ show:false },
                    axisLine:{ show:false },
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        show: true,
                        textStyle: {
                            color: '#B7B7B7',
                        }
                    },
                    axisTick:{ show:false },
                    splitLine:{
                        show:true,
                        lineStyle:{
                            color:"#E4E4E4",
                        }
                    },
                    axisLine:{
                        show:false,
                    },
                },
                series: [{
                    name: 'AJAX性能',
                    type: 'bar',
                    data: seriesData,
                }]
            };
            myChart.setOption(option);
        }
       
    }
})