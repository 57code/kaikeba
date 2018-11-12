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