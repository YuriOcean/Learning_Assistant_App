
Page({
    // 页面的初始数据
    data: {
        userInfo: {
            nickName: 'q'
        },
    },
    login() {
        wx.navigateTo({
            url: '/pages/login/login',
        })
    },
    //退出登录
    tuichu() {
        this.setData({
            userInfo: null,
        })
        wx.setStorageSync('user2', null)
    },
    // 修改个人资料
    goChange() {
        wx.navigateTo({
            url: '/pages/change/change',
        })
    },
    onShow() {
        var user = wx.getStorageSync('user2')
        console.log('me---', user)
        if (user && user.name) {
            this.setData({
                userInfo: user,
            })
        }
    },
})