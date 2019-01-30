const app = getApp()
Page({
    data: {
        src: "https://656c-eli-first-6de7a6-1256468192.tcb.qcloud.la/im_hungry-wallpaper-1920x1200.jpg?sign=69df45fe0dd7edee979e83ee23e385ec&t=1548659434",
        data: ""
    },
    onLoad: function (options) {
        this.onGetOpenid()
    },
    onGetOpenid: function () {
        // 调用云函数
        wx.cloud.callFunction({
            name: 'login',
            data: {},
            success: res => {
                console.log('[云函数] [login] user openid: ', res.result.openid)
                app.globalData.openid = res.result.openid
            },
            fail: err => {
                console.error('[云函数] [login] 调用失败', err)
            }
        })
    },
    bindinput(e) {
        this.setData({
            data: e.detail.value
        })
    },
    onAdd: function () {
        let date = new Date().getTime()
        const db = wx.cloud.database()
        db.collection('note').add({
            data: {
                content: this.data.data,
                date: date
            },
            success: res => {
                wx.showToast({
                    title: '新增记录成功',
                })
                this.setData({
                    data: ""
                })
                console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
            },
            fail: err => {
                wx.showToast({
                    icon: 'none',
                    title: '新增记录失败'
                })
                console.error('[数据库] [新增记录] 失败：', err)
            }
        })
    },

    
})