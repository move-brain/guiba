// pages/search/search.js
const { getrequest } = require("../../request");
// 获取应用实例
const app = getApp()
const host = 'https://qiuwo.xyz'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        searchtext: "",
        searchlist: [],
        deleted: false,

    },
    delete(e) {
        this.setData({
            deleted: !this.data.deleted
        })
    },
    delete__(e) {
        console.log(e);
        var searchlist = this.data.searchlist
        var index = e.currentTarget.dataset.index
        searchlist.splice(index, 1)
        this.setData({
            searchlist
        })
        wx.setStorageSync('searchlist', searchlist)
    },
    record(e) {
        this.setData({
            searchtext: e.detail.value
        })
    },
    search(e) {
        return new Promise((resolve, reject) => {
                var searchtext = this.data.searchtext
                wx.navigateTo({
                    url: '../select/select?searchtext=' + searchtext,
                })
                var searchlist = this.data.searchlist
                var same = 0
                for (var i in searchlist) {
                    if (searchlist[i] == searchtext) {
                        same = 1;
                        break;
                    }
                }
                if (same == 0) {
                    searchlist = searchlist.concat(searchtext)
                    console.log(searchlist);
                    wx.setStorageSync('searchlist', searchlist)
                    this.setData({
                        searchlist
                    })
                }
                // getrequest(host + '/wx_post/search', {
                //         searchtext
                //     }).then(res => {
                //     })
                // for (var index in list) {
                //     var re = new RegExp(searchtext, "ig")
                //     if (re.test(list[index].text)) {
                //         console.log(index);
                //         list[index].select = true
                //         this.setData({
                //             list
                //         })
                //     }
                // }
                resolve();
            })
            // .then(res => {
            //     // wx.navigateTo({
            //     //     url: '../select/select',
            //     // })
            // })
    },
    fill_search(e) {
        console.log(e);
        var index = e.currentTarget.dataset.index
        var searchlist = this.data.searchlist
        var searchtext = this.data.searchtext
        searchtext = searchlist[index]
        this.setData({
            searchtext
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        var searchlist = wx.getStorageSync('searchlist')
        console.log(searchlist);
        if (searchlist) {
            this.setData({
                searchlist
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