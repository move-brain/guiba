// pages/select/select.js
const { getrequest } = require("../../request");
// 获取应用实例
const app = getApp()
const host = 'https://qiuwo.xyz'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        winwidth: 0,
        winheight: 0,
        imagelwh: [{}],
        videolwh: [{}],
        not_posts: false,
        posts: [],
        not_commes: false
    },
    like(e) {
        console.log(e);
        var posts = this.data.posts
        var index = e.currentTarget.dataset.index
        var islike = e.currentTarget.dataset.islike

        var openid = wx.getStorageSync('openid')
        getrequest(host + '/wx_post/islike', {
            openid,
            post_id: posts[index].id,
            user_id: posts[index].user_id,
            islike
        }).then(res => {
            console.log(res);
            if (res.statusCode == 200) {
                // posts[TabCur][index].is_like = !posts[TabCur][index].
                posts[index].is_like = !posts[index].is_like
                if (islike == 'true') {
                    posts[index].like_num--
                }
                if (islike == 'false') {
                    posts[index].like_num++
                }
                this.setData({
                    posts
                })
            }
        })
    },
    look_posts(e) {
        console.log(e);
        var id = e.currentTarget.dataset.id
        console.log(id);
        wx.navigateTo({
            url: '../posts/posts?post_id=' + id,
        })
    },
    lookimage(e) {
        var posts = this.data.posts
        var index = e.currentTarget.dataset.index
        var index_image = e.currentTarget.dataset.index_image
        if (posts[index].type == 'url_image') {
            var sources = [{
                url: posts[index].images[index_image],
                type: 'image'
            }]
        } else {
            var sources = [{
                url: posts[index].images[index_image],
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
    /**
     * 生命周期函数--监听页面加载
     */
    animage(e) {
        var index = e.currentTarget.dataset.index

        var imagelwh = this.data.imagelwh

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
        imagelwh[index] = {
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
        videolwh[index] = {
            width: viewwith,
            height: viewheight
        }
        this.setData({
            videolwh
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.setData({
            winwidth: wx.getSystemInfoSync().windowWidth,
            winheight: wx.getSystemInfoSync().windowHeight
        })
        var islogin = app.userlogin.islogin
        var searchtext = options.searchtext
        var openid = wx.getStorageSync('openid')
        getrequest(host + '/wx_post/search', {
            searchtext,
            islogin,
            openid
        }).then(res => {
            if (res.statusCode == 200) {
                if (res.data.id == 1) {
                    this.setData({
                        posts: res.data.posts
                    })
                }
            }
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})