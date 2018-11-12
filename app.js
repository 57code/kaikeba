const createError = require('http-errors');// 创建错误对象
const express = require('express');
const path = require('path'); // 处理路径相关
const cookieParser = require('cookie-parser'); // cookie解析
const logger = require('morgan'); // 日志
const helper = require('./helpers');//注册hbs帮助方法

// 导出自定义中间件
const {initLocals} = require('./middleware');

// 导入路由相关模块
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const openCourses = require('./routes/open-courses');
const vipCourse = require('./routes/vip-course');

const app = express();

// 视图引擎设置
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// 应用中间件
app.use(logger('dev'));//日志
app.use(express.json());//获取ajax传递json
app.use(express.urlencoded({extended: false}));//解析url参数
app.use(cookieParser());//cookie解析
// 设置静态目录
app.use(express.static(path.join(__dirname, 'public')));

// 注册自定义中间件
app.use(initLocals)



// 路由注册
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/open-courses', openCourses);
app.use('/vip-course', vipCourse);

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
