Page({
  data: {
    status: false,
    loading: false,
    openid: ''
  },
  onLoad() {
    this.setData({
      loading: true
    })
    const getOpenId = () => {
      wx.cloud.callFunction({
        name: 'getOpenId',
        data: {},
        success: (res) => {
          console.log(res)
          const openid = res.result.openid || ''
          this.setData({
            openid,
            loading: false
          })
        },
        fail: (err) => {
          console.error(err)
          this.setData({
            loading: false
          })
          wx.showToast({
            title: '获取openid失败',
            icon: 'none'
          })
        }
      })
    }
    wx.cloud.callFunction({
      name: 'getAuthStatus',
      data: {},
      success: (res) => {
        console.log(res)
        const status = res.result.status || false
        this.setData({
          status
        })
        if (status) {
          wx.reLaunch({
            url: '/pages/manage/index',
          })
          return
        }
        getOpenId()
      },
      fail: (err) => {
        console.error(err)
        getOpenId()
      }
    })
  },
  copyOpenId() {
    wx.setClipboardData({
      data: this.data.openid,
    })
  }
})
