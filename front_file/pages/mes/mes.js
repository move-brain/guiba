// pages/mes/mes.js
const { getrequest } = require("../../request");
const host = "https://qiuwo.xyz"
Page({

    /**
     * 页面的初始数据
     */
    data: {
        TabCur: 0,
        scrollLeft: 0,
        com_mes: [],
        not_com: false,
        not_like: false,
        like_ed: false,
        like_mes: []
    },
    tabSelect(e) {
        this.setData({
            TabCur: e.currentTarget.dataset.id,
            scrollLeft: (e.currentTarget.dataset.id - 1) * 60
        })
        var like_ed = this.data.like_ed
        if (!like_ed) {
            var openid = wx.getStorageSync('openid')
            getrequest(host + '/wx_post/get_mes', {
                openid,
                type: "like"
            }).then(res => {
                if (res.statusCode == 200) {
                    if (res.data.id == 1) {
                        this.setData({
                            like_mes: res.data.like_mes,
                            like_ed: true
                        })
                    } else {
                        this.setData({
                            not_like: true
                        })
                    }
                }
            })
        }

    },
    com_mes(e) {
        var index = e.currentTarget.dataset.index
        var com_mes = this.data.com_mes
        var openid = wx.getStorageSync('openid')
        if (com_mes[index].br_id > 0) {
            getrequest(host + '/wx_post/getan_com', {
                id: com_mes[index].br_id
            }).then(res => {
                console.log(res);
                var com = res.data[0]
                com = JSON.stringify(com)
                console.log(com);
                wx.navigateTo({
                    url: '../br_com/br_com?com=' + encodeURIComponent(com),
                })
            })
        } else {
            var id = com_mes[index].post_id
            wx.navigateTo({
                url: '../posts/posts?post_id=' + id,
            })
        }
    },
    like_mes(e) {
        var index = e.currentTarget.dataset.index
        var like_mes = this.data.like_mes
        var id = like_mes[index].post_id
        wx.navigateTo({
            url: '../posts/posts?post_id=' + id,
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        var openid = wx.getStorageSync('openid')

        getrequest(host + '/wx_post/get_mes', {
            type: "com",
            openid
        }).then(res => {
            console.log(res);
            if (res.statusCode = 200) {
                if (res.data.id == 1) {
                    this.setData({
                        com_mes: res.data.com_mes
                    })
                } else {
                    this.setData({
                        not_com: true
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

        var TabCur = this.data.TabCur
        var openid = wx.getStorageSync('openid')
        if (TabCur == 1) {

            getrequest(host + '/wx_post/get_mes', {
                openid,
                type: "like"
            }).then(res => {
                console.log("hhh");
                if (res.statusCode == 200) {
                    if (res.data.id == 1) {
                        this.setData({
                            like_mes: res.data.like_mes,
                            not_like: false
                        })
                    } else {
                        this.setData({
                            not_like: true
                        })
                    }
                }
                wx.stopPullDownRefresh()
            })
        } else {
            getrequest(host + '/wx_post/get_mes', {
                type: "com",
                openid
            }).then(res => {
                console.log(res);
                if (res.statusCode = 200) {
                    if (res.data.id == 1) {
                        this.setData({
                            com_mes: res.data.com_mes,
                            not_com: false
                        })
                    } else {
                        this.setData({
                            not_com: true
                        })
                    }
                }
                wx.stopPullDownRefresh()
            })
        }
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