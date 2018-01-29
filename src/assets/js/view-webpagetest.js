new Vue({
    el: '#webpagetest',
    data: function(){
        return{
            isLoading:false,
            screenlist:[
                {   
                    width:1920,
                    height:1080,
                },
                {   
                    width:320,
                    height:568,
                },
                {   
                    width:375,
                    height:667,
                },
                {   
                    width:414,
                    height:736,
                },
                {   
                    width:375,
                    height:812,
                },
            ],
            screentype:0,
            screenWidth:1920,
            screenHeight:1080,
            weburl:'',
        }
    },
    filters:{
        toFixed:window.Filter.toFixed,
        toSize:window.Filter.toSize,
        date:window.Filter.date,
        limitTo:window.Filter.limitTo,
    },
    watch:{
        'screentype'(val){
            this.screenWidth = this.screenlist[val].width
            this.screenHeight = this.screenlist[val].height
        }
    },
    mounted(){
        
    },
    methods:{
        biginTest(){
            util.ajax({
                url:config.baseApi+'api/webpagetest/getWebHttpResponseData',
                data:{
                    url:this.weburl,
                    screenWidth:this.screenWidth,
                    screenHeight:this.screenHeight,
                },
                success:data=>{
                    

                }

            })
        },
        
    }
})