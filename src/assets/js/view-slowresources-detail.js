new Vue({
    el: '#pagesDetail',
    data(){
        return{
            table:1,
            listdata:[],
            pageNo:1,
            pageSize:config.pageSize,
            totalNum:0,
            name:util.getQueryString('name'),
            pagesItemData:{},
            isLoadend:false,
        }
    },
    filters:{
        toFixed:window.Filter.toFixed,
        toSize:window.Filter.toSize,
        date:window.Filter.date,
        limitTo:window.Filter.limitTo,
    },
    beforeMount(){
        if(this.name){
            this.getAverageValues()
        }else{
            this.pagesItemData=util.getStorage('session','slowresourcesItemData')?JSON.parse(util.getStorage('session','slowresourcesItemData')):{}
            this.name = this.pagesItemData.name
        }
        this.getAjaxListForName();
    },
    mounted(){
        
    },
    methods:{
        // 获得平均性能
        getAverageValues(){
            util.ajax({
                url:config.baseApi+'api/slowresources/getSlowresourcesList',
                data:{
                    name:this.name,
                    isAllAvg:false,
                },
                success:data=>{
                    this.pagesItemData=data.data   
                }
            })
        },
        getAjaxListForName(){
            this.isLoadend=false;
            let times = util.getSearchTime()
            let beginTime = times.beginTime 
            let endTime = times.endTime 

            util.ajax({
                url:config.baseApi+'api/slowresources/getSlowResourcesForName',
                data:{
                    name:this.name,
                    pageNo:this.pageNo,
                    pageSize:this.pageSize,
                    beginTime:beginTime,
                    endTime:endTime,
                },
                success:data=>{
                    this.isLoadend=true;
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
                }
            })
        },
    }
})