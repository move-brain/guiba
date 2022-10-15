const express = require('express')
const router = express.Router()
const db = require('./share.js')
const sd = require('silly-datetime')
router.get('/wx_post/mes_num', (req, res) => {
    // var sqlstr = 'select sum(mes_num) "num" from (select COUNT(*) as mes_num from like_mes where tolike_id=(select id from user where openid=? ) and is_look=? union all (select COUNT(*) as mes_num from com_mes where tocom_userid=(select id from user where openid=? ) and is_look=?) ) as mes'
    var sqlstr = 'select COUNT(*) mes from like_mes where tolike_id=1 and is_look=1 union all select  COUNT(*) mes from com_mes where tocom_userid=1 and is_look=1'
    db.query(sqlstr, [req.query.openid, 1, 1, req.query.openid], (err, results) => {
        if (err) {
            res.sendStatus(403)
            console.log(err);
        } else {

            var mes_num = results[0].mes + results[1].mes
            console.log(results);
            res.send({ mes_num: mes_num })

        }
    })
})

function up_look(type, list) {
    if (type == "com") {
        for (var i in list) {
            var sqlstr1 = 'update com_mes set is_look=0 where id=?'
            db.query(sqlstr1, list[i].id, (err, results) => {})
        }
    } else {
        for (var i in list) {
            var sqlstr1 = 'update like_mes set is_look=0 where id=?'
            db.query(sqlstr1, list[i].id, (err, results) => {})
        }
    }
}

router.get('/wx_post/get_mes', (req, res) => {
    if (req.query.type == "com") {
        var sqlstr = 'select user.name,user.head,com_mes.*,posts.post_title from user,com_mes,posts where com_mes.com_userid=user.id and tocom_userid=(select id from user where openid=?) and posts.id=com_mes.post_id order by com_mes.com_time desc'
        db.query(sqlstr, [req.query.openid], (err, results) => {
            if (err) {
                res.sendStatus(403)
            } else {
                console.log(typeof(results));
                if (JSON.stringify(results) == "[]") {
                    res.send({ id: 0 })
                    console.log(results);
                    console.log(33);

                } else {
                    up_look(req.query.type, results);
                    res.send({
                        id: 1,
                        com_mes: results
                    })
                }
            }
        })
    } else {
        var sqlstr = 'select user.name,user.head,like_mes.*,posts.post_title from user,like_mes,posts where like_mes.liker_id=user.id and tolike_id=(select id from user where openid=?) and posts.id=like_mes.post_id order by like_mes.like_time desc'
        db.query(sqlstr, [req.query.openid], (err, results) => {
            if (err) {
                res.sendStatus(403)
            } else {
                console.log(typeof(results));
                if (JSON.stringify(results) == "[]") {
                    res.send({ id: 0 })
                    console.log(results);
                    console.log(33);

                } else {
                    up_look(req.query.type, results);
                    res.send({
                        id: 1,
                        like_mes: results
                    })
                }
            }
        })
    }
})




module.exports = router