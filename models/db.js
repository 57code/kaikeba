// 连接数据库
const mysql = require('mysql')
const cfg = {
    host: 'localhost',
    user: 'kaikeba_admin',
    password: 'admin',
    database: 'kkb'
}
// 创建连接
// const conn = mysql.createConnection(cfg);
// conn.connect((err) => {//此步骤可省略, query时隐式连接
//     if (err) throw new Error('连接数据库失败！')
//     console.log('连接数据库成功！');
// });


// 连接池
const pool = mysql.createPool(cfg);

module.exports = {
    query: function (sql, value) {
        return new Promise((resolve, reject) => {
            // pool.getConnection((err, conn) => {
            //
            //     conn.release();
            // })

            // resolve函数在异步操作成功时执行
            // reject函数在异步操作失败时执行
            pool.query(sql, value, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            })
        })
    }
}








