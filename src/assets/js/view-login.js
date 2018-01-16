new Vue({
    el: '#login',
    data: function(){
        return{
            type:1,   //1:登录  2：注册
            username:'',
            password:'',
            typassword:''
        }
    },
    mounted(){
        
    },
    methods:{
        login(){
            if(!this.username){
               popup.alert({ type: 'msg', title: '用户名有误!' });  return false;
            }
            if(!this.password){
               popup.alert({ type: 'msg', title: '用户密码有误!' }); return false;
            }
            util.ajax({
                url:config.baseApi + 'api/user/userLogin',
                data:{
                    userName:this.username,
                    passWord:this.password
                },
                success:function(data){
                    popup.miss({title:"登录成功！"});
                    util.setStorage('local','userMsg',JSON.stringify(data.data))
                    setTimeout(()=>{ location.href = '/' },500)
                }
            })
        },
        register(){
            if(!this.username){
               popup.alert({ type: 'msg', title: '用户名有误!' });  return false;
            }
            if(!this.password){
               popup.alert({ type: 'msg', title: '用户密码有误!' }); return false;
            }
            if(this.password!==this.typassword){
               popup.alert({ type: 'msg', title: '两次密码输入不一致!' }); return false;
            }

            util.ajax({
                url:config.baseApi + 'api/user/userRegister',
                data:{
                    userName:this.username,
                    passWord:this.password
                },
                success(){
                    popup.miss({title:"注册成功！"});
                    location.href="/login"
                }
            })
        }
    }
})