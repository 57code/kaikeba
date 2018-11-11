const express = require('express');
const router = express.Router();
const createError = require('http-errors');

// http://localhost:3000/vip-course/
router.get('/', (req, res) => {
    // res.render('vip-course/index')
    res.redirect('/vip-course/web')
})

// http://localhost:3000/vip-course/web
router.get('/:course', (req, res, next) => {
    // 传参方式2
    res.locals.bar = 'foo';
    // 方式一：url参数，req.params
    console.log(req.params.course);
    // 方式二：查询参，req.query
    console.log(req.query.a);
    // 方式三：请求体body

    // 错误处理：
    const title = getTitle(res, req.params.course);
    const type = 'bbb';
    if (title) {
        res.render('vip-course/' + req.params.course, {
            title,
            htmlStr: '<h1>htmlString</h1>',
            bool: false,
            abc: false,
            condition: 'abc',
            arr: [{name: 'tom', city: {cname: '北京'}, hobby: ['篮球','编程']},
                {name: 'jerry', city: {cname: '北京'}, hobby: ['篮球','编程']}],
            obj: {foo:'bar'},
            typeSwitch: {
                isAAA: type == 'aaa',
                isBBB: type == 'bbb',
                isCCC: type == 'ccc',
            },
            birthday: new Date(),
            a:true,
            b:false,
        })
    } else {
        // 没有匹配的vip课程
        // 错误处理方式1:404页面
        // 如果要进入错误流程，传递Error对象实例
        //next(new Error('没有您要的课程'));//状态码500
        // next(createError(404, '没有您要的课程'));//状态码404

        // 错误处理方式2：重定向
        res.redirect('/vip-course/web')
    }


})

// 获取当前页面标题
function getTitle(res, course) {
    for (const c of res.locals.courses) {
        if (c.url.indexOf(course) !== -1) {
            return c.name;
        }
    }
    return ''
}

module.exports = router;