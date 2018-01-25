new Vue({
    el: '#pagesDetail',
    data(){
        return{
            id:util.getQueryString('id'),
            type:util.getQueryString('type'),
            pagesItemData:{},
            environment:{},
            sourceslist:[],
        }
    },
    filters:{
        toFixed:window.Filter.toFixed,
        toSize:window.Filter.toSize,
        date:window.Filter.date,
        limitTo:window.Filter.limitTo,
    },
    beforeMount(){
        if(this.type&&this.type==='slow'){
            this.getslowPageItemForId();
        }else{
            this.getPageItemForId();
        }
    },
    mounted(){
    },
    methods:{
        // 获得页面请求性能详情
        getPageItemForId(){
            util.ajax({
                url:config.baseApi+'api/pages/getPageItemForId',
                data:{
                    id:this.id
                },
                success:data=>{
                    this.pagesItemData = data.data
                    this.getUserEnvironment(data.data.markPage)
                    this.getSourcesForMarkPage(data.data.markPage)
                }
            })
        },
        //获得慢页面加载性能详情
        getslowPageItemForId(){
            util.ajax({
                url:config.baseApi+'api/slowpages/getslowPageItemForId',
                data:{
                    id:this.id
                },
                success:data=>{
                    this.pagesItemData = data.data
                    this.getUserEnvironment(data.data.markPage)
                    this.getSourcesForMarkPage(data.data.markPage)
                }
            })
        },
        // 访问者信息
        getUserEnvironment(markPage){
            util.ajax({
                url:config.baseApi+'api/environment/getUserEnvironment',
                data:{
                    markPage:markPage
                },
                success:data=>{
                    this.environment = data.data
                }
            })
        },
        // 请求资源信息
        getSourcesForMarkPage(markPage){
            util.ajax({
                url:config.baseApi+'api/sources/getSourcesForMarkPage',
                data:{
                    markPage:markPage
                },
                success:data=>{
                    let list = data.data.resourceDatas?JSON.parse(data.data.resourceDatas):[]
                    let total = 0
                    list.forEach(item=>{
                        total+=item.duration*1
                    })
                    list.forEach((item,index)=>{
                        list[index].proportion = (item.duration*1)/total * 100
                    })
                    this.sourceslist = list
                }
            })
        }
       
       
    }
})