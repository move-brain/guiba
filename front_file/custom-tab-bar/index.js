var app = getApp()


const host = 'https://qiuwo.xyz'

// custom-tab-bar/index.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {

    },

    /**
     * 组件的初始数据
     */
    data: {
        my: "my",
        myfill: "myfill",
        home: "home",
        homefill: "homefill",
        select: 0,
        mes_num: 0
    },

    /**
     * 组件的方法列表
     */
    methods: {
        select(e) {
            wx.switchTab({
                url: e.currentTarget.dataset.url,
            })
        },
        selected(e) {
            wx.navigateTo({
                url: e.currentTarget.dataset.url,
            })
        }
    },
})