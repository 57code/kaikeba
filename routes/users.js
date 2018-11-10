var express = require('express');
var router = express.Router();

/* GET users listing. */
// /users/
router.get('/', function (req, res, next) {
    res.render('user');
});

router.post('/', function (req, res, next) {
//    传参方式3：body
    console.log(req.body);

    res.send('服务器接收到你传递数据了！')
})

module.exports = router;
