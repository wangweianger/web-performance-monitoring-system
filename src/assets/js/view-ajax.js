new Vue({
    el: '#ajax',
    data: function(){
        return{
            method:'',
            listdata:[],
            pageNo:1,
            pageSize:config.pageSize,
            totalNum:0,
        }
    },
    filters:{
        toFixed:window.Filter.toFixed,
        toSize:window.Filter.toSize,
    },
    watch:{
        'method':function(val){
            this.getinit()
        }
    },
    mounted(){
        util.showtime();
        this.getinit();
    },
    methods:{
        getinit(){
            this.isLoadend=false;
            let times = util.getSearchTime()
            let beginTime = times.beginTime 
            let endTime = times.endTime 

            util.ajax({
                url:config.baseApi+'api/ajax/getajaxlist',
                data:{
                    method:this.method,
                    pageNo:this.pageNo,
                    pageSize:this.pageSize,
                    beginTime:beginTime,
                    endTime:endTime,
                },
                success:data => {
                    this.isLoadend=true;
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
            util.setStorage('session','ajaxItemData',JSON.stringify(item))
            location.href="/ajax/detail"
        }
    }
})