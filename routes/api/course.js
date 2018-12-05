const express = require('express');
const router = express.Router();
const {query} = require('../../models/db');

router.get('/search', async (req, res) => {
    try {
        const sql = `SELECT * FROM kkb.vip_course where name like '%${req.query.keyword}%'`;
        const results = await query(sql);
        res.json({success: true, data: results})
    } catch (error) {
        res.json({success: false, message: '搜索错误，请重试！'})
    }
})

module.exports = router;








