const {query} = require('../models/db');
let coursesCache = null;
module.exports.initLocals = async function (req, res, next) {
    const isLogin = true;
    // 确定动态导航栏名字
    res.locals.navName = isLogin ? 'nav' : 'nav-unauth';
    // 将vip菜单数据存放至res.locals中
    if(coursesCache) {
        res.locals.courses = coursesCache;
        next();// 进入后续中间件
    } else {
        const sql = 'SELECT * FROM kkb.vip_course';
        try {
            const courses = await query(sql);//query必须返回Promise才能使用await
            // cooperation处理一下
            courses.forEach(course =>
                course.cooperation = course.cooperation.split(','));
            console.log(courses);
            coursesCache = res.locals.courses = courses;
            next();// 进入后续中间件
        } catch (err) {
            next(err)
        }
    }
}

// 保护用户，检查登录状态
module.exports.requireUser = function (req, res, next) {
    if (!req.session.user) {
        // 用户未登录，返回401状态码
        res.sendStatus(401);
    } else {
        next()
    }
}
module.exports.requireAdmin = function (req, res, next) {
    if (!req.session.admin && req.originalUrl !== '/admin/login') {
        // 用户未登录，返回401状态码
        res.redirect('/admin/login');
    } else {
        next()
    }
}