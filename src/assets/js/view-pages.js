new Vue({
    el: '#pages',
    data: function(){
        return{
            listdata:[],
            pageNo:1,
            pageSize:config.pageSize,
            totalNum:0,
            
        }
    },
    filters:{
        toFixed:window.Filter.toFixed
    },
    mounted(){
        this.getinit();
    },
    methods:{
        getinit(){
            util.ajax({
                url:config.baseApi+'api/pages/getPageList',
                data:{
                    pageNo:this.pageNo,
                    pageSize:this.pageSize,
                    beginTime:'',
                    endTime:'',
                },
                success:data => {
                    if(!data.data.datalist&&!data.data.datalist.length)return;
                    data.data.datalist.forEach(item=>{
                        item.decodeUrl = encodeURIComponent(item.url)
                    })
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
            util.setStorage('session','pagesItemData',JSON.stringify(item))
            location.href="/pages/detail"
        }
    }
})