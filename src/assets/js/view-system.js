new Vue({
    el: '#index',
    data: function(){
        return{
            userId:'',
            datalist:[]
        }
    },
    beforeMount(){
        let userMsg = util.getStorage('local','userMsg')?JSON.parse(util.getStorage('local','userMsg')):{}
        this.userId = userMsg.id
        this.getDataList()
    },
    methods:{
        getDataList(){
            let _this = this;
            util.ajax({
                url:config.baseApi + 'api/system/getSystemList',
                data:{
                    userId:this.userId,
                },
                success(data){
                    _this.datalist=data.data
                }
            })
        },
        getDetail(item){
            $.cookie('systemId',item.id)
            util.setStorage('local','systemMsg',JSON.stringify(item))
            location.href="/pages"
        },
        goToSeeting(item){
            $.cookie('systemId',item.id)
            util.setStorage('local','systemMsg',JSON.stringify(item))
            location.href="/setting"
        }
    }
})