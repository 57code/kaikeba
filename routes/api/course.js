const express = require('express');
const router = express.Router();
const {query} = require('../../models/db');

router.get('/search', async (req, res) => {
    try {
        const sql = `SELECT * FROM kkb.vip_course where name like ?`;
        // 请这样传条件
        const results = await query(sql, '%'+req.query.keyword+'%');
        res.json({success: true, data: results})
    } catch (error) {
        res.json({success: false, message: '搜索错误，请重试！'})
    }
})

module.exports = router;








