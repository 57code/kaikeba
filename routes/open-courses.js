const express = require('express');
const router = express.Router();
const {query} = require('../models/db');
const {OpenCourse} = require('../models');

// http://localhost:3000/open-courses/
router.get('/', async (req, res, next) => {
    // 查询公开课数据
    try {
        const page = +req.query.page || 1;// 获取当前页码，如没有则默认1
        const size = +req.query.size || 1;// 每页条数
        const offset = (page - 1) * size;// 计算偏移量
        const sql = 'SELECT * FROM open_course ORDER BY time DESC LIMIT ?,?';// LIMIT offset,size
        const results = await query(sql, [offset, size]);

        for (const result of results) {
            const now = new Date();
            const endTime = new Date(result.time);
            if (now - endTime > 0) { // 已结束，看回放
                result.notBegin = false;
            } else {
                result.notBegin = true;
            }
        }

        // 获取分页数据
        // 1.获取数据总条数
        const count =
            await query('SELECT count(*) as count FROM open_course')
                .then(results => results[0].count)
        console.log('总条数：' + count);


        res.render('open-courses', {
            title: '公开课',
            openCourses: results,
            pagination: getPagination(count, page, size)
        });
    } catch (err) {
        console.log(err);
        next(err);
    }
});

router.get('/bySeq', async (req, res, next) => {
    try {
        const page = +req.query.page || 1;// 获取当前页码，如没有则默认1
        const size = +req.query.size || 1;// 每页条数
        //返回带总条数的对象 {rows: [], count}
        const results = await OpenCourse.findAndCountAll({
            offset: (page - 1) * size, // 分页偏移量
            limit: size, // 查询条数
            order: [['time', 'DESC']] // 排序
        });

        res.render('open-courses', {
            title: '公开课',
            openCourses: results.rows, // 数据
            pagination: getPagination(results.count, page, size)
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
})

function getPagination(count, page, size) {
    const total = Math.ceil(count / size);//总页数
    const first = page != 1;//是否有首页
    const last = page != total;//是否有最后页
    const prev = page > 1;//是否有上一页
    const next = page < total;//是否有下一页
    return {page, total, first, last, prev, next}
}

module.exports = router;