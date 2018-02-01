new Vue({
    el: '#setting',
    data: function(){
        return{
            table:1,
            setting:{
                systemName:'',
                systemDomain:'',
                slowPageTime:'',
                slowJsTime:'',
                slowCssTime:'',
                slowImgTime:'',
            },
            systemInfo:{}
        }
    },
    filters:{
        toFixed:window.Filter.toFixed
    },
    mounted(){
        this.getDetail()
        this.settingIsUse()
    },
    methods:{
        getDetail(){
            util.ajax({
                url:config.baseApi+'api/system/getItemSystem',
                data:{
                    appId:this.appId
                },
                success:data=>{
                    this.systemInfo = data.data||{}
                    this.pagexingneng()
                }
            })
        },
        // 设置项目是否接收数据
        settingIsUse(){
            var elem = document.querySelector('.js-switch');
            var init = new Switchery(elem,{ color: '#2077ff'});
            elem.onchange = function() {
                util.ajax({
                    url:config.baseApi+'api/system/isStatisData',
                    data:{
                        key:'isUse',
                        value:elem.checked?0:1
                    },
                    success:data=>{
                        popup.miss({title:'操作成功!'})
                    }
                }) 
            };
        },
        updateSystem(){
            if(!this.systemInfo.systemName){ popup.alert({title: '请正确填写应用名称!'});  return false; }
            if(!this.systemInfo.systemDomain){ popup.alert({title: '请正确填写应用域名!'}); return false; }
            util.ajax({
                url:config.baseApi + 'api/system/updateSystem',
                data:this.systemInfo,
                success:data=>{
                    popup.miss({title:"操作成功！"});
                }
            })
        },
        changeTable(number){
            this.table = number
        },
        // 页面性能指标
        pagexingneng(){
            var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch-item'));
            elems.forEach((html,index)=>{
                switch(index){
                    case 0:
                        html.checked = this.systemInfo.isStatisiPages==0?true:false;
                        break;
                    case 1:
                        html.checked = this.systemInfo.isStatisiAjax==0?true:false;
                        break;
                    case 2:
                        html.checked = this.systemInfo.isStatisiResource==0?true:false;
                        break;
                    case 3:
                        html.checked = this.systemInfo.isStatisiSystem==0?true:false;
                        break;
                    case 4:
                        html.checked = this.systemInfo.isStatisiError==0?true:false;
                        break;
                }
                var switchery = new Switchery(html,{ color: '#2077ff'});
                html.onchange = ()=> {
                    let value = html.checked?0:1
                    switch(index){
                        case 0:
                            this.setDatas('isStatisiPages',value)
                            break;
                        case 1:
                            this.setDatas('isStatisiAjax',value)
                            break;
                        case 2:
                            this.setDatas('isStatisiResource',value)
                            break;
                        case 3:
                            this.setDatas('isStatisiSystem',value)
                            break;
                        case 4:
                            this.setDatas('isStatisiError',value)
                            break;
                    }
                }

            });
        },
        setDatas(key,value){
            util.ajax({
                url:config.baseApi+'api/system/isStatisData',
                data:{
                    key:key,
                    value:value
                },
                success:data=>{
                    popup.miss({title:'操作成功!'})
                }
            }) 
        }
        
    }
})