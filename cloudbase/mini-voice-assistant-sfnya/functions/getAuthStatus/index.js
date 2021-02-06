// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

function checkOpenId() {
  const wxContext = cloud.getWXContext()
  return new Promise((resolve, reject) => {
    db.collection('manager').where({
      _openid: wxContext.OPENID
    })
    .get()
    .then(res => {
      resolve(res.data.length > 0)
    })
    .catch(err => {
      reject(err)
    })
  })
}

// 云函数入口函数
exports.main = async () => {
  const canLogin = await checkOpenId()
  return {
    status: canLogin
  }
}