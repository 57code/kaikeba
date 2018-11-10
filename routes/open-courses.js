const express = require('express');
const router = express.Router();

// http://localhost:3000/open-courses/
router.get('/', (req, res) => {
    // 输出vip菜单
    console.log(res.locals.courses);
    res.render('open-courses', {foo:'bar'})
})


module.exports = router;