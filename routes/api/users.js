var express = require('express');
var router = express.Router();
const {query} = require('../../models/db');
const md5 = require('md5');
const salt = 'take a little salt';
router.post('/auto-login', (req,res) => {
    const id = req.signedCookies.uid; // 加密方式获取
    // const id = req.cookies.uid; // 非加密获取
    if (id) {
        // 自动登录
        // 根据id查询用户信息
    } else {
        // 无自动登录
    }
})
router.post('/login', async (req, res) => {
    const {phone, password, autoLogin} = req.body;
    console.log('-------session-----');
    console.log(req.session.user);
    try {
        const sql = 'SELECT * FROM user WHERE phone=? AND password=?';
        const results = await query(sql, [phone, md5(password + salt)]);
        if (results.length > 0) {
            const user = results[0];
            delete user.password;
            // 登录成功需要在回话中保存登录状态
            if (autoLogin) {
                // cookie解决方案，和session二选一
                // res.cookie('uid', user.id, {
                //     signed: true, // 签名
                //     maxAge: 7*24*3600*1000, // 有效期
                //     httpOnly: true
                // })
                req.session.cookie.maxAge = 7*24*3600*1000;
            }
            // session存储用户登录状态
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

router.post('/verify-code-img', async (req, res) => {
    const success = req.session.codeImg === req.body.code;
    res.json({success});
})

// 图形验证码校验
router.post('/verify-phone', async (req, res) => {
    try {
        const sql = 'SELECT * FROM user WHERE phone=?';
        const results = await query(sql, req.body.phone);
        if (results.length > 0) {
            res.json({success: false, message: '电话号码已存在'})
        } else {
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


router.post('/register', async (req, res) => {
    const sql = 'INSERT INTO user SET ?';
    try {
        // 密码加密
        req.body.password = md5(req.body.password + salt);
        // 随机用户名
        req.body.username = '学员' + Date.now();
        const result = await query(sql, req.body);
        if (result.affectedRows > 0) {
            // 注册成功
            req.body.id = result.insertId;
            delete req.body.password;
            // 保存登录状态
            req.session.user = req.body;
            res.json({success: true, data: req.body})
        } else {
            res.json({success: false, message: '注册失败'})
        }
    } catch (error) {
        res.json({success: false, message: '服务器错误，请重试'})
    }
})


// 验证用户是否登录
router.post('/is-login', (req, res) => {
    if (req.session.user) {
        // 已登录
        res.json({success: true, data: req.session.user})
    } else {
        res.json({success: false, message: '用户未登录'})
    }
});
router.post('/logout', (req, res) => {
    // 清除会话
    // req.session.user = null;
    // delete req.session.user;
    req.session.destroy((err) => {
        if (err) {
            res.json({success: false, message: '注销失败了'})
        } else {
            res.json({success: true})
        }
    })
});

module.exports = router;








