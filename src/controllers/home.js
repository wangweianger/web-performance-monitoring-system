import moment from 'moment'
import sql from 'node-transform-mysql'
import {
    SYSTEM
} from '../config'
import {
    util,
    mysql,
    getsql,
} from '../tool'

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
}

module.exports = new detail();