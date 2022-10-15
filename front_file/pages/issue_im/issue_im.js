// pages/issue_im/issue_im.js
const host = "https://qiuwo.xyz"
var { postrequest } = require('../../request')
var { getrequest } = require('../../request')
const { time } = require("../../request")
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imagelist: [],
        isselectimage: false,
        imageslwh: {},
        text: '',
        post_id: 0,
        user_id: 0
    },
    text(e) {
        console.log(e);
        this.setData({
            text: e.detail.value
        })
    },
    open(e) {
        var islogin = app.userlogin.islogin
        if (islogin) {
            console.log(e);
            var imagelist = this.data.imagelist
            var text = this.data.text
            var post_id = this.data.post_id
            var user_id = this.data.user_id
            var openid = wx.getStorageSync('openid')
            if (imagelist.length == 0) {
                getrequest(host + '/wx_post/main_com', {
                    post_id,
                    openid,
                    text,
                    user_id
                }).then(res => {
                    if (res.statusCode == 200) {
                        console.log(res);
                        var pages = getCurrentPages();
                        var prevPage = pages[pages.length - 2];
                        console.log(prevPage.data.main_com);
                        var name = wx.getStorageSync('name')
                        var head = wx.getStorageSync('headimage')
                        var id = res.data.id
                        var com_time = res.data.com_time
                        com_time = time(com_time)
                        var com = {
                            id,
                            com_time,
                            head,
                            image: imagelist,
                            name,
                            post_id,
                            text,
                            user_id
                        }
                        var main_com = prevPage.data.main_com
                        main_com.unshift(com)
                        var br_com = prevPage.data.br_com
                        prevPage.setData({ // 将我们想要传递的参数在这里直接setData。上个页面就会执行这里的操作。
                            main_com,
                            br_com
                        })
                        wx.navigateBack({
                            delta: 1 // 返回上一级页面。
                        })
                    } else(
                        wx.showToast({
                            title: '请重试',
                            icon: 'error'
                        })
                    )
                })
            } else {
                wx.uploadFile({
                    filePath: imagelist[0],
                    name: 'image',
                    url: host + '/wx_post/main_com',
                    timeout: 100000,
                    header: {
                        "content-type": "multipart/form-data"
                    },
                    formData: {
                        text,
                        openid,
                        post_id,
                        user_id
                    },

                    complete: (res) => {
                        console.log(res);
                        if (res.statusCode == 200) {
                            console.log(res);
                            var pages = getCurrentPages();
                            var prevPage = pages[pages.length - 2];
                            console.log(prevPage.data.main_com);
                            var name = wx.getStorageSync('name')
                            var head = wx.getStorageSync('headimage')
                            var id = res.data.id
                            var com_time = res.data.com_time
                            com_time = time(com_time)
                            var com = {
                                id,
                                com_time,
                                head,
                                image: imagelist,
                                name,
                                post_id,
                                text,
                                user_id
                            }
                            var main_com = prevPage.data.main_com
                            main_com.unshift(com)
                            var br_com = prevPage.data.br_com

                            prevPage.setData({ // 将我们想要传递的参数在这里直接setData。上个页面就会执行这里的操作。
                                main_com,
                                br_com
                            })
                            wx.navigateBack({
                                delta: 1 // 返回上一级页面。
                            })
                        } else {
                            wx.showToast({
                                title: '请重试',
                                icon: 'error'
                            })
                        }
                    }
                })
            }
        } else {
            wx.showToast({
                title: '您还未登录',
                icon: 'none'
            })
        }



    },





    com_image(e) {
        console.log(e);
        var imagewith = wx.getSystemInfoSync().windowWidth / 2
        var hei_wid = e.detail.height / e.detail.width
        var imageheight = hei_wid * imagewith
        var index = e.currentTarget.dataset.index
        var imageslwh = this.data.imageslwh
        imageslwh = {
            imageheight,
            imagewith
        }
        this.setData({
            imageslwh
        })
    },
    ChooseImage() {
        wx.chooseMedia({
            camera: ['back', 'front'],
            mediaType: "image",
            success: (res) => {
                console.log(res);
                for (var i = 0; i < res.tempFiles.length; i++) {
                    this.setData({
                        imagelist: this.data.imagelist.concat(res.tempFiles[i].tempFilePath)
                    })
                }
            },
            complete: (com) => {
                if (com.errMsg == "chooseMedia:ok") {
                    this.setData({
                        isselectimage: true
                    })
                }
            }
        })
    },
    ViewImage(e) {

        wx.previewImage({

            urls: this.data.imagelist
        });
    },
    DelImg(e) {
        wx.showModal({
            title: '尊敬的吧主',
            content: '确定要删除这张照片吗？',
            cancelText: '再看看吧',
            confirmText: '拜拜',
            success: res => {
                if (res.confirm) {

                    this.setData({
                        imagelist: [],
                        isselectimage: false
                    })
                }
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        console.log(options);
        var name = options.name

        var post_id = options.post
        var user_id = options.user_id
        this.setData({
            post_id,
            user_id,
            name
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