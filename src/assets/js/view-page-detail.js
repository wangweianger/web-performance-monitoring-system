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
            url:util.getQueryString('url')
        }
    },
    filters:{
        toFixed:window.Filter.toFixed,
        toSize:window.Filter.toSize,
        date:window.Filter.date,
        limitTo:window.Filter.limitTo,
    },
    mounted(){
        this.changeTable(1);
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
        // 获得ajax列表详情
        getDataForAjax(){
            util.ajax({
                url:config.baseApi+'api/ajax/getPageItemDetail',
                data:{
                    pageNo:this.pageNo,
                    pageSize:this.pageSize,
                    callUrl:this.url,
                    beginTime:'',
                    endTime:'',
                },
                success:data => {
                    this.isLoadEnd=true;
                    this.listAjax = this.listAjax.concat(data.data.datalist||[]);
                    new Page({
                         parent: $("#copot-page-ajax"),
                         nowPage: this.pageNo,
                         pageSize: this.pageSize,
                         totalCount: data.data.totalNum,
                         callback:(nowPage, totalPage) =>{
                             this.pageNo = nowPage;
                             this.getDataForAjax();
                         }
                     });
                }
            })
        },
        // 获得慢页面加载资源
        getSlowPageItem(){
            util.ajax({
                url:config.baseApi+'api/slowpages/getSlowPageItem',
                data:{
                    pageNo:this.pageNo,
                    pageSize:this.pageSize,
                    callUrl:this.url,
                    beginTime:'',
                    endTime:'',
                },
                success:data => {
                    this.isLoadEnd=true;
                    this.listAjax = this.listAjax.concat(data.data.datalist||[]);
                    new Page({
                         parent: $("#copot-page-ajax"),
                         nowPage: this.pageNo,
                         pageSize: this.pageSize,
                         totalCount: data.data.totalNum,
                         callback:(nowPage, totalPage) =>{
                             this.pageNo = nowPage;
                             this.getDataForAjax();
                         }
                     });
                }
            })
        }
    }
})