// app.js
const getrequest = require('./request.js').getrequest
const postrequest = require('./request.js').postrequest
const host = 'https://qiuwo.xyz'
App({

    userlogin: {
        islogin: false,
        openid: '',

    },
    user: {
        name: '未登录',
        headimage: "http://m.qpic.cn/psc?/V50Fs1Xr3RvV6z1kISRj26VmXM3qPEMP/ruAMsa53pVQWN7FLK88i5qXSBaCJW5fBtc8gslwiNeahMGH2zu7hRv9uPao1ynkrG7LQWAWvTDvbQBBjD4GpoWT7B8G2f3CBOPnuyvTMiFU!/b&bo=yADIAAAAAAADByI!&rf=viewer_4",
        user_id: -1
    },
    // checkSession: function() {
    //     var openid = wx.getStorageSync('openid')
    //     return new Promise((resolve, reject) => {
    //         wx.checkSession({
    //             success: (res) => {
    //                 console.log("2424");
    //                 this.userlogin.openid = openid
    //                 this.userlogin.islogin = true
    //                 resolve();
    //             },
    //             fail: (res) => {
    //                 wx.showToast({
    //                     title: '登录信息过期',
    //                     icon: 'fail',
    //                     duration: 2000
    //                 })
    //                 resolve();



    //             },

    //         })

    //     })

    // },









    onLaunch() {

        wx.getSystemInfo({
            success: e => {
                this.globalData.StatusBar = e.statusBarHeight;
                let capsule = wx.getMenuButtonBoundingClientRect();
                if (capsule) {
                    this.globalData.Custom = capsule;
                    this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
                } else {
                    this.globalData.CustomBar = e.statusBarHeight + 50;
                }
            }
        })
        var openid = wx.getStorageSync('openid')
        console.log(openid);
        if (openid) {
            wx.checkSession({
                success: (res) => {
                    getrequest(host + '/wx_post/get_user', {
                        openid
                    }).then(res => {
                        console.log(res);
                        this.user.name = res.data.name
                        this.user.headimage = res.data.head
                        this.user.user_id = res.data.user_id
                    })
                    this.userlogin.openid = openid
                    this.userlogin.islogin = true
                },


            })
        }












        // 展示本地存储能力
        const logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)

        // 登录
        wx.login({
            success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
            }
        })
    },
    globalData: {
        userInfo: null
    }
})