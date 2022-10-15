const express = require('express')
const mysql = require('mysql')

const router = express.Router()
const db = require('./share.js')
const multer = require('multer')
const path = require('path')
const sd = require('silly-datetime')

function in_commes(openid, post_id, text, br_id) {
    var com_time = sd.format('YYYY-MM')
    post_id = Number(post_id)
    br_id = Number(br_id)
    var sqlstr = 'insert into com_mes (is_look,com_userid,tocom_userid,post_id,text,com_time,br_id) values (?,(select  id from user where openid=?),(select  user_id from posts where id=?),?,?,?,?)'
    db.query(sqlstr, [1, openid, post_id, post_id, text, com_time, br_id], (err, results) => {
        if (err) {
            console.log(err);
        } else {
            console.log(results);
        }
    })
}
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './post_images/com_images')
    },
    filename: function(req, file, cb) {
        var extname = path.extname(file.originalname)
        cb(null, Date.now() + extname)
    }
})
const upload = multer({ storage: storage })

router.all('/wx_post/main_com', upload.single('image'), (req, res) => {
    var com_time = sd.format('YYYY-MM')

    if (req.body) {
        var path = req.file.path
        console.log(path);
        var host = 'https://qiuwo.xyz/'
        var imagepath = host + path
        imagepath = imagepath.replace(/\\/ig, '/')

        var sqlstr = 'insert into main_com (user_id,post_id,text,com_time,image) values ((select id from user where openid=?),?,?,?,?)'
        db.query(sqlstr, [req.body.openid, req.body.post_id, req.body.text, com_time, imagepath], (err, results) => {
            return new Promise((resolve, rejects) => {

                if (err) {
                    rejects(err)
                } else {
                    var sqlstr1 = 'select id from user where openid=?'
                    db.query(sqlstr1, req.body.openid, (err, results) => {

                        if (results[0].id != req.body.user_id) {
                            var br_id = 0
                            in_commes(req.body.openid, req.body.post_id, req.body.text, br_id);
                        }
                    })
                    console.log(33);
                    res.send({
                        id: results.insertId,
                        com_time
                    })
                }
            }).catch(err => {
                res.sendStatus(403)
                console.log(err);
            })
        })
    } else {
        console.log(443);

        var sqlstr = 'insert into main_com (user_id,post_id,text,com_time) values ((select id from user where openid=?),?,?,?)'
        db.query(sqlstr, [req.query.openid, req.query.post_id, req.query.text, com_time], (err, results) => {
            return new Promise((resolve, rejects) => {
                if (err) {
                    rejects(err)
                } else {
                    var sqlstr1 = 'select id from user where openid=?'
                    db.query(sqlstr1, req.query.openid, (err, results) => {

                        if (results[0].id != req.query.user_id) {
                            var br_id = 0
                            console.log(3323333);
                            in_commes(req.query.openid, req.query.post_id, req.query.text, br_id);
                        }
                    })
                    res.send({
                        id: results.insertId,
                        com_time
                    })
                    console.log(444444);
                }
            }).catch(err => {
                console.log(err);
                res.sendStatus(403)

            })
        })

    }
})

router.get('/wx_post/br_com', (req, res) => {
    var com_time = sd.format('YYYY-MM')
    var sqlstr = 'insert into br_com (user_id,main_id,br_id,text,com_time,reply_name) values((select id from user where openid=?),?,?,?,?,?)'
    db.query(sqlstr, [req.query.openid, req.query.main_id, req.query.br_id, req.query.text, com_time, req.query.reply_name], (err, results) => {
        console.log(err);
        if (err) {
            res.sendStatus(403)
        } else {
            var sqlstr1 = 'select id from user where openid=?'
            db.query(sqlstr1, req.query.openid, (err, results) => {

                //下面记得要改如果要上线 ==改成 ！=   上面还有
                if (results[0].id != req.query.user_id) {
                    var br_id = req.query.main_id
                    console.log(req.query.post_id);
                    in_commes(req.query.openid, req.query.post_id, req.query.text, br_id);
                }
            })

            res.send(com_time)
        }

    })
})
router.get('/wx_post/get_brcom', (req, res) => {
    var sqlstr = 'select user.name,user.head,br_com.* from br_com,user where br_com.user_id=user.id and br_com.main_id=?'
    db.query(sqlstr, req.query.id, (err, results) => {
        if (err) {
            res.send(err)
        } else {
            res.send(results)
        }
    })
})

function se_br(e, i, res, br_com) {
    var sqlstr = 'select user.name,user.head,br_com.*  from br_com,user where main_id=? and user.id=br_com.user_id'

    db.query(sqlstr, e[i].id, (err, results) => {

        if (i == e.length - 1) {
            if (results.length != []) {

                br_com = br_com.concat(results)
                res.send({
                    br_com: br_com,
                    main_com: e,
                    id: 1
                })

            } else {
                res.send({
                    br_com: br_com,
                    main_com: e,
                    id: 1
                })
            }

        } else {
            if (results.length != []) {
                console.log(results);
                br_com = br_com.concat(results)
                i++;
                se_br(e, i, res, br_com)
            } else {
                i++;
                se_br(e, i, res, br_com)
            }
        }

    })


}
router.get('/wx_post/get_allcom', (req, res) => {
    return new Promise((resolve, rejects) => {
        var main_num = Number(req.query.main_num)

        if (req.query.new_com == "true") {
            var sqlstr = 'select user.name,user.head,main_com.* from main_com,user where post_id=? and main_com.user_id=user.id  limit ?,?'
        } else {
            var sqlstr = 'select user.name,user.head,main_com.* from main_com,user where post_id=? and main_com.user_id=user.id  order by main_com.com_time desc limit ?,?'
        }

        db.query(sqlstr, [req.query.post_id, main_num, 20], (err, results) => {

            if (err) {
                res.sendStatus(403)
                rejects();
            } else {
                if (JSON.stringify(results) == '[]') {
                    res.send({ id: 0 })
                } else {
                    for (var i in results) {
                        // console.log(results[i].image);
                        if (results[i].image != null) {
                            // console.log(33);
                            var paths = results[i].image.split(";")
                            console.log(paths);
                            results[i].image = paths
                        }
                    }
                    resolve(results)
                }
            }
        })
    }).then(async e => {
        var i = 0;
        var br_com = []
        se_br(e, i, res, br_com)

    })
})
router.get('/wx_post/getan_com', (req, res) => {
    var sqlstr = 'select user.name,user.head,main_com.* from main_com,user where main_com.id=? and main_com.user_id=user.id'
    db.query(sqlstr, req.query.id, (err, results) => {
        res.send(results)
    })
})
router.get('/wx_post/de_com', (req, res) => {
    console.log(req.query.id);
    var sqlstr = 'delete from main_com where id=?'
    db.query(sqlstr, req.query.id, (err, results) => {
        if (err) {
            res.sendStatus(403)
        } else {
            res.sendStatus(200)
        }
    })
})

module.exports = router