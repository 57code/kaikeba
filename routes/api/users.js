var express = require('express');
var router = express.Router();
const {query} = require('../../models/db');
const md5 = require('md5');
const {requireUser} = require('../../middleware');
const salt = 'take a little salt';
router.post('/auto-login', (req, res) => {
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
                req.session.cookie.maxAge = 7 * 24 * 3600 * 1000;
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


const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) { // 存储目录
        cb(null, 'public/images/');
    },
    filename: function (req, file, cb) {
        let extname = '';
        switch (file.mimetype) {
            case 'image/jpeg':
                extname = '.jpg';
                break;
            case 'image/png':
                extname = '.png';
                break;
            case 'image/gif':
                extname = '.gif';
                break;
        }
        cb(null, Date.now() + extname);
    }
})
const upload = multer({
    // dest: 'public/images',
    storage,
    limits: {fileSize: 1 * 1024 * 1024},//最大2M
    fileFilter: function (req, file, cb) {
        console.log(file);
        // 判断文件是否合法，合法则处理，不合法则拒绝
        if (file.mimetype === 'image/gif' ||
            file.mimetype === 'image/jpeg' ||
            file.mimetype === 'image/png') {
            // 接收文件
            cb(null, true);
        } else {
            cb(new Error('请上传图片格式'), false);
        }
    }
})

router.post('/uploadAvatar', [requireUser, upload.single('file')],
    async (req, res) => {
        if (!req.file) {
            res.sendStatus(500);
        } else {
            try {
                // 更新session数据
                req.session.user.avatar = req.file.filename;

                // 更新user表中的数据
                const result = await query(`UPDATE user SET avatar=? WHERE id=?`,
                    [req.file.filename, req.session.user.id]);
                if (result.affectedRows > 0) {
                    res.json({success: true, data: req.file.filename})
                }
            } catch (error) {

            }
        }
    }
)


// 查询用户所有课程
router.get('/my-courses', requireUser, async (req, res) => {
    try {
        const sql = `select c.id,c.name,c.phase,vc.poster from user_clazz uc
                        left join clazz c on uc.clazz_id = c.id
                        left join vip_course vc on c.course_id = vc.id
                        where user_id=?`
        const data = await query(sql, req.session.user.id);
        res.json({success: true, data})
    } catch (error) {

    }
})

router.get('/my-course/:id', requireUser, async (req, res) => {
    try {
        const sql = `select c.id,c.name,c.phase,vc.poster from user_clazz uc
                        left join clazz c on uc.clazz_id = c.id
                        left join vip_course vc on c.course_id = vc.id
                        WHERE user_id=? AND clazz_id=?`;
        const results = await query(sql,
            [req.session.user.id, req.params.id]);
        if (results.length > 0)
            res.json({success: true, data: results[0]});
        else
            res.json({success: false,
                message: '没有找到相关班级信息'});
    } catch (error) {

    }
})

// 概况
router.get('/pandect/:classId', async (req, res) => {
    try {
        const sql = `select * from pandect where user_id=? and clazz_id=?`
        const data = await query(sql, [req.session.user.id, req.params.classId]);
        if (data.length > 0)
            res.json({success: true, data: data[0]});
        else
            res.json({success: false});
    } catch (error) {

    }
})

router.get('/stages/:classId', async (req, res) => {
    try {
        const sql = `SELECT st.id,st.name,st.title,st.sub_title,s.state,s.videos
                         FROM status s
                        left join stage st on st.id=s.stage_id
                        left join clazz c on st.clazz_id=c.id
                        where user_id=? and clazz_id=?;`
        const data = await query(sql, [req.session.user.id, req.params.classId]);
        if (data.length > 0)
            res.json({success: true, data});
        else
            res.json({success: false});
    } catch (error) {

    }
})

module.exports = router;








