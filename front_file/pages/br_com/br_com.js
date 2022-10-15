const { getrequest } = require("../../request");
const host = "https://qiuwo.xyz"
const { time } = require("../../request")
    // pages/br_com/br_com.js
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imagelwh: {},
        com: {},
        br_com: [],
        keyboard_hei: false,
        text: '',
        br_id: 0,
        reply_name: ''
    },
    main_image(e) {
        console.log(e);
        var index = e.currentTarget.dataset.index

        var imagelwh = this.data.imagelwh

        var viewwith = wx.getSystemInfoSync().windowWidth / 2
        var hei_with = e.detail.height / e.detail.width
        var viewheight = hei_with * viewwith

        imagelwh = {
            width: viewwith,
            height: viewheight
        }
        this.setData({
            imagelwh
        })
    },
    issue_br(e) {
        var islogin = app.userlogin.islogin
        if (islogin) {
            var openid = wx.getStorageSync('openid')
            var head = wx.getStorageSync('headimage')
            var name = wx.getStorageSync('name')
            var main_id = this.data.com.id
            var br_id = this.data.br_id
            var text = this.data.text
            var reply_name = this.data.reply_name
            var com = this.data.com

            wx.showLoading({
                title: '正在发表',
            })
            console.log(main_id);
            getrequest(host + '/wx_post/br_com', {
                openid,
                main_id,
                br_id,
                text,
                reply_name,
                post_id: com.post_id
            }).then(res => {
                console.log(res);
                var com_time = time(res.data.com_time)
                if (res.statusCode == 200) {
                    wx.hideLoading()
                    var newbr_com = {
                        main_id,
                        br_id,
                        name,
                        head,
                        text,
                        com_time,
                        reply_name
                    }
                    var br_com = this.data.br_com
                    br_com.unshift(newbr_com)
                    console.log(br_com);

                    this.setData({
                        br_com,
                        text: ''
                    })
                    var pages = getCurrentPages();
                    var prevPage = pages[pages.length - 2];
                    var br_com = prevPage.data.br_com
                    br_com.unshift(newbr_com)
                    prevPage.setData({
                        br_com
                    })
                } else {
                    wx.showToast({
                        title: '请重试',
                        icon: "error"
                    })
                }
            })
        } else {
            wx.showToast({
                title: '您还未登录',
                icon: 'none'
            })
        }
    },
    br_text(e) {
        this.setData({
            text: e.detail.value
        })
    },

    focus(e) {
        this.setData({
            keyboard_hei: true
        })
    },
    blur(e) {

        this.setData({
            keyboard_hei: false
        })
    },
    is_reply(e) {
        console.log(e);
        if (e.currentTarget.dataset.is_master == "true") {
            var name = this.data.com.name
            this.setData({
                br_id: 0,
                reply_name: name,
            })
        } else {
            var index = e.currentTarget.dataset.index
            var is_master = e.currentTarget.dataset.is_master
            var br_com = this.data.br_com
            this.setData({
                reply_name: br_com[index].name,
                br_id: br_com[index].id
            })
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

        var com = decodeURIComponent((options.com))
        console.log(com);
        com = JSON.parse(com)
        console.log(com);
        console.log(options);
        this.setData({
            com,
            reply_name: com.name
        })
        getrequest(host + '/wx_post/get_brcom', {
            id: com.id
        }).then(res => {
            console.log(res);
            console.log(44444444444);
            var br_com = this.data.br_com
            br_com = res.data
            for (var i in br_com) {
                br_com[i].com_time = time(br_com[i].com_time)
            }
            this.setData({
                br_com: res.data
            })
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