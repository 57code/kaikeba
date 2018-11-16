const express = require('express');
const router = express.Router();
const {query} = require('../models/db');

router.get('/', async (req, res, next) => {
    res.redirect('/admin/open-courses')
});
router.get('/open-courses-update/:id', async (req, res, next) => {

    try {
        // console.log( req.params.id);
        const courses = await query(
            'select * from open_course where id=?', req.params.id);
        // console.log(courses);
        if (courses.length > 0) {
            const course = courses[0];
            course.time = course.time.toISOString().substr(0,16)
            res.render('admin/open-courses-update', {
                layout: 'layout-admin',
                nav: 'open-courses',
                course: courses[0]
            })
        } else {
            res.render('admin/result', {
                layout: 'layout-admin', // 设置布局页
                message: '查询公开课失败',
            })
        }

    } catch (error) {
        res.render('admin/result', {
            layout: 'layout-admin', // 设置布局页
            message: '查询公开课失败',
        })
    }

})
// http://localhost:3000/admin/open-courses/
router.get('/open-courses', async (req, res, next) => {

    try {
        const courses = await query('select * from open_course');
        res.render('admin/open-courses', {
            layout: 'layout-admin', // 设置布局页
            nav: 'open-courses',
            courses
        })
    } catch (error) {
        res.render('admin/result', {
            layout: 'layout-admin', // 设置布局页
            message: '查询公开课失败',
        })
    }
});

// 处理新增公开课
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) { // 存储目录
        cb(null, 'public/images');
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
    limits: {fileSize: 2 * 1024 * 1024},//最大2M
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
const {body, validationResult} = require('express-validator/check');
const validations = [
    body('name').not().isEmpty().withMessage('公开课名称必填'),
    body('description').not().isEmpty().withMessage('公开课描述信息必填'),
    body('time').not().isEmpty().withMessage('公开课描述信息必填'),
        //这里我更新后把这个约束禁了，否则影响正常更新了，如果觉得影响逻辑，可以将新增和更新拆开写
        // .isAfter(new Date().toString()).withMessage('截止日期必须晚于当前时间'),
]
const mysql = require('mysql');
router.post('/open-courses',
    [upload.single('file'), ...validations], // 同时执行多个中间件，用数组形式
    async (req, res, next) => {

        if (req.file) { // 如果用户有新的上传，覆盖旧值
            req.body.poster = req.file.filename;
        }

        // 0. 数据校验结果判断
        let errors = validationResult(req);
        // errors = errors.formatWith(({msg}) => msg);
        errors = errors.formatWith((error) => error.msg);

        if (errors.isEmpty()) { // 校验通过
            try {
                let sql, oper;
                console.log(req.body);
                // 根据数据中是否存在id判断是更新还是新增
                if (req.body.id) { // 更新
                    const id = req.body.id;
                    delete req.body.id;
                    //format生成sql语句，避免sql注入攻击
                    sql = mysql.format('UPDATE open_course SET ? WHERE id=?', [req.body, id]);
                    oper = '更新'
                } else { // 新增
                    sql = mysql.format(`INSERT INTO open_course SET ?`, req.body);
                    oper = '新增'
                }
                console.log(sql);
                // 2.保存数据到数据库
                const result = await query(sql);
                console.log(result);
                const message = result.affectedRows > 0 ? `${oper}成功` : `${oper}失败`;
                res.render('admin/result', {
                    layout: 'layout-admin', // 设置布局页
                    message
                })
            } catch (error) {
                console.log(error);
                res.render('admin/result', {
                    layout: 'layout-admin', // 设置布局页
                    message
                })
            }
        } else {
            // 验证失败
            res.render('admin/result', {
                layout: 'layout-admin', // 设置布局页
                message: '新增失败',
                errors: errors.array()
            })
        }


    });


router.get('/vip-courses', async (req, res, next) => {
    res.render('admin/vip-courses', {
        layout: 'layout-admin', // 设置布局页
        nav: 'vip-courses'
    })
});


module.exports = router;