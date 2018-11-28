var express = require('express');
var router = express.Router();
const {query} = require('../../models/db');

router.post('/login', async (req, res) => {
    const {phone, password} = req.body;
    console.log('-------session-----');
    console.log(req.session.user);
    try {
        const sql = 'SELECT * FROM user WHERE phone=? AND password=?';
        const results = await query(sql, [phone, password]);
        if (results.length > 0) {
            const user = results[0];
            delete user.password;
            // 登录成功需要在回话中保存登录状态
            req.session.user = user;
            res.json({success: true, data: user});
        } else {
            res.json({success: false, message: '电话或密码错误'});
        }
    } catch (error) {
        console.log(error);
        res.json({success: false, message: '服务器错误，请稍后重试！'});
    }
})

router.post('/verify-phone', async (req, res) => {
    try {
        const sql = 'SELECT * FROM user WHERE phone=?';
        const results = await query(sql, req.body.phone);
        if (results.length > 0) {
            res.json({success: false, message: '电话号码已存在'})
        } else{
            res.json({success: true})
        }
    } catch (error) {
        res.json({success: false, message: '服务器错误，请稍后重试！'})
    }
})


// 图形验证码生成
const captcha = require('trek-captcha')
router.get('/code-img', async (req, res) => {
    try {
        // token:是数字字母表示形式
        // buffer:是图片数据
        const {token, buffer} = await captcha({size: 4});
        console.log(token);
        // session中存储该token在将来验证时使用
        req.session.codeImg = token;
        // 将图片数据返回给前端
        res.json({
            success: true,
            data: buffer.toString('base64')
        })
    } catch (error) {
        // ...
        console.log(error);
    }
})


module.exports = router;








