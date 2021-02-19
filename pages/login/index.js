Page({
  onLoad() {
    wx.showLoading({
      title: '加载中',
    })
    const goConsult = () => {
      wx.reLaunch({
        url: '/pages/consult/index',
      })
    }
    const goManager = () => {
      wx.reLaunch({
        url: '/pages/manage/index',
      })
    }
    wx.cloud.callFunction({
      name: 'getAuthStatus',
      data: {},
      success: (res) => {
        wx.hideLoading()
        console.log(res)
        const status = res.result.status || false
        if (status) goManager()
        else goConsult()
      },
      fail: (err) => {
        wx.hideLoading()
        console.error(err)
        goConsult()
      }
    })
  }
})