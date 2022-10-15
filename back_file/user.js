const express = require('express')


const router = express.Router()
const db = require('./share.js')
const multer = require('multer')
const path = require('path')
const sd = require('silly-datetime')
const sqlstr3 = 'insert into user (name,head,openid) values (?,?,?)'
const sqlstr4 = 'select user.id,user.name,user.head from user where openid=?'
router.get('/wx_post/set_user', (req, res) => {

    var openid = req.query.openid
    const sqlstr5 = 'update user set name=?,head=? where openid=?'
    return new Promise((resolve, reject) => {
        db.query(sqlstr4, openid, (err, results) => {
            if (err) return reject(console.log(err));
            if (results.length > 0) {
                console.log("sdesde");
                var name = results[0].name
                var head = results[0].head

                res.send({
                        id: 1,
                        name,
                        head
                    })
                    // db.query(sqlstr5, [name, head, openid], (err, results) => {
                    //     if (err) return reject(console.log(err))
                    //         //    console.log(results);
                    //     reject('登陆过');
                    // })

            } else {
                var name = req.query.name
                var head = req.query.headimage

                db.query(sqlstr3, [name, head, openid], (err, results) => {
                    if (err) return reject(console.log(err));
                    res.send({
                        id: 0
                    })
                    resolve(results.insertId);
                })
            }
        })
    }).catch(e => {
        res.sendStatus(403)
    })


})

const sqlstr1 = 'select name,head,id from user where openid=?'
router.get('/wx_post/get_user', (req, res) => {

    var openid = req.query.openid
    console.log(openid);
    db.query(sqlstr1, openid, (err, results) => {
        if (err) return console.log(err);
        console.log(results);
        res.send({
            name: results[0].name,
            head: results[0].head,
            user_id: results[0].id
        })
    })
})

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        //保存路径
        cb(null, './post_images/head_images')
    },
    filename: function(req, file, cb) {
        //获取文件后缀
        var extname = path.extname(file.originalname)
            //文件名
        cb(null, Date.now() + extname)
    }
})
const upload = multer({ storage: storage })
router.all('/wx_post/save_head', upload.single('image'), (req, res) => {
    if (req.body) {
        var path = req.file.path

        var host = 'https://qiuwo.xyz/'
        var imagepath = host + path
        imagepath = imagepath.replace(/\\/ig, '/')

        var name = req.body.name
        var openid = req.body.openid
        var sqlstr = 'update user set name=?,head=? where openid=?'

        db.query(sqlstr, [name, imagepath, openid], (err, results) => {
            if (err) {
                res.send(err)
            } else {
                res.send(imagepath)
            }

        })
    } else {
        var sqlstr = 'update user set name=? where openid=?'
        db.query(sqlstr, [req.query.name, req.query.openid], (err, results) => {
            if (err) {
                res.send(err)
            } else {
                res.sendStatus(200)
            }
        })
    }

})
module.exports = router