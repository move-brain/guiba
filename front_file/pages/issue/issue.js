const { getrequest } = require("../../request");
const host = "https://qiuwo.xyz"
    // pages/issue/issue.js
const innerAudioContext = wx.createInnerAudioContext()
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {

        modalName: "",
        select: [],
        selected: [{ text: "生活分享", image: "http://m.qpic.cn/psc?/V50Fs1Xr3RvV6z1kISRj26VmXM3qPEMP/ruAMsa53pVQWN7FLK88i5m9U*NeyP*g5d16QjXsXyoamYfsYvSfsS72UmM62vOIX2GgBunm4dp2J1z8UEMOM3gYo4jHCzRBMtZf3XQ8kjHM!/mnull&bo=yADIAAAAAAADByI!&rf=photolist&t=5", disabled: false }, { text: "校园互助", image: "http://m.qpic.cn/psc?/V50Fs1Xr3RvV6z1kISRj26VmXM3qPEMP/ruAMsa53pVQWN7FLK88i5m9U*NeyP*g5d16QjXsXyoacIJyy0FasKeVrYSjRtbuvau2coI.xuKHJ0noEGPjX6XuOA5BK.Ht.5MmGBfUp5E0!/mnull&bo=yADIAAAAAAADByI!&rf=photolist&t=5", disabled: false }, { text: "避雷专区", image: "http://m.qpic.cn/psc?/V50Fs1Xr3RvV6z1kISRj26VmXM3qPEMP/ruAMsa53pVQWN7FLK88i5jFdhCE2HDgOhDFUpPSO1iKLrJBOGfX8GhZNz.Bzh5PW75k4PROyA84U*g3SRDtSn6l*mrHO5GWrPkKMz4MArh0!/mnull&bo=5wDIAAAAAAADBw0!&rf=photolist&t=5", disabled: false }, { text: "游戏", image: "http://m.qpic.cn/psc?/V50Fs1Xr3RvV6z1kISRj26VmXM3qPEMP/ruAMsa53pVQWN7FLK88i5m9U*NeyP*g5d16QjXsXyob8WcU5bTuvIHb071VK*KQddbZLAAsOmHxfxo95rgKU4aazyXLEgLVw9mAhTx4bXwk!/mnull&bo=yADIAAAAAAADByI!&rf=photolist&t=5", disabled: false }, { text: "运动", image: "http://m.qpic.cn/psc?/V50Fs1Xr3RvV6z1kISRj26VmXM3qPEMP/ruAMsa53pVQWN7FLK88i5jFdhCE2HDgOhDFUpPSO1iK9kXtl4V9TGHtAEpFOWbt6yGSmvHfHWpKokaS*WgTJhI3E5qqyr2hNtV50hPovkJA!/mnull&bo=yADIAAAAAAADByI!&rf=photolist&t=5", disabled: false }, { text: "学习", image: "http://m.qpic.cn/psc?/V50Fs1Xr3RvV6z1kISRj26VmXM3qPEMP/ruAMsa53pVQWN7FLK88i5jFdhCE2HDgOhDFUpPSO1iLf4bfqH*OCrxWUlSHcFvsge9RxMuZQNMC3Ui2ieHV18eICv1IRvcxFD1poo5elInM!/mnull&bo=AAHIAAAAAAADB.s!&rf=photolist&t=5", disabled: false }, { text: "玩梗", image: "http://m.qpic.cn/psc?/V50Fs1Xr3RvV6z1kISRj26VmXM3qPEMP/ruAMsa53pVQWN7FLK88i5jFdhCE2HDgOhDFUpPSO1iKf3RCEmpwmf5jqZqc4p.H7othXmLn9OFLV37ygB2Oq9t8jDRNfJZB50F0ekY.z2Ww!/mnull&bo=yADIAAAAAAADByI!&rf=photolist&t=5", disabled: false }],
        title: '',
        iosDialog1: false,
        imagelist: [],
        width: 0,
        isselectimage: false,
        isselectvideo: false,
        // isselectaudio: false,
        videolist: [],
        text: "",
        index: ""
    },
    text(e) {

        this.setData({
            text: e.detail.value
        })
    },
    timer(e) {
        wx.reLaunch({
            url: '../index/index'
        })

    },

    up_images(list, i, id) {

        return new Promise((resolve, rejects) => {

            wx.uploadFile({
                filePath: list[i],
                name: 'image',
                url: host + '/wx_post/uploadimages',
                timeout: 100000,
                header: {
                    "content-type": "multipart/form-data"
                },
                formData: {
                    id,
                },
                fail: (err) => {
                    console.log(err);
                    rejects(err)
                },
                complete: (res) => {
                    console.log(res);
                    i++;

                    if (i == list.length) {
                        wx.hideToast()
                        resolve();
                        wx.showToast({
                            title: '发布成功',
                            icon: 'success'
                        })
                        setTimeout(this.timer, 1000)

                    } else {
                        this.up_images(list, i, id)
                    }
                }
            })
        }).catch(err => {
            console.log(err);
            if (err) {
                wx.showToast({
                    title: '发布失败',
                    icon: 'error'
                })

            }
        })
    },
    open(e) {
        var islogin = app.userlogin.islogin
        if (islogin) {
            console.log(e);
            var title = this.data.title
            console.log(title);
            if (title.length < 5) {
                wx.showToast({
                    title: '标题字数过少',
                    icon: 'error'
                })
                return 0;
            } else {
                var select = this.data.select
                if (select.length == 0) {
                    wx.showToast({
                        title: '请选择版块',
                        icon: 'error'
                    })
                } else {
                    var openid = wx.getStorageSync('openid')
                    console.log(openid);
                    var select = this.data.select
                    var type = 'url_image'
                    if (this.data.isselectvideo) {
                        type = 'url_videos'
                    }
                    wx.showToast({
                        title: '正在发布',
                        icon: 'loading',
                        duration: 10000
                    })
                    getrequest(host + '/wx_post/set_post', {
                        select,
                        text: this.data.text,
                        title: this.data.title,
                        type: type,
                        openid: openid
                    }).then(res => {
                        console.log(res);
                        if (res.statusCode != 200) {
                            wx.hideLoading();
                            wx.showToast({
                                title: '发布失败',
                                icon: 'error'
                            })
                            return 0;
                        } else {

                            if (this.data.isselectimage == true) {
                                var list = this.data.imagelist

                            } else {
                                var list = this.data.videolist

                            }
                            if (list.length == 0) {
                                wx.hideLoading();
                                wx.showToast({
                                    title: '发布成功',
                                    icon: 'success'
                                })
                                setTimeout(this.timer, 1000)
                                return 0;
                            } else {
                                var i = 0
                                this.up_images(list, i, res.data.id)
                            }


                        }

                    })
                }

            }
        } else {
            wx.showToast({
                title: '还未登录',
                icon: 'none'
            })
        }

    },
    checkchange(e) {
        console.log(e);
        var select = this.data.select
        select = []
        var selected = this.data.selected
        var value = e.detail.value
        var k = 0
        for (var i in selected) {
            for (var index in value) {
                if (value[index] == i) {
                    select[k] = selected[i]
                    k++;
                }
            }

        }
        this.setData({
            select
        })

        if (value.length == 2) {
            for (let index = 0; index < selected.length; index++) {
                selected[index].disabled = true
                for (var i in value) {
                    if (value[i] == index) {
                        selected[index].disabled = false
                        this.setData({
                            selected
                        })
                    }
                }
            }
            this.setData({
                selected
            })
        } else {
            for (let index = 0; index < selected.length; index++) {
                selected[index].disabled = false
            }
            this.setData({
                selected
            })
        }
    },
    headline(e) {
        this.setData({
            title: e.detail.value
        })
    },
    deleteselect(e) {
        this.setData({
            iosDialog1: true,
            index: e.currentTarget.dataset.index
        })
    },
    showModal(e) {
        this.setData({
            modalName: e.currentTarget.dataset.target
        })
    },
    hideModal(e) {
        this.setData({
            modalName: null
        })
    },
    close(e) {
        if (e.currentTarget.dataset.type == "true") {
            var select = this.data.select
            var index = this.data.index
            select.splice(index, 1)
            this.setData({
                select
            })
        }
        this.setData({
            iosDialog1: false,
        });
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
    Choosevideo() {
        wx.chooseMedia({
            camera: ['back', 'front'],
            mediaType: "video",
            success: (res) => {
                console.log(res);
                for (var i = 0; i < res.tempFiles.length; i++) {
                    this.setData({
                        videolist: this.data.videolist.concat(res.tempFiles[i].tempFilePath)
                    })
                }

            },

            complete: (com) => {
                console.log(com);
                if (com.errMsg == "chooseMedia:ok") {
                    this.setData({
                        isselectvideo: true
                    })
                }
            }
        })

    },
    ViewImage(e) {
        wx.previewImage({
            urls: this.data.imagelist,
            current: e.currentTarget.dataset.url
        });
    },
    DelImg(e) {
        wx.showModal({
            title: '召唤师',
            content: '确定要删除这段回忆吗？',
            cancelText: '再看看',
            confirmText: '再见',
            success: res => {
                console.log(res);
                if (res.confirm) {
                    this.data.imagelist.splice(e.currentTarget.dataset.index, 1);
                    if (this.data.imagelist.length == 0) {
                        this.setData({
                            isselectimage: false
                        })
                    }
                    this.setData({
                        imagelist: this.data.imagelist
                    })
                }

            }
        })
    },
    Deveo(e) {
        wx.showModal({
            title: '召唤师',
            content: '确定要删除这段回忆吗？',
            cancelText: '再看看',
            confirmText: '再见',
            success: res => {
                console.log(res);
                if (res.confirm) {
                    this.data.videolist.splice(e.currentTarget.dataset.index, 1);
                    if (this.data.videolist.length == 0) {
                        this.setData({
                            isselectvideo: false
                        })
                    }
                    this.setData({
                        videolist: this.data.videolist
                    })
                }

            }
        })
    },



    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {


        var width = this.data.width
        this.setData({
            width: wx.getSystemInfoSync().windowWidth
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