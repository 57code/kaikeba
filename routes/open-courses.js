const express = require('express');
const router = express.Router();
const {query} = require('../models/db');

// http://localhost:3000/open-courses/
router.get('/', async (req, res, next) => {
    // 查询公开课数据
    try {
        const currentPage = req.query.page || 1;// 获取当前页码，如没有则默认1
        const pageSize = req.query.pageSize || 1;// 每页条数
        const offset = (currentPage - 1) * pageSize;// 计算偏移量
        const sql = 'SELECT * FROM open_course ORDER BY time DESC LIMIT ?,?';// LIMIT offset,size
        const results = await query(sql, [offset, pageSize]);
        for (const result of results) {
            const now = new Date();
            const endTime = new Date(result.time);
            if (now - endTime > 0) { // 已结束，看回放
                result.notBegin = false;
            } else {
                result.notBegin = true;
            }
        }
        res.render('open-courses', {
            title: '公开课',
            openCourses: results
        });
    } catch (err) {
        console.log(err);
        next(err);
    }
})


module.exports = router;