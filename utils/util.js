const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const isEmpty = value =>{
  if (typeof value === 'undefined' || value == null) {
    return true
  }
  if (value instanceof Array) {
    return value.length == 0
  }
  if (value instanceof Object) {
    for (var attr in value) {
      return false
    }
  }
  if (value instanceof String || typeof value === 'string') {
    return value === ''
  }
  return false
}

const showMessage = value =>{
  wx.showToast({
    title:value,
    icon: 'none',
    duration: 1500
  })
}
const getStatus = value => {
  if (!value) return
  var _txt = ''
  switch (value) {
    case '1':
      _txt = '待支付'
      break
    case '2':
      _txt = '待发货'
      break
    case '3':
      _txt = '待取货'
      break
    case '4':
      _txt = '已完成'
      break
  }
  return _txt
}

module.exports = {
  formatTime: formatTime,
  getStatus: getStatus,
  isEmpty: isEmpty,
  showMessage: showMessage
}