import {
    DB
} from '../config.js'

const mysql2 = require('mysql2');
const pool = mysql2.createPool({
    host: DB.HOST,
    user: DB.USER,
    password: DB.PASSWORD,
    database: DB.DATABASE,
    port: DB.PROT,
    waitForConnections: DB.WAITFORCONNECTIONS, // 是否等待链接  
    connectionLimit: DB.POOLLIMIT, // 连接池数
    queueLimit: DB.QUEUELIMIT, // 排队限制 
});
const promisePool = pool.promise();


// let mysql = require('mysql2/promise');
// let connection = await mysql.createConnection({
//     host: DB.HOST,
//     user: DB.USER,
//     password: DB.PASSWORD,
//     database: DB.DATABASE,
//     port: DB.PROT
// });

async function mysql(opt1, opt2) {
    // let [result, fields] = await connection.execute(opt1, opt2);
    // await connection.end();
    // return result

    const [rows,fields] = await promisePool.query(opt1);

    return rows;
}

module.exports = mysql
