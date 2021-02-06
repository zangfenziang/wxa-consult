const db = wx.cloud.database()
Page({
  data: {
    id: "",
    name: "",
    result: "",
    phone: "",
    success: false
  },
  formInputChange(e) {
    const {field} = e.currentTarget.dataset;
    const {value} = e.detail;
    const o = {}
    o[field] = value
    this.setData(o)
  },
  submitForm() {
    if (this.data.id.trim() === "") {
      wx.showToast({
        title: '请输入报告编号',
        icon: 'none'
      })
      return
    }
    if (this.data.name.trim() === "") {
      wx.showToast({
        title: '请输入报告名称',
        icon: 'none'
      })
      return
    }
    if (this.data.result.trim() === "") {
      wx.showToast({
        title: '请输入报告结果',
        icon: 'none'
      })
      return
    }
    if (this.data.phone.trim() === "") {
      wx.showToast({
        title: '请输入联系方式',
        icon: 'none'
      })
      return
    }
    db.collection('consult').add({
      data: {
        rid: this.data.id.trim(),
        name: this.data.name.trim(),
        result: this.data.result.trim(),
        phone: this.data.phone.trim(),
        status: 0,
        createTime: db.serverDate()
      }
    })
    .then(res => {
      this.setData({
        success: true
      })
    })
    .catch(err => {
      console.error(err)
      wx.showToast({
        title: '提交失败',
        icon: 'none'
      })
    })
  }
})