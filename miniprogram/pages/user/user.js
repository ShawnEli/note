const app = getApp()
Page({
    data: {
        result: []
    },
    onLoad: function (options) {

    },
    onShow: function () {
        this.onQuery()
    },
    onQuery: function () {
        const db = wx.cloud.database()
        db.collection('note').where({
            _openid: app.globalData.openid
        }).get({
            success: res => {
                let self = this
                res.data && res.data.forEach(item => {
                    item.date = self.dataFormat(item.date)
                })
                this.setData({
                    result: res.data
                })
                console.log('[数据库] [查询记录] 成功: ', res)
            },
            fail: err => {
                wx.showToast({
                    icon: 'none',
                    title: '查询记录失败'
                })
                console.error('[数据库] [查询记录] 失败：', err)
            }
        })
    },
    dataFormat(date){
        date = new Date(date)
        let year = date.getFullYear()
        let month = date.getMonth() + 1
        let day = date.getDate()

        return `${year}年${month}月${day}日`
    },
    delete(e){
        let self= this
        const { _id, _openid } = e.currentTarget.dataset.item
        const db = wx.cloud.database()
        wx.showModal({
            title: '警告',
            content: '是否确认删除',
            success(res){
                if(res.confirm){
                    db.collection('note').doc(_id).remove().then(
                        self.onQuery()
                    ).catch(
                        self.onQuery()
                    )
                }
            }
        })
    }
})