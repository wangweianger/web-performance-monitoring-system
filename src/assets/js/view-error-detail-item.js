new Vue({
    el: '#ajax',
    data: function(){
        return{
            id:util.getQueryString('id'),
            category:'',
            datas:{},
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
                url:config.baseApi+'api/error/getErrorItemDetail',
                data:{
                    id:this.id
                },
                success:data => {
                    this.datas = data.data
                    this.category =data.data.category
                }
            })
        },
    }
})