const express = require('express')
const mysql = require('mysql')

const router = express.Router()
const db = require('./share.js')
const multer = require('multer')
const path = require('path')
const sd = require('silly-datetime')
router.get('/wx_post/set_post', (req, res) => {
    // console.log(req.query);
    var select = req.query.select
    var selectarr = JSON.parse(select)
    return new Promise((resolve, reject) => {
        if (selectarr.length == 1) {
            var sqlstr1 = "insert into userselect (select_1,select_2) values (?,?)"
            db.query(sqlstr1, [selectarr[0].text, null], (err, results) => {

                resolve(results.insertId)
            })
        } else {
            var sqlstr1 = 'insert into userselect (select_1,select_2) values (?,?)'
            db.query(sqlstr1, [selectarr[0].text, selectarr[1].text], (err, results) => {

                resolve(results.insertId)

            })
        }

    }).then(e => {
        var selectid = e
        sqlstr3 = "select id from user where openid=?"
        db.query(sqlstr3, req.query.openid, (err, results) => {
                return new Promise((resolve, reject) => {
                    console.log(results);
                    var userid = results[0].id
                    resolve(userid)
                }).then(e => {
                    var post_time = sd.format('YYYY-MM')
                    sqlstr2 = /*sql*/ `insert  into posts (post_text,post_title,select_post,post_time,type,user_id) values (?,?,?,?,?,?)`
                    db.query(sqlstr2, [req.query.text, req.query.title, selectid, post_time, req.query.type, e], (err, results) => {
                        console.log(err);
                        res.send({
                            id: results.insertId
                        })
                    })
                })
            })
            //     console.log(res);
            //     sqlstr2 = "insert into posts (text,title,select,user_id) value (?,?,?,?)"
            //     db.query(sqlstr2, [req.query.text, req.query.title, res, req.query.openid], (err, results) => {
            //         console.log(err);
            //         console.log(results);
            //     })
    }).catch(err => {

        res.sendStatus(403)
    })
})

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        //保存路径
        cb(null, './post_images/images')
    },
    filename: function(req, file, cb) {
        //获取文件后缀
        var extname = path.extname(file.originalname)
            //文件名
        cb(null, Date.now() + extname)
    }
})
const upload = multer({ storage: storage })
router.post('/wx_post/uploadimages', upload.single('image'), (req, res) => {
    var path = req.file.path
    var id = req.body.id
    var host = 'https://qiuwo.xyz/'
    var imagepath = host + path
    imagepath = imagepath.replace(/\\/ig, '/')
        // var time = moment().format('YYYY-MM-DD')
    var sqlstr = 'insert into post_images (path,post_id) values (?,?)'
    return new Promise((resolve, rejects) => {
        db.query(sqlstr, [imagepath, id], (err, results) => {
            console.log(err);
            if (err) { rejects(err) } else { res.send("发布成功") }

        })
    }).catch(err => {
        res.sendStatus(403)
    })
})






router.get('/wx_post/get_allpost', (req, res) => {
    console.log(req.query.islogin);
    var posts_data = Number(req.query.posts_data)
    console.log(posts_data);
    return new Promise((resolve, reject) => {
        var allsqlstr = 'select user.*,posts.*,group_concat( distinct  post_images.path SEPARATOR ";") "images",count(DISTINCT is_like.post_id,is_like.user_id) "like_num", count(main_com.id) "main_num",count(bc.id) "br_num" from posts left outer join user on posts.user_id=user.id left outer join post_images on posts.id=post_images.post_id left outer join is_like on posts.id = is_like.post_id left outer join main_com on posts.id = main_com.post_id left outer join br_com bc on main_com.id = bc.main_id group by posts.id,is_like.user_id,is_like.post_id order by posts.post_time desc limit ?,?'
        db.query(allsqlstr, [posts_data, 5], (err, results) => {
            console.log(results);
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
            // res.send(results)
            console.log(req.query.islogin);
            if (req.query.islogin == 'true') {
                console.log("登录");
                resolve(results)
            } else {
                res.send(results)
                reject();
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

            res.send(e)
        })
    }).catch(err => {
        console.log(err);
    })
})
router.get('/wx_post/sp_posts', (req, res) => {
    var type = req.query.type
    var posts_data = Number(req.query.posts_data)
    console.log(req.query.posts_data);
    console.log(posts_data);
    return new Promise((resolve, reject) => {
        if (type == '视频') {
            var sp_sqlstr = 'select user.*,posts.*,group_concat( distinct post_images.path SEPARATOR ";") "images", count(DISTINCT is_like.post_id,is_like.user_id) "like_num", count(main_com.id) "main_num",count(bc.id) "br_num"  from posts left outer join user on posts.user_id=user.id left outer join post_images on posts.id=post_images.post_id left outer join is_like on posts.id = is_like.post_id left outer join main_com on posts.id = main_com.post_id left outer join br_com bc on main_com.id = bc.main_id where posts.type="url_videos" group by posts.id  order by posts.post_time desc limit ?,?'
            db.query(sp_sqlstr, [posts_data, 5], (err, results) => {
                if (JSON.stringify(results) == "[]") {
                    res.send({
                        id: 0
                    })
                    reject()
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

                        resolve(results)
                    } else {
                        res.send({
                            id: 1,
                            posts: results
                        })
                        reject();
                    }
                }

                // res.send(results)
            })
        } else {
            var sp_sqlstr = 'select user.*,posts.*,group_concat( distinct post_images.path SEPARATOR ";") "images", count(DISTINCT is_like.post_id,is_like.user_id) "like_num", count(main_com.id) "main_num",count(bc.id) "br_num"  from posts left outer join user on posts.user_id=user.id left outer join post_images on posts.id=post_images.post_id left outer join is_like on posts.id = is_like.post_id left outer join main_com on posts.id = main_com.post_id left outer join br_com bc on main_com.id = bc.main_id where posts.id=any(select id from userselect where select_1=? or select_2=?) group by posts.id  order by posts.post_time desc limit ?,?'
            db.query(sp_sqlstr, [type, type, posts_data, 5], (err, results) => {
                if (JSON.stringify(results) == "[]") {
                    res.send({
                        id: 0
                    })
                } else {
                    for (var i in results) {
                        results[i]["is_like"] = false
                    }
                    for (var i in results) {
                        // delete results[i].path;
                        if (results[i].images != null) {
                            var paths = results[i].images.split(";")
                            results[i]["images"] = paths
                        }
                    }
                    if (req.query.islogin == 'true') {
                        resolve(results)
                    } else {
                        res.send({
                            id: 1,
                            posts: results
                        })
                        reject();
                    }
                }
                // res.send(results)

            })
        }
    }).then(e => {
        var likesqlstr = "select distinct post_id from is_like where user_id=(select id from user where openid=?)"
        db.query(likesqlstr, req.query.openid, (err, results) => {

            if (JSON.stringify(results) != '[]') {
                for (var index in results) {
                    for (var i in e) {
                        if (results[index].post_id == e[i].id) {
                            e[i].is_like = true
                        }
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






router.get('/wx_post/look_posts', (req, res) => {
    var looksqlstr = 'select user.name,user.head, posts.*,group_concat(distinct post_images.path SEPARATOR ";") "images", count(DISTINCT is_like.post_id,is_like.user_id) "like_num",count(DISTINCT is_collect.post_id,is_collect.user_id) "collect_num"  from posts left outer join user on user.id=(select user_id from posts where id=?) left outer join post_images on post_images.post_id=? left outer join is_like on posts.id = is_like.post_id left outer join is_collect on posts.id = is_collect.post_id where posts.id=?  group by posts.id order by posts.post_time desc'
    return new Promise((resolve, reject) => {
        db.query(looksqlstr, [req.query.post_id, req.query.post_id, req.query.post_id], (err, results) => {
            if (results == []) {
                res.send('帖子已被删除')
            } else {
                if (results[0].images != null) {
                    var paths = results[0].images.split(";")
                    results[0]["images"] = paths

                }
                results[0]["is_like"] = false
                results[0]["is_collect"] = false
                if (req.query.islogin == 'true') {
                    resolve(results)
                } else {
                    res.send(results)
                    reject('未登录')
                }
            }
        })
    }).then(e => {
        return new Promise((resolve, reject) => {
            var likesqlstr = 'select * from is_like where user_id=(select id from user where openid=?) and post_id=?'
            db.query(likesqlstr, [req.query.openid, e[0].id], (err, results) => {

                console.log(results);
                if (results.length != 0) {
                    e[0].is_like = true
                    resolve(e)
                } else {
                    resolve(e)
                }

            })
        }).then(e => {
            var likesqlstr = 'select * from is_collect where user_id=(select id from user where openid=?)  and post_id=?'
            db.query(likesqlstr, [req.query.openid, e[0].id], (err, results) => {
                if (results.length != 0) {
                    e[0].is_collect = true
                    res.send(e)
                } else {
                    res.send(e)
                }
            })
        })
    }).catch(err => {
        console.log(err);
    })
})







router.get('/wx_post/collect_likeposts', (req, res) => {
    return new Promise((resolve, reject) => {
        if (req.query.type == "like") {
            var sqlstr = 'select user.*,posts.*,group_concat( distinct post_images.path SEPARATOR ";") "images", count(DISTINCT is_like.post_id,is_like.user_id) "like_num",count(main_com.id) "main_num",count(bc.id) "br_num"  from posts left outer join user on posts.user_id=user.id left outer join post_images on posts.id=post_images.post_id left outer join is_like on posts.id = is_like.post_id left outer join main_com on posts.id = main_com.post_id left outer join br_com bc on main_com.id = bc.main_id where posts.id=any (select post_id from is_like  where user_id=(select id from user where openid=?)) group by posts.id  order by posts.post_time desc'
        } else {
            var sqlstr = 'select user.*,posts.*,group_concat( distinct post_images.path SEPARATOR ";") "images", count( DISTINCT is_collect.post_id,is_collect.user_id) "collect_num",count(main_com.id) "main_num",count(bc.id) "br_num"  from posts left outer join user on posts.user_id=user.id left outer join post_images on posts.id=post_images.post_id left outer join is_collect on posts.id = is_collect.post_id left outer join main_com on posts.id = main_com.post_id left outer join br_com bc on main_com.id = bc.main_id where posts.id=any (select post_id from is_collect where user_id=(select id from user where openid=?)) group by posts.id  order by posts.post_time desc'
        }

        db.query(sqlstr, req.query.openid, (err, results) => {
            if (err) {
                reject(err)
            } else {
                if (results.length == 0) {
                    res.send({ id: 0 })
                    return 0;
                } else {
                    for (var i in results) {
                        results[i]["is_like"] = true
                        results[i]["is_collect"] = true
                    }
                    for (var i in results) {
                        // delete results[i].path;
                        if (results[i].images != null) {
                            var paths = results[i].images.split(";")
                            results[i]["images"] = paths
                        }
                    }
                    res.send({
                        id: 1,
                        posts: results
                    })

                }
            }
        })
    }).catch(err => {
        res.sendStatus(403)
    })
})

function select_posts(posts, e, i, res, openid) {
    return new Promise((resolve, reject) => {
        var sqlstr = 'select user.*,posts.*,group_concat(distinct post_images.path SEPARATOR ";") "images", count(DISTINCT is_like.post_id,is_like.user_id) "like_num",count(main_com.id) "main_num",count(bc.id) "br_num"  from user left outer join posts on posts.user_id=user.id left outer join post_images on posts.id=post_images.post_id left outer join is_like on posts.id = is_like.post_id left outer join main_com on posts.id = main_com.post_id left outer join br_com bc on main_com.id = bc.main_id  where posts.id=?  group by posts.id'
        db.query(sqlstr, e[i].id, (err, results) => {

            if (results[0].images != null) {
                var paths = results[0].images.split(";")
                results[0]["images"] = paths

            }
            results[0]["is_like"] = false

            resolve(results)

        })
    }).then(event => {
        var likesqlstr = 'select * from is_like where user_id=(select id from user where openid=?) and post_id=?'
        db.query(likesqlstr, [openid, event[0].id], (err, results) => {
            if (results.length != 0) {
                event[0].is_like = true
            }
            if (i == e.length - 1) {
                posts = posts.concat(event)
                console.log(posts);
                res.send({
                    id: 1,
                    posts
                })
            } else {
                posts = posts.concat(event)
                i++
                select_posts(posts, e, i, res, openid)
            }
        })
    })
}
router.get('/wx_post/newcom_post', (req, res) => {
    var openid = req.query.openid
    var sqlstr = 'select posts.id from posts left outer join main_com on posts.id = main_com.post_id where posts.user_id=(select id from user where openid=?) group by posts.id order by main_com.com_time desc'
    return new Promise((resolve, reject) => {
        db.query(sqlstr, openid, (err, results) => {
            if (err) {
                res.sendStatus(403)
            } else {
                if (results.length == 0) {
                    res.send({
                        id: 0
                    })
                    reject();
                } else {
                    resolve(results)
                }
            }
        })
    }).then(e => {
        var i = 0
        var posts = []
        select_posts(posts, e, i, res, openid);
    }).catch(err => {
        console.log(err);
    })
})
router.get('/wx_post/get_newposts', (req, res) => {
    var openid = req.query.openid
    return new Promise((resolve, rejects) => {

        var sqlstr = 'select user.*,posts.*,group_concat(distinct post_images.path SEPARATOR ";") "images", count(DISTINCT is_like.post_id,is_like.user_id) "like_num",count(main_com.id) "main_num",count(bc.id) "br_num"  from user left outer join posts on posts.user_id=user.id left outer join post_images on posts.id=post_images.post_id left outer join is_like on posts.id = is_like.post_id left outer join main_com on posts.id = main_com.post_id left outer join br_com bc on main_com.id = bc.main_id  where posts.user_id=(select id from user where openid=?)  group by posts.id order by posts.post_time desc'
        db.query(sqlstr, openid, (err, results) => {
            if (results.length == 0) {
                res.send({
                    id: 0
                })
                reject()
            } else {
                for (var i in results) {

                    results[i]["is_like"] = false
                        // delete results[i].path;
                    if (results[i].images != null) {
                        var paths = results[i].images.split(";")
                        results[i]["images"] = paths
                    }
                }
                resolve(results)
            }
        })
    }).then(e => {
        var likesqlstr = "select distinct post_id from is_like where user_id=(select id from user where openid=?)"
        db.query(likesqlstr, openid, (err, results) => {

            for (var index in results) {
                for (var i in e) {
                    if (results[index].post_id == e[i].id) {
                        e[i].is_like = true
                    }
                }
            }
            res.send({
                posts: e,
                id: 1
            })
        })
    })
})







router.get('/wx_post/de_post', (req, res) => {
    var sqlstr = 'delete from posts where id=?'
    db.query(sqlstr, req.query.id, (err, results) => {
        if (err) {
            results.sendStatus(403)
        } else {
            res.sendStatus(200)
        }
    })
})







module.exports = router