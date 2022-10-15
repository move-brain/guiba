var app = getApp()

const getquest = require('../../request.js').getrequest
const host = 'https://qiuwo.xyz'
const { postrequest } = require('../../request')
    // pages/mod_my/mod_my.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        openid: '',
        handle: ["操作", "拍摄", "相册"],
        name: '',
        head: "",
        modalName: '',
        se_image: false
    },
    save(e) {

        wx.showLoading({
            title: '正在保存',
        })
        var openid = wx.getStorageSync('openid')
        var se_image = this.data.se_image
        if (se_image) {
            wx.uploadFile({
                filePath: this.data.head,
                name: 'image',
                url: host + '/wx_post/save_head',
                timeout: 10000,
                header: {
                    "content-type": "multipart/form-data"
                },
                formData: {
                    openid,
                    name: this.data.name
                },
                fail: err => {
                    console.log(err);
                },
                complete: res => {
                    if (res.errMsg == 'uploadFile:fail timeout') {
                        wx.hideLoading();
                        wx.showToast({
                            title: '请检查网络问题',
                            icon: 'error'
                        })
                    }
                    if (res.statusCode == 200) {
                        console.log(res);
                        wx.hideLoading();
                        wx.setStorageSync('headimage', res.data)
                        wx.setStorageSync('name', this.data.name)
                        wx.showToast({
                            title: '保存成功',
                            icon: 'success'
                        })
                    }
                }
            })
        } else {
            console.log(33);
            getquest(host + '/wx_post/save_head', {
                openid,
                name: this.data.name
            }).then(res => {
                if (res.statusCode == 200) {
                    wx.hideLoading();
                    wx.setStorageSync('name', this.data.name)
                    wx.showToast({
                        title: '保存成功',
                        icon: 'success'
                    })
                }
            })
        }



    },




    head_(e) {
        wx.chooseMedia({
            mediaType: ['image'],
            count: 1,
            success: (res) => {
                this.setData({
                    head: res.tempFiles[0].tempFilePath,
                    se_image: true
                })

            },
        })
    },

    name_(e) {
        this.setData({
            name: e.detail.value
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        var openid = wx.getStorageSync('openid')
        getquest(host + '/wx_post/get_user', {
            openid
        }).then(res => {
            if (res.statusCode == 200) {
                var head = this.data.head
                var name = this.data.name
                this.setData({
                    head: res.data.head,
                    name: res.data.name
                })
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