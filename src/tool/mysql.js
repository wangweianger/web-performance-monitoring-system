import {
    DB
} from '../config.js'

async function mysql(opt1, opt2) {

    let mysql = require('mysql2/promise');

    let connection = await mysql.createConnection({
        host: DB.HOST,
        user: DB.USER,
        password: DB.PASSWORD,
        database: DB.DATABASE,
        port: DB.PROT
    });

    let [result, fields] = await connection.execute(opt1, opt2);

    await connection.end();

    return result
}

module.exports = mysql