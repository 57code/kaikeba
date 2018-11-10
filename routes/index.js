var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    //渲染页面
    res.render('index', {
        title: '你好,Express',
        showVideo: false,

    });
});

module.exports = router;
