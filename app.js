const createError = require('http-errors');// 创建错误对象
const express = require('express');
const path = require('path'); // 处理路径相关
const cookieParser = require('cookie-parser'); // cookie解析
const logger = require('morgan'); // 日志
const helper = require('./helpers');//注册hbs帮助方法
const cors = require('cors')

// 导出自定义中间件
const {initLocals} = require('./middleware');

// 导入路由相关模块
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const openCourses = require('./routes/open-courses');
const vipCourse = require('./routes/vip-course');
const adminRouter = require('./routes/admin');
const codeRouter = require('./routes/api/code');

const app = express();

// 视图引擎设置
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// 应用中间件
app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true
}));
app.use(logger('dev'));//日志
app.use(express.json());//获取ajax传递json
app.use(express.urlencoded({extended: false}));//解析url参数
app.use(cookieParser('its a secret'));//cookie解析
// 配置session，需要在cookie下面
const session = require('express-session');
const Store = require('express-mysql-session')(session);
const {pool} = require('./models/db');
const store = new Store(null, pool);
app.use(session({
    store, // 设置session存储为mysql，注意当前数据库用户需要表创建权限
    secret: 'its a secret',
    resave: false,
    saveUninitialized: false,
    // 如果不设置cookie中的maxAge，则session只在当前页面打开时有效，若
    // 关闭页面即失效
    // cookie: {maxAge: 7 * 24 * 3600 * 1000}
}))
// 设置静态目录
app.use(express.static(path.join(__dirname, 'public')));

// 注册自定义中间件
app.use(initLocals)


// 路由注册
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/open-courses', openCourses);
app.use('/vip-course', vipCourse);
app.use('/admin', adminRouter);
app.use('/api/code', codeRouter);
app.use('/api/users', require('./routes/api/users'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
