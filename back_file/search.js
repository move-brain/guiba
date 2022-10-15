const express = require('express')
const mysql = require('mysql')

const router = express.Router()
const db = require('./share.js')
const multer = require('multer')
const path = require('path')
const sd = require('silly-datetime')

router.get('/wx_post/search', (req, res) => {
    return new Promise((resolve, reject) => {
        var searchtext = req.query.searchtext
        var sqlstr = 'select user.*,posts.*,group_concat(post_images.path SEPARATOR ";") "images",count(DISTINCT is_like.post_id,is_like.user_id) "like_num",count(DISTINCT is_collect.post_id,is_collect.user_id) "collect_num" from posts left outer join user on posts.user_id=user.id left outer join post_images on posts.id=post_images.post_id left outer join is_like on posts.id = is_like.post_id left outer join is_collect on posts.id = is_collect.post_id where posts.post_text REGEXP ? or posts.post_title REGEXP ?  group by posts.id,is_like.user_id,is_like.post_id'
        var text = ['', ...searchtext, ''].join('.*')
        db.query(sqlstr, [text, text], (err, results) => {
            if (JSON.stringify(results) == []) {
                res.send({
                    id: 0
                })
                reject();
            } else {
                for (var i in results) {
                    results[i]["is_like"] = false
                }
                for (var i in results) {
                    // delete results[i].path;
                    if (results[i].images != null) {
                        var paths = results[i].images.split(";")
                        results[i]["images"] = paths
                            // console.log(results[0].images.split(";")[0]);
                    }
                }


                if (req.query.islogin == 'true') {
                    console.log("登录");
                    resolve(results)
                } else {
                    res.send({
                        id: 1,
                        posts: results
                    })
                    reject();
                }

            }
        })
    }).then(e => {
        var likesqlstr = "select distinct post_id from is_like where user_id=(select id from user where openid=?)"
        db.query(likesqlstr, req.query.openid, (err, results) => {

            for (var index in results) {
                for (var i in e) {
                    if (results[index].post_id == e[i].id) {
                        e[i].is_like = true
                    }
                }
            }

            res.send({
                id: 1,
                posts: e
            })
        })
    }).catch(err => {
        console.log(err);
    })


})

















































module.exports = router