// pages/my/my.js
var app = getApp()

const getquest = require('../../request.js').getrequest
const host = 'https://qiuwo.xyz'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        headimage: "http://m.qpic.cn/psc?/V50Fs1Xr3RvV6z1kISRj26VmXM3qPEMP/ruAMsa53pVQWN7FLK88i5qXSBaCJW5fBtc8gslwiNeahMGH2zu7hRv9uPao1ynkrG7LQWAWvTDvbQBBjD4GpoWT7B8G2f3CBOPnuyvTMiFU!/b&bo=yADIAAAAAAADByI!&rf=viewer_4",
        name: "未登录",
        mes_num: 0,
        islogin: false
    },
    like_collect(e) {
        var islogin = this.data.islogin
        if (islogin) {
            console.log(e);
            var type = e.currentTarget.dataset.type
            wx.navigateTo({
                url: '../like_collect/like_collect?type=' + type,
            })
        } else {
            wx.showToast({
                title: '您还未登录',
                icon: 'none'
            })
        }
    },
    my_post(e) {
        if (this.data.islogin) {
            wx.navigateTo({
                url: '../my_post/my_post',
            })
        } else {
            wx.showToast({
                title: '您还未登录',
                icon: 'none'
            })
        }
    },
    mod_my(e) {
        if (this.data.islogin) {
            wx.navigateTo({
                url: '../mod_my/mod_my',
            })
        } else {
            wx.showToast({
                title: '您还未登录',
                icon: 'none'
            })
        }
    },
    isnologin(res) {
        return new Promise((resolve, reject) => {
            var name = this.data.name
            var headimage = this.data.headimage
            if (app.userlogin.islogin) {
                wx.previewImage({
                    urls: [headimage],
                    current: headimage
                })
            } else {
                wx.getUserProfile({
                    desc: '获取你的信息用于登录',
                    success: (res) => {
                        wx.showLoading({
                            title: '正在登陆',
                        })
                        name = res.userInfo.nickName
                        headimage = res.userInfo.avatarUrl
                        wx.setStorageSync('name', name)
                        wx.setStorageSync('headimage', headimage)

                        wx.login({
                            timeout: 2000,
                        }).then(res => {
                            getquest(host + '/wx_post/newuser', {
                                code: res.code
                            }).then(res => {

                                app.userlogin.islogin = true
                                var openid = res.data.session.openid

                                wx.setStorageSync('openid', openid)
                                getquest(host + '/wx_post/set_user', {
                                    openid,
                                    name,
                                    headimage
                                }).then(res => {
                                    console.log(res);
                                    wx.hideLoading()
                                    this.setData({
                                        name,
                                        headimage
                                    })
                                    wx.reLaunch({
                                        url: '../index/index',
                                    })
                                })
                            })
                        })
                    },
                    fail: (res) => {
                        return console.log(res);
                    }
                })

            }


        })

    },
    get_mes: function(res) {
        var openid = wx.getStorageSync('openid')

        getquest(host + '/wx_post/mes_num', {
            openid
        }).then(res => {

            if (res.statusCode == 200) {
                this.setData({
                    mes_num: res.data.mes_num
                })
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        var openid = wx.getStorageSync('openid')
        console.log(openid);
        if (openid) {
            console.log(888);
            wx.checkSession({
                success: (res) => {
                    this.setData({
                        islogin: true
                    })
                    getquest(host + '/wx_post/get_user', {
                            openid
                        }).then(res => {
                            this.setData({
                                    headimage: res.data.head,
                                    name: res.data.name
                                })
                                // console.log(res);
                                // this.user.name = res.data.name
                                // this.user.headimage = res.data.head
                        })
                        // this.userlogin.openid = openid
                        // this.userlogin.islogin = true
                    getquest(host + '/wx_post/mes_num', {
                        openid
                    }).then(res => {
                        console.log(res);
                        if (res.statusCode == 200) {
                            console.log(res);
                            this.setData({
                                mes_num: res.data.mes_num
                            })
                            setInterval(this.get_mes, 3000)
                        }
                    })
                },
                fail: (res) => {
                    wx.showToast({
                        title: '登录信息过期',
                        icon: 'fail',
                        duration: 2000
                    })
                },
            })
        }
    },
    mes(e) {
        if (this.data.islogin) {
            wx.navigateTo({
                url: '../mes/mes',
            })
        } else {
            wx.showToast({
                title: '您还未登录',
                icon: 'none'
            })
        }
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        if (typeof this.getTabBar === 'function' &&
            this.getTabBar()) {
            this.getTabBar().setData({
                select: 1
            })
        }
        var openid = wx.getStorageSync('openid')
        var islogin = this.data.islogin
        if (islogin) {
            getquest(host + '/wx_post/get_user', {
                openid
            }).then(res => {
                this.setData({
                        headimage: res.data.head,
                        name: res.data.name
                    })
                    // console.log(res);
                    // this.user.name = res.data.name
                    // this.user.headimage = res.data.head
            })
        }
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