var express = require('express');
var router = express.Router();

const users = [
    {name: 'tom', age: 20}
]

/* GET users listing. */
// /users/
router.get('/', function (req, res, next) {
    // 0.设置状态码200
    // 1.设置响应头Content-Type: application/json
    // 2.返回序列化数据JSON.stringify(obj)
    res.json(users); // 等效于res.send(users)
});

// 新增
router.post('/', function (req, res) {
//    传参方式3：body
    console.log(req.body);
    // 将传递过来用户数据添加至users
    try {
        users.push(req.body);
        res.json({success: true, users})
    } catch (e) {
        res.json({success: false})
    }
})


// 更新
router.put('/', (req, res) => {
    try {
        const index = users.findIndex(u => u.name == req.body.name)
        if (index != -1) {
            users[index] = req.body;
            res.json({success: true, users})
        }

    } catch (e) {
        res.json({success: false})
    }
})

// 删除
router.delete('/:name', (req, res) => {
    try {
        console.log(req.params.name);
        const index = users.findIndex(u => u.name == req.params.name)
        console.log(index);
        if (index != -1) {
            users.splice(index, 1);
            res.json({success: true, users})
        } else {
            res.json({success: false})
        }
    } catch (e) {
        res.json({success: false})
    }
})

// jsonp
router.get('/jsonp', (req, res) => {
    // 参数通过查询参或者url参数获取
    console.log(req.query);
    // res.jsonp(users);
    // 底层实现原理，callback是回调函数名称
    // res.send(`${req.query.callback}(${JSON.stringify(users)})`) //es6
    // res.send(req.query.callback+'('+JSON.stringify(users)+')') //es5
})


router.get('/cors', (req, res) => {
    // 添加响应头Access-Control-Allow-Origin
    // res.set('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.json(users);
})

// 预检测
// router.options('/cors', (req, res) => {
//     res.set('Access-Control-Allow-Origin', 'http://localhost:8080');
//     res.set('Access-Control-Allow-Headers', 'Content-Type');
//     res.set('Access-Control-Allow-Methods', 'GET,POST,PUT');
//     res.set('Access-Control-Allow-Credentials', 'true');
//     res.sendStatus(204);
// })

router.post('/cors', (req, res) => {
    users.push(req.body);
    // 添加响应头Access-Control-Allow-Origin
    // res.set('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.json(users);
})

router.put('/cors', (req, res) => {
    // 添加响应头Access-Control-Allow-Origin
    // res.set('Access-Control-Allow-Origin', 'http://localhost:8080');
    // res.set('Access-Control-Allow-Credentials', 'true');
    const index = users.findIndex(u => u.name == req.body.name)
    if (index != -1) {
        users[index] = req.body;
    }
    res.json(users);
})


module.exports = router;










