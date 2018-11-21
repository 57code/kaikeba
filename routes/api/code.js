const express = require('express');
const router = express.Router();

const moment = require('moment');//生成时间戳使用
const md5 = require('md5');//生成时间戳使用
const axios = require('axios');//发送http请求
const qs = require('querystring');//参数编码
const {query} = require('../../models/db');

router.get('/:phone', async (req, res) => {
    // 1.生成6位随机数字验证码
    const code = ran() + ran() + ran() + ran() + ran() + ran();
    console.log(code);

    // 2.调用秒滴接口，提前构造参数
    const url = 'https://api.miaodiyun.com/20150822/industrySMS/sendSMS';
    const to = req.params.phone; // 发送目标手机号
    const accountSid = '3324eab4c1cd456e8cc7246176def24f';// 账号id
    const authToken = 'b1c4983e2d8e45b9806aeb0a634d79b1';// 令牌
    const templateid = '613227680'; // 短信模板id
    const param = `${code},1`; // 短信参数
    const now = moment();
    const timestamp = now.format('YYYYMMDDHHmmss');
    const sig = md5(accountSid + authToken + timestamp); // 签名

    // 3.发送请求
    try {
        const resp = await axios.post(url,
            qs.stringify({to, accountSid, templateid, param, timestamp, sig}),
            {headers:{'Content-Type': 'application/x-www-form-urlencoded'}}
        );

        console.log(resp.data);
        // 4.验证发送结果
        if (resp.data.respCode === '00000') {
            // 短信发送成功
            // 5.存储验证码和有效期
            const expires = moment().add(1, 'minutes').toDate();
            const result = await query(
                'INSERT INTO verify_code SET ?',
                {phone: to, code, expires}
            );
            if (result.affectedRows > 0) {
                // 插入成功
                res.json({success: true, code});// code仅开发阶段使用
            } else {
                res.json({success: false, message: '发送验证码失败'})
            }
        } else {
            res.json({success: false, message: '发送验证码失败'})
        }
    } catch (error) {
        console.log(error);
        res.json({success: false, message: '发送验证码失败'})
    }
})

function ran() {
    return Math.floor(Math.random() * 10).toString();
}


// 验证码校验
router.post('/', async (req, res) => {
    try {
        const sql = `SELECT * FROM verify_code
                     WHERE phone=? AND code=?`;
        // const {phone, code} = req.body;
        const phone = req.body.phone;
        const code = req.body.code;
        const results = await query(sql, [phone, code]);
        if (results.length > 0) {
            // 存在匹配项，验证是否过期
            const {expires} = results[0];
            if (expires - new Date() > 0) { //有效
                res.json({success: true});
            } else {
                res.json({success: false, message: '验证码已失效'});
            }
            // 删除记录
        } else {
            res.json({success: false, message: '手机号或验证码输入有误'});
        }
    } catch (error) {
        res.json({success: false, message: '服务器错误，请稍后重试！'});
    }
})



module.exports = router;















