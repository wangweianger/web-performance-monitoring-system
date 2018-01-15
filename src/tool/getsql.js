import md5 from 'md5'
import {
    SYSTEM,
    DB
} from '../config'

//config配置
class getsql {

    constructor() {

    }

    /*  组装sql  --- SELECT
        fields:          array     需要查询的字段     
        table :          string    查询的表
        wheres:          array     查询的where条件   '!':true  表示非  'like':true 表示模糊查询  
        isdesc:          boolean   是否desc排序
        sort:            string    排序字段
        iscount:         boolean   是否查询总条数   
        limit:           object    分页
        
        example:
            getsql.SELECT({
                    fields:'id,name,companyCode'
                    table:'system',
                    wheres:[{companyCode,'!':true},{name,'like':true}],
                    isdesc:true,
                    sort:'id',
                    limit:{
                            pageNo:1,
                            pageSize:10,
                        }
                })

    */
    SELECT(json = {}) {
        let sql = 'select ';
        let fields = json.fields || []
        let wheres = json.wheres || []
        let wheresCopy = []
        let isdesc = json.isdesc
        let sort = json.sort
        let iscount = json.iscount ? true : false
        let limit = json.limit || {}
        let table = DB.PREFIX + json.table

        //---------- 处理COUNT -------------------------------
        if (iscount) {
            //查询total 总数
            sql += ` COUNT(*) from ${table} `
        } else {
            //查询数据列表
            if (fields.length) {
                sql += `${fields.join(',')} from ${table} `
            } else {
                sql += `* from ${table} `
            }
        }
        //---------- 处理WHERER -------------------------------
        if (wheres.length) {
            wheres.forEach(item => {
                for (let key in item) {
                    if (key == '!') continue;
                    if (key == 'like') continue;
                    if (item[key] + '') wheresCopy.push(item);
                }
            })
        };

        sql += this.getWhereSql(wheresCopy)

        //----------- 处理ORDER BY ------------------------------
        if (isdesc && sort) {
            sql += `order by ${sort} desc `
        } else if (!isdesc && sort) {
            sql += `order by ${sort} `
        }

        //----------- 处理limit ---------------------------------
        if (limit.pageNo) {
            let begin = 0;
            if (limit.pageNo == 1) {
                begin = 0;
            } else {
                begin = (parseInt(limit.pageNo) - 1) * parseInt(limit.pageSize);
            }

            sql += ` limit ${begin},${limit.pageSize} `
        }

        return sql;
    };

    /* 组装sql  --- UPDATE
       table:      string 
       fields:     array    设置的字段
       wheres:     array    插入字段依赖的条件 
    */
    UPDATE(json = {}) {
        let table = DB.PREFIX + json.table
        let fields = json.fields || []
        let wheres = json.wheres || []

        let sql = `update ${table} set `

        if (fields.length < 1) return false;
        fields.forEach((item, i) => {
            if (i == fields.length - 1) {
                for (let key in fields[i]) {
                    sql += `${key} = '${fields[i][key]}' `
                }
            } else {
                for (let key in fields[i]) {
                    sql += `${key} = '${fields[i][key]}',`
                }
            };
        })

        sql += this.getWhereSql(wheres)

        return sql;
    };

    /*组装sql  --- INSERT 
        table:   string  
        fields:     array    设置的字段
    */
    INSERT(json = {}) {
        let table = DB.PREFIX + json.table
        let fields = json.fields || []

        let sql = `INSERT INTO ${table} `;
        let fieone = '('
        let fietwo = '('

        if (fields.length < 1) return false;
        fields.forEach((item, index) => {
            if (index == fields.length - 1) {
                for (let key in item) {
                    fieone += `${key}`
                    fietwo += `'${item[key]}'`
                }
            } else {
                for (let key in item) {
                    fieone += `${key},`
                    fietwo += `'${item[key]}',`
                }
            }
        })
        fieone += ')'
        fietwo += ')'
        sql += `${fieone} VALUES ${fietwo}`;

        return sql
    };

    /*组装sql  --- delete 
        table:   string  
        wheres:     array    设置的字段
    */
    DELETE(json = {}) {
        let table = DB.PREFIX + json.table
        let wheres = json.wheres || []

        let sql = `DELETE FROM ${table} `

        sql += this.getWhereSql(wheres)

        return sql;
    };

    //sql 获得where条件
    getWhereSql(wheres = []) {
        let sql = '';
        if (wheres.length) {
            let str = '';
            if (wheres.length < 1) return sql;
            for (let i = 0, len = wheres.length; i < len; i++) {
                if (i == wheres.length - 1) {
                    for (let key in wheres[i]) {
                        if (key == '!' || key == 'like') continue;
                        if (wheres[i]['!']) {
                            str += `${key}!='${wheres[i][key]}' `
                        } else if (wheres[i]['like']) {
                            str += `${key} like '%${wheres[i][key]}%' `
                        } else {
                            str += `${key}='${wheres[i][key]}' `
                        }
                    }
                } else {
                    for (let key in wheres[i]) {
                        if (wheres[i]['!']) {
                            if (key == '!' || key == 'like') continue;
                            str += `${key}!='${wheres[i][key]}' and `
                        } else if (wheres[i]['like']) {
                            str += `${key} like '%${wheres[i][key]}%' and `
                        } else {
                            str += `${key}='${wheres[i][key]}' and `
                        }

                    }
                }
            }
            sql = `where ${str} `;
        }
        return sql;
    };
}

module.exports = new getsql();