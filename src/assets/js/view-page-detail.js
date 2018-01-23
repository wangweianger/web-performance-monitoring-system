new Vue({
    el: '#pagesDetail',
    data(){
        return{
            table:1,
            listdata:[],
            pageNo:1,
            pageSize:config.pageSize,
            totalNum:0,
            url:util.getQueryString('url')
        }
    },
    filters:{
        toFixed:window.Filter.toFixed
    },
    mounted(){
        this.getinit();
    },
    methods:{
        changeTable(number){
            this.table = number
        },
        getinit(){
            util.ajax({
                url:config.baseApi+'api/pages/getPageItemDetail',
                data:{
                    pageNo:this.pageNo,
                    pageSize:this.pageSize,
                    url:this.url,
                    beginTime:'',
                    endTime:'',
                },
                success:data => {
                    this.listdata = data.data.datalist;
                    new Page({
                         parent: $("#copot-page"),
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
        }
    }
})