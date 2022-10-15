// index.js



const { time } = require("../../request")
const { getrequest } = require("../../request");
// 获取应用实例
const app = getApp()
const host = 'https://qiuwo.xyz'
Page({

    data: {
        imagelwh: [{}],
        videolwh: [{}],
        isadd: false,
        winwidth: 0,
        posts: [],
        list: [{ text: "最新" }, { text: "视频" }, { text: "校园互助" }, { text: "避雷专区" }, { text: "游戏" }, { text: "运动" }, { text: "玩梗" }],
        TabCur: 0,
        scrollLeft: 0,
        color: "#fff",
        with: 0,
        height: 0,
        videolist: [],
        winheight: 0,
        se_tabcur: [],
        showsearch: true,
        posts_data: []
    },
    lookimage(e) {
        var posts = this.data.posts
        var TabCur = this.data.TabCur
        var index = e.currentTarget.dataset.index
        var index_image = e.currentTarget.dataset.index_image
        if (posts[TabCur][index].type == 'url_image') {
            var sources = [{
                url: posts[TabCur][index].images[index_image],
                type: 'image'
            }]
        } else {
            var sources = [{
                url: posts[TabCur][index].images[index_image],
                type: 'video'
            }]
        }

        wx.previewMedia({
            sources: sources,
            success(e) {
                console.log(e);
            }
        })
    },



    animage(e) {
        var index = e.currentTarget.dataset.index
        var imagelwh = this.data.imagelwh
        var TabCur = this.data.TabCur
        var viewwith = wx.getSystemInfoSync().windowWidth / 2
        if (e.detail.height < e.detail.width) {
            var viewheight = wx.getSystemInfoSync().windowHeight / 4

        } else {
            if (e.detail.height > e.detail.width) {
                var viewheight = wx.getSystemInfoSync().windowHeight / 2.5

            } else {
                var viewheight = viewwith
            }
        }
        imagelwh[TabCur][index] = {
            width: viewwith,
            height: viewheight
        }
        this.setData({
            imagelwh
        })

    },

    anvideo(e) {


        var videolwh = this.data.videolwh

        var index = e.currentTarget.dataset.index
        var TabCur = this.data.TabCur
        if (e.detail.height < e.detail.width) {
            var viewwith = "100%"
            var viewheight = wx.getSystemInfoSync().windowHeight / 3
        } else {
            if (e.detail.height > e.detail.width) {
                var viewwith = "50%"
                var viewheight = wx.getSystemInfoSync().windowHeight / 2.5
            } else {
                var viewheight = viewwith
            }
        }
        videolwh[TabCur][index] = {
            width: viewwith,
            height: viewheight
        }
        this.setData({
            videolwh
        })
    },
    search(e) {
        wx.navigateTo({
            url: '../search/search',
        })
    },
    tabSelect(e) {
        this.setData({
            TabCur: e.currentTarget.dataset.id,
            scrollLeft: (e.currentTarget.dataset.id - 1) * 60
        })

    },
    hdsearch(e) {
        var showsearch = this.data.showsearch
        if (e.detail.scrollTop > 100) {
            this.setData({
                showsearch: false
            })
        } else {
            this.setData({
                showsearch: true
            })
        }
    },
    tapChange(e) {

        this.setData({
            TabCur: e.detail.current,
            scrollLeft: (e.detail.current - 1) * 60
        })
        var posts = this.data.posts
        var TabCur = this.data.TabCur

        var islogin = app.userlogin.islogin
        var openid = app.userlogin.openid
        return new Promise((resolve, rejects) => {
            if (TabCur > 0) {
                if (posts[TabCur] == null) {
                    wx.showLoading({
                        title: '客官稍等',
                    })
                    var list = this.data.list
                    if (TabCur == 1) {
                        var type = '视频'
                    } else {
                        var type = list[TabCur].text
                    }
                    var posts_data = this.data.posts_data
                    posts_data[TabCur] = posts_data[TabCur]
                    getrequest(host + '/wx_post/sp_posts', {
                        type,
                        islogin,
                        openid,
                        posts_data: posts_data[TabCur]
                    }).then(res => {
                        if (res.data.id == 1) {
                            posts[TabCur] = res.data.posts
                            var se_tabcur = this.data.se_tabcur
                            se_tabcur[TabCur] = true
                            this.setData({
                                posts_data,
                                se_tabcur,
                                posts
                            })
                        }
                        wx.hideLoading()
                    })
                }
            }

        })
    },
    look_posts(e) {
        console.log(e);
        var id = e.currentTarget.dataset.id
        var user_id = e.currentTarget.dataset.user_id
        console.log(id);
        wx.navigateTo({
            url: '../posts/posts?post_id=' + id + '&&user_id=' + user_id,
        })
    },
    like(e) {
        var posts = this.data.posts
        var index = e.currentTarget.dataset.index
        var islike = e.currentTarget.dataset.islike
        var TabCur = this.data.TabCur
        var openid = wx.getStorageSync('openid')
        var islogin = app.userlogin.islogin
        if (islogin) {
            getrequest(host + '/wx_post/islike', {
                openid,
                post_id: posts[TabCur][index].id,
                user_id: posts[TabCur][index].user_id,
                islike
            }).then(res => {
                console.log(res);
                if (res.statusCode == 200) {
                    for (var i in posts) {
                        if (posts[i] != null) {
                            for (var k in posts[i]) {
                                if (posts[i][k].id == posts[TabCur][index].id) {
                                    posts[i][k].is_like = !posts[i][k].is_like
                                    if (islike == 'true') {
                                        posts[i][k].like_num--
                                    } else {
                                        posts[i][k].like_num++
                                    }
                                }

                            }
                        }
                    }
                    this.setData({
                        posts
                    })
                }
            })
        } else {
            wx.showToast({
                title: '请前往我的页面登录',
                icon: 'none'
            })
        }
    },
    de_post(e) {
        var posts = this.data.posts
        console.log(e);
        var index = e.currentTarget.dataset.index
        var TabCur = this.data.TabCur
        posts[TabCur].splice(index, 1)
        console.log(posts);
        this.setData({
            posts: posts
        })
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function(e) {
        if (typeof this.getTabBar === 'function' &&
            this.getTabBar()) {
            this.getTabBar().setData({
                select: 0
            })
        }
    },
    onLoad: function(e) {
        var posts = this.data.posts
        var videolwh = this.data.videolwh
        var imagelwh = this.data.imagelwh
        posts[7] = {}
        console.log(app.userlogin.islogin);
        var posts_data = this.data.posts_data
        for (var i = 0; i < 8; i++) {
            videolwh[i] = []
            imagelwh[i] = []
            posts_data[i] = 0
        }
        this.setData({
            posts,
            videolwh
        })
        console.log(e);
        return new Promise((resolve, rejects) => {
            this.setData({
                winwidth: wx.getSystemInfoSync().windowWidth,
                winheight: wx.getSystemInfoSync().windowHeight
            })
            var openid = wx.getStorageSync('openid')
            console.log(openid);
            var posts_data = this.data.posts_data
            if (openid == '') {
                console.log(openid);
                getrequest(host + '/wx_post/get_allpost', {
                    islogin: false,
                    posts_data: posts_data[0]
                }).then(res => {
                    console.log(res);
                    if (res.statusCode == 200) {
                        var posts = this.data.posts
                        posts[0] = res.data
                        this.setData({
                            posts
                        })
                    } else { console.log(res) }
                })
            } else {
                console.log("cwcwc");
                wx.checkSession({
                    success: (res) => {
                        console.log(88888);
                        getrequest(host + '/wx_post/get_allpost', {
                            openid,
                            islogin: true,
                            posts_data: posts_data[0]
                        }).then(res => {
                            console.log(res);
                            if (res.statusCode == 200) {
                                var posts = this.data.posts
                                posts[0] = res.data
                                this.setData({
                                    posts
                                })
                            } else { console.log(res) }
                        })
                    },
                    fail: (err) => {
                        getrequest(host + '/wx_post/get_allpost', {
                            islogin: false,
                            posts_data: posts_data[0]
                        }).then(res => {
                            if (res.statusCode == 200) {
                                var posts = this.data.posts
                                posts[0] = res.data
                                this.setData({
                                    posts
                                })
                            } else { console.log(res) }
                        })
                    }
                })
            }
            // getrequest(host + '/wx_post/get_allpost').then(res => {
            //     if (res.statusCode == 200) {
            //         this.setData({
            //             issue: res.data
            //         })
            //     } else { console.log(res) }
            // })
        })
    },
    onReachBottom() {
        console.log(1);
        var TabCur = this.data.TabCur
        var islogin = app.userlogin.islogin
        var posts_data = this.data.posts_data
        var posts = this.data.posts
        var openid = wx.getStorageSync('openid')

        if (TabCur == 0) {
            posts_data[0] = Number(posts_data[0] + 20)
            console.log(posts_data[0]);
            getrequest(host + '/wx_post/get_allpost', {
                islogin,
                posts_data: posts_data[0]
            }).then(res => {
                if (res.statusCode == 200) {
                    if (res.data.id == 1) {
                        var posts = this.data.posts
                        posts[0] = posts[0].concat(res.data)
                        this.setData({
                            posts,
                            posts_data
                        })
                    }
                }

            })
        } else {
            var list = this.data.list
            posts_data[TabCur] = Number(posts_data[TabCur] + 20)
            console.log(posts_data[TabCur]);
            if (TabCur == 1) {
                var type = '视频'
            } else {
                var type = list[TabCur].text
            }
            getrequest(host + '/wx_post/sp_posts', {
                type,
                islogin,
                openid,
                posts_data: posts_data[TabCur]
            }).then(res => {
                if (res.data.id == 1) {
                    posts[TabCur] = posts[TabCur].concat(res.data)
                    this.setData({
                        posts,
                        posts_data
                    })
                }

            })

        }
    },
    onPullDownRefresh: function() {
        this.onLoad()
    },
})