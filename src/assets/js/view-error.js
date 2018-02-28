new Vue({
    el: '#ajax',
    data: function(){
        return{
            method:'',
            listdata:[],
            datalist:[],
            pageNo:1,
            pageSize:config.pageSize,
            totalNum:0,
            table:0,
            isLoadend:false
        }
    },
    filters:{
        toFixed:window.Filter.toFixed,
        toSize:window.Filter.toSize,
    },
    computed:{  
        ajaxlist:function(){  
            return this.listdata.filter(function(item){  
                return item.category=='ajax'
            })  
        },
        resorucelist:function(){  
            return this.listdata.filter(function(item){  
                return item.category=='resource'
            })
        },
        jslist:function(){  
            return this.listdata.filter(function(item){  
                return item.category=='js'
            })  
        },  
    },  
    mounted(){
        this.getinit();
    },
    methods:{
        getinit(){
            this.isLoadend=false;
            let times = util.getSearchTime()
            let beginTime = times.beginTime 
            let endTime = times.endTime 

            util.ajax({
                url:config.baseApi+'api/error/getErrorList',
                data:{
                    pageNo:this.pageNo,
                    pageSize:this.pageSize,
                    beginTime:beginTime,
                    endTime:endTime,
                },
                success:data => {
                    this.isLoadend=true;
                    if(!data.data.datalist&&!data.data.datalist.length)return;
                    this.listdata = data.data.datalist;
                    this.datalist = data.data.datalist;
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
        selectTab(number){
            this.table = number
            switch(number){
                case 0:
                    this.datalist = this.listdata
                    break;
                case 1:
                    this.datalist = this.ajaxlist
                    break;
                case 2:
                    this.datalist = this.resorucelist
                    break;
                case 3:
                    this.datalist = this.jslist
                    break;            
            }
        },
        gotodetail(item){
            location.href="/error/detail?resourceUrl="+encodeURIComponent(item.resourceUrl)+'&category='+item.category
        }
    }
})