const express = require('express')
const axios = require('axios')
const router = express.Router()
router.get('/wx_post/newuser', (req, res) => {
    var code = req.query.code
    console.log(code);
    var url = 'https://api.weixin.qq.com/sns/jscode2session?appid=wx42259cf059366ca8&secret=a802616a36cd480928d253390cbaf1bc&' + 'js_code=' + code + '&grant_type=authorization_code'
    console.log(`${url}`);
    axios.get(`${url}`).then(e => {
        res.send({
            session: e.data
        })
    })
})
module.exports = router