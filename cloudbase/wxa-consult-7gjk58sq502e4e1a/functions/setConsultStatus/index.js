// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const log = cloud.logger()

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
exports.main = async (event, context) => {
  const login = await checkOpenId()
  if (!login) {
    return {
      ret: -1,
      errmsg: '无访问权限'
    }
  }
  const {id, status} = event
  log.info(event)
  await db.collection('consult').where({
    _id: id
  })
  .update({
    data: {
      status
    }
  })
  return {
    ret: 0
  }
}