Page({
  data: {
    loading: false,
    list: [],
    offset: 0,
    limit: 20,
    status: undefined,
    count: 0,
    showActionsheet: false,
    groups: [
      { text: '未处理', value: 0 },
      { text: '已处理', value: 1 },
      { text: '全部', value: -1 }
    ]
  },
  onLoad() {
    this.getList({
      init: true,
      offset: 0,
      limit: 20,
      status: -1
    })
  },
  getList({
    init = false,
    offset,
    limit,
    status
  }) {
    this.setData({
      loading: true
    })
    wx.cloud.callFunction({
      name: 'getList',
      data: {
        offset,
        limit,
        status
      }
    })
    .then((res) => {
      const {ret, data, count} = res.result
      if (ret === -1) {
        wx.showToast({
          title: '无管理员权限',
          icon: 'none'
        })
        return
      }
      if (data) {
        this.setData({
          offset,
          limit,
          status,
          list: init ? data : [...this.data.list, ...data],
        })
        if (count) {
          this.setData({
            count
          })
        }
      }
    })
    .catch(err => {
      console.error(err)
    })
    .finally(() => {
      this.setData({
        loading: false
      })
    })
  },
  copy(e) {
    console.log(e)
    const {refer} = e.currentTarget.dataset
    wx.setClipboardData({
      data: JSON.stringify(refer, null, 2),
    })
  },
  closeConsult(e) {
    const {id, status} = e.currentTarget.dataset
    const setStatus = () => {
      wx.showLoading({
        title: '处理中',
      })
      wx.cloud.callFunction({
        name: 'setConsultStatus',
        data: {
          id,
          status: Number(status)
        }
      })
      .then(res => {
        wx.hideLoading();
        if (res.result.ret === 0) {
          wx.showToast({
            title: '处理成功',
            icon: 'success'
          })
          const list = this.data.list.map(item => {
            if (item._id === id) {
              return {
                ...item,
                status: Number(status)
              }
            }
            return item
          })
          this.setData({
            list
          })
        }
        else {
          wx.showToast({
            title: '处理失败',
            icon: 'none'
          })
        }
      })
      .catch(err => {
        console.error(err)
        wx.hideLoading()
        wx.showToast({
          title: '处理失败',
          icon: 'none'
        })
      })
    }
    wx.showModal({
      title: '确认已处理咨询',
      success: (res) => {
        if (res.confirm) {
          setStatus()
        }
      }
    })
  },
  onReachBottom() {
    if (this.data.offset + this.data.limit >= this.data.count) {
      return
    }
    this.getList({
      limit: this.data.limit,
      offset: this.data.offset + this.data.limit,
      status: this.data.status
    })
  },
  showAction() {
    this.setData({
      showActionsheet: true
    })
  },
  btnClick(e) {
    const {value} = e.detail
    this.setData({
      showActionsheet: false,
      list: []
    })
    this.getList({
      init: true,
      offset: 0,
      limit: this.data.limit,
      status: value
    })
  }
})