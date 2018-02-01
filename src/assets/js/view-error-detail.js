new Vue({
    el: '#ajax',
    data: function(){
        return{
            listdata:[],
            pageNo:1,
            pageSize:config.pageSize,
            totalNum:0,
            resourceUrl:util.getQueryString('resourceUrl'),
            category:util.getQueryString('category'),
        }
    },
    filters:{
        date:window.Filter.date,
    },
    mounted(){
        util.showtime();
        this.getinit();
    },
    methods:{
        getinit(){
            util.ajax({
                url:config.baseApi+'api/error/getErrorListDetail',
                data:{
                    category:this.category,
                    resourceUrl:this.resourceUrl,
                    pageNo:this.pageNo,
                    pageSize:this.pageSize,
                    beginTime:'',
                    endTime:'',
                },
                success:data => {
                    if(!data.data.datalist&&!data.data.datalist.length)return;
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
        },
        gotodetail(item){
            location.href="/error/detail/item?id="+item.id
        }
    }
})