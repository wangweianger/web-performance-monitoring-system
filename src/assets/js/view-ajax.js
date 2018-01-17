new Vue({
    el: '#ajax',
    data: function(){
        return{
            method:'',
            listdata:[],
        }
    },
    mounted(){
        console.log(util)
        util.showtime();
        this.getinit();
    },
    methods:{
        getinit(){
            util.ajax({
                url:config.baseApi+'api/ajax/getajaxlist',
                data:{
                    method:this.method
                },
                success:data => {
                    console.log(data)
                    this.listdata = data.data;
                }
            })
        }
    }
})