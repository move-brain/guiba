const express = require('express')
const mysql = require('mysql')
const router = express.Router()
const db = require('./share.js')
const sd = require('silly-datetime')

function in_likemes(openid, post_id, user_id) {
    post_id = Number(post_id)
    user_id = Number(user_id)
    var com_time = sd.format('YYYY-MM');
    var sqlstr = 'insert into like_mes (is_look,liker_id,tolike_id,like_time,post_id) values (?,(select id from user where openid=?),?,?,?) '
    db.query(sqlstr, [1, openid, user_id, com_time, post_id], (err, results) => {
        console.log(err);
        console.log(results);
    })
}


router.get('/wx_post/islike', (req, res) => {

    if (req.query.islike == "false") {
        // var sqlstr1 = 'insert into is_like (user_id,post_id) select ?,? from is_like where not exists (select post_id from is_like where post_id=?)'
        var sqlstr1 = 'insert into is_like (user_id,post_id) values ((select id from user where openid=?),?)'
        db.query(sqlstr1, [req.query.openid, req.query.post_id], (err, results) => {
            if (err) {
                res.sendStatus(403)
            } else {
                var sqlstr1 = 'select id from user where openid=?'
                db.query(sqlstr1, req.query.openid, (err, results) => {

                    if (results[0].id != req.query.user_id) {

                        in_likemes(req.query.openid, req.query.post_id, req.query.user_id);
                    }
                })
                res.sendStatus(200)
            }
        })
    } else {
        var sqlstr1 = 'delete from is_like where post_id=?'
        db.query(sqlstr1, req.query.post_id, (err, results) => {
            if (err) {
                res.sendStatus(403)
            } else {
                res.sendStatus(200)
            }
        })
    }

})

router.get('/wx_post/iscollect', (req, res) => {

    if (req.query.islike == "false") {
        // var sqlstr1 = 'insert into is_like (user_id,post_id) select ?,? from is_like where not exists (select post_id from is_like where post_id=?)'
        var sqlstr1 = 'insert into is_collect (user_id,post_id) values ((select id from user where openid=?),?)'
        db.query(sqlstr1, [req.query.openid, req.query.post_id], (err, results) => {
            if (err) {
                res.sendStatus(403)
            } else {
                res.sendStatus(200)
            }
        })
    } else {
        var sqlstr1 = 'delete from is_collect where post_id=?'
        db.query(sqlstr1, req.query.post_id, (err, results) => {
            if (err) {
                res.sendStatus(403)
            } else {
                res.sendStatus(200)
            }
        })
    }

})



module.exports = router