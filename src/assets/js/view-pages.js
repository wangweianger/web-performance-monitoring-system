new Vue({
    el: '#pages',
    data: function(){
        return{
            listdata:[],
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
                success:data => {
                    this.listdata = data.data;
                }
            })
        }
    }
})