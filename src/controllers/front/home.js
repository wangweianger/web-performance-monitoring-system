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

    // 获得首页banner
    async getHomeBannerList(){
        try {
            let isOnline =1
            let isBanner = 1

            let sql = getsql.SELECT({
                table:'goods',
                fields:['id','title','bannerImg'],
                wheres:[{isBanner},{isOnline}]
            })

            let result = await mysql(sql);
            
            return result;

        } catch (err) {
            console.log(err)
            return '';
        }
    }

    // 获得推荐列表
    async getHomeRecomList(number){
        try {

            let isOnline    =   1
            let isRecom     =   1
            number          =   number||8

            let sql = getsql.SELECT({
                table:'goods',
                fields:['id','title','category','difficulty','longtime','mainimg','oldprice','newprice','tagsid','categoryid','size'],
                wheres:[{isRecom},{isOnline}],
                limit:{
                    pageNo:1,
                    pageSize:number,
                }
            })
            let result = await mysql(sql);
            return result;
        } catch (err) {
            console.log(err)
            return '';
        }
    }

    // 获取最新列表
    async getHomeNewList(){
        try {
            let isOnline =1
            let sql = getsql.SELECT({
                table:'goods',
                fields:['id','title','category','difficulty','longtime','mainimg','oldprice','newprice','tagsid','categoryid','size'],
                wheres:[{isOnline}],
                isdesc:true,
                sort:'id',
                limit:{
                    pageNo:1,
                    pageSize:8,
                }
            })

            let result = await mysql(sql);
            return result;

        } catch (err) {
            console.log(err)
            return '';
        }
    }

}

module.exports = new detail();