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
exports.main = async (event, context) => {
  const login = await checkOpenId()
  if (!login) {
    return {
      ret: -1,
      errmsg: '无访问权限'
    }
  }
  const {status, limit = 20, offset = 0} = event
  let refer = db.collection('consult')
  if (typeof status !== 'undefined' && status >= 0) {
    refer = refer.where({
      status
    })
  }
  const all = await refer.count()
  refer = refer.orderBy('createTime', 'desc')
  const res = await refer.skip(offset).limit(limit).get()
  return {
    ret: 0,
    data: res.data,
    count: all.total
  }
}