const fs = require('fs');
const path = require('path');

const Sequelize = require('sequelize');
// 建立连接
const sequelize = new Sequelize('kkb', 'kaikeba_admin', 'admin', {
    host: 'localhost',
    dialect: 'mysql', // 方言设置
    pool: {max: 5, acquire: 30000, idle: 10000}, // 连接池
    define: {
        timestamps: false,
        freezeTableName: true
    }
});
// 定义模型
const User = sequelize.define('user', {// 字段定义
    firstName: {type: Sequelize.STRING(20), notNull: true},
    lastName: Sequelize.STRING(20),
    age: Sequelize.INTEGER,
});

// 同步数据库,FORCE如果为true则会删除已存在同名表
User.sync({force: true}).then(() => {
    // 插入若干测试数据
    return User.create({
        firstName: 'Tom',
        lastName: 'Cruise'
    })
}).then(() => {
    // 查询前面插入数据
    User.findAll().then(users => {
        // console.log(users);
    })
})

// 要导出的对象
const db = {Sequelize, sequelize};
// 动态导入模型
// 读取当前目录中所有文件名
fs.readdirSync(__dirname)
    .filter(file => (file !== 'index.js' && file !== 'db.js'))
    .forEach(file => { // 从文件中导入模型
        const model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
    });

module.exports = db;

















