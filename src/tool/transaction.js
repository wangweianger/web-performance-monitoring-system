import {
    DB
} from '../config.js'

async function transaction(arr) {

    return new Promise((res,ret)=>{
        let mysql = require('mysql2');
        let transaction = require('node-mysql-transaction');

        let trCon = transaction({
            connection: [mysql.createConnection,{
                host: DB.HOST,
                user: DB.USER,
                password: DB.PASSWORD,
                database: DB.DATABASE,
                port: DB.PROT
            }],
            dynamicConnection: 32,
            idleConnectionCutoffTime: 1000,
            timeout:600
        });

        let chain = trCon.chain();
        chain.
        on('commit', function(){
            res();
        }).
        on('rollback', function(err){
            console.log(err.message)
            ret(err);
        });
        
        arr.forEach((item,i)=>{
            chain.
            query(item).
            on('result', function(result){
                if(i==arr.length-1){
                    chain.commit();
                }
            }).autoCommit(false);
        })
    })
};

module.exports = transaction