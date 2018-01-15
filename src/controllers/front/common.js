import moment from 'moment'
import {
    SYSTEM
} from '../../config'
import {
    util,
    mysql,
    getsql,
} from '../../tool'

class common {

    // 获取标签列表
    async getTagsList(ctx) {
        try {
            let sql = getsql.SELECT({
                table: 'tags',
                sort: 'id',
                isdesc: true,
            });
            let result = await mysql(sql);
            return result
        } catch (err) {
            console.log(err)
            return ''
        }
    }

    // 获取分类列表
    async getCategoryList(ctx) {
        try {
            let sql = getsql.SELECT({
                table: 'category',
                sort: 'id',
                isdesc: true,
            });
            let result = await mysql(sql);
            return result
            
        } catch (err) {
            console.log(err)
            return '';
        }
    }

}

module.exports = new common();

