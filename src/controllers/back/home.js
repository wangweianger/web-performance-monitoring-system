import moment from 'moment'
import {
    SYSTEM
} from '../../config'
import {
    util,
    mysql,
    getsql,
} from '../../tool'

class detail {

    //初始化对象
    constructor() {

    };

    // 获取列表
    async getList(ctx) {
        try {
            let pageNo   = ctx.request.body.pageNo || 1
            let pageSize = ctx.request.body.pageSize || SYSTEM.PAGESIZE
            let isOnline = ctx.request.body.isOnline || ''
            let isRecom  = ctx.request.body.isRecom || ''  
            let isBanner  = ctx.request.body.isBanner || ''    

            let datas = {
                totalNum:0,
                datalist:[],
                pageNo:pageNo,
                pageSize:pageSize
            };
            let arr=[]
            if(isOnline+'') arr.push({isOnline})
            if(isRecom+'') arr.push({isRecom})
            if(isBanner+'') arr.push({isBanner})

            // ----------------   查询总条数 sql   -------------------------
            let totalSql = getsql.SELECT({
                table: 'goods',
                wheres:arr,
                iscount: true,
            })
            let totalNum = (await mysql(totalSql))[0]['COUNT(*)']

            // ---------------   查询列表数据 sql ---------------------------       
            let sql = getsql.SELECT({
                table: 'goods',
                wheres:arr,
                sort: 'id',
                isdesc: true,
            });
            let result = await mysql(sql);

            if (result && result.length) {
                result.forEach((i,k) => {
                   i.createTime = moment(i.createTime).format('YYYY-MM-DD HH:mm:ss')
                })
            }

            datas.totalNum = totalNum;
            datas.datalist = result;
            ctx.body = util.result({
                data: datas
            });
            
        } catch (err) {
            console.log(err)
            ctx.body = util.result({
                code: 1001,
                desc: "参数错误"
            });
            return;
        }
    }

    // 获得单个商品详情
    async getItemDetail(ctx){
        try {
            let id=ctx.request.body.id

            if(!id){
                ctx.body = util.result({
                    code: 1001,
                    desc: "参数不全"
                });
                return;
            }

            let sql = getsql.SELECT({
                table:'goods',
                wheres:[{id}]
            })

            let result = await mysql(sql);
            
            ctx.body = util.result({
                data: result.length?result[0]:[]
            });

        } catch (err) {
            console.log(err)
            ctx.body = util.result({
                code: 1001,
                desc: "服务错误"
            });
            return;
        }
    }

    // 删除商品
    async deleteGoods(ctx){
        try {
            let id=ctx.request.body.id

            if(!id){
                ctx.body = util.result({
                    code: 1001,
                    desc: "参数不全"
                });
                return;
            }

            let sql = getsql.DELETE({
                table:'goods',
                wheres:[{id}]
            })

            let result = await mysql(sql);
            
            ctx.body = util.result({
                data: result
            });

        } catch (err) {
            console.log(err)
            ctx.body = util.result({
                code: 1001,
                desc: "服务错误"
            });
            return;
        }
    }

    // 商品上下架
    async editOnline(ctx){
        try {
            let id = ctx.request.body.id
            let isOnline = ctx.request.body.isOnline

            if(!id){
                ctx.body = util.result({
                    code: 1001,
                    desc: "参数不全"
                });
                return;
            }

            let sql = getsql.UPDATE({
                table:'goods',
                fields:[{isOnline}],
                wheres:[{id}]
            })

            let result = await mysql(sql);
            
            ctx.body = util.result({
                data: result
            });

        } catch (err) {
            console.log(err)
            ctx.body = util.result({
                code: 1001,
                desc: "服务错误"
            });
            return;
        }
    }

    // 首页是否推荐
    async editRecom(ctx){
        try {
            let id = ctx.request.body.id
            let isRecom = ctx.request.body.isRecom

            if(!id){
                ctx.body = util.result({
                    code: 1001,
                    desc: "参数不全"
                });
                return;
            }

            let sql = getsql.UPDATE({
                table:'goods',
                fields:[{isRecom}],
                wheres:[{id}]
            })

            let result = await mysql(sql);
            
            ctx.body = util.result({
                data: result
            });

        } catch (err) {
            console.log(err)
            ctx.body = util.result({
                code: 1001,
                desc: "服务错误"
            });
            return;
        }
    }
    
    // 编辑商品
    async editGoods(ctx){
        try {
            let id          =   ctx.request.body.id
            let title       =   ctx.request.body.title
            let category    =   ctx.request.body.category
            let difficulty  =   ctx.request.body.difficulty
            let longtime    =   ctx.request.body.longtime
            let mainimg     =   ctx.request.body.mainimg
            let oldprice    =   ctx.request.body.oldprice
            let newprice    =   ctx.request.body.newprice
            let ewmimg      =   ctx.request.body.ewmimg
            let describes   =   ctx.request.body.desc
            let text        =   ctx.request.body.text
            let size        =   ctx.request.body.size
            let tagsid      =   ctx.request.body.tagsid
            let categoryid  =   ctx.request.body.categoryid
            let isOnline    =   ctx.request.body.isOnline
            let isRecom     =   ctx.request.body.isRecom
            let isBanner    =   ctx.request.body.isBanner
            let bannerImg   =   ctx.request.body.bannerImg
            let createTime  =   moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss')

            if(!title || !mainimg || !newprice || !ewmimg || !text){
                ctx.body = util.result({
                    code: 1001,
                    desc: "参数不全"
                });
                return;
            }

            let arr=[{title},{mainimg},{newprice},{ewmimg},{text}];
            if(category) arr.push({category});
            if(difficulty) arr.push({difficulty});
            if(longtime) arr.push({longtime});
            if(oldprice) arr.push({oldprice});
            if(describes) arr.push({describes});
            if(size) arr.push({size});
            if(tagsid) arr.push({tagsid});
            if(categoryid) arr.push({categoryid});
            if(createTime) arr.push({createTime});
            if(isOnline+'') arr.push({isOnline});
            if(isRecom+'') arr.push({isRecom});
            if(isBanner+'') arr.push({isBanner});
            if(bannerImg) arr.push({bannerImg});

            let sql = ""
            if (id) {
                // 表示修改
                sql = getsql.UPDATE({
                    table: 'goods',
                    fields: arr,
                    wheres: [{
                        id
                    }]
                })
            } else {
                // 表示新增
                sql = getsql.INSERT({
                    table: 'goods',
                    fields: arr,
                })
            }

            console.log(sql)

            let result = await mysql(sql)

            ctx.body = util.result({
                data: result
            });

        } catch (err) {
            console.log(err)
            ctx.body = util.result({
                code: 1001,
                desc: "服务错误"
            });
            return;
        }
    }


    

}

module.exports = new detail();