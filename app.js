// app.js
App({
  onLaunch() {
    wx.cloud.init({
      env: "mini-voice-assistant-sfnya",
      traceUser: true
    })
  }
})
