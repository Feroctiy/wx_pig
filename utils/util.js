const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  //return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  return [year, month, day].map(formatNumber).join('-')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
//获取后几天日期
function GetAfterDate(AddDayCount) {
  var date = new Date();
  date.setDate(date.getDate() + AddDayCount); //获取AddDayCount天后的日期 
  var year = date.getFullYear();
  var month = date.getMonth() + 1; //获取当前月份的日期 
  var day = date.getDate();
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  var x = date.getDay();
  // var stringTime = [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  var stringTime = [year, month, day].map(formatNumber).join('-')
  // var str = {
  //   "timestamp": stringTime,
  //   "date": month + '.' + day,
  //   "week": '周' + '日一二三四五六'.charAt(date.getDay())
  // }
  return stringTime;
}

function timeFormat(param) { //小于10的格式化函数
  return param < 10 ? '0' + param : param;
}
/* 格式化倒计时 */
function fromatCountdown(total_second) {
  var that = this
  let countDownArr = [];
  var obj;
  // console.log(total_second)
  if (total_second > 0) {
    var day = parseInt(total_second / 1000 / 60 / 60 / 24);
    var hour = parseInt(total_second / 1000 / 60 / 60 % 24);
    var minute = parseInt(total_second / 1000 / 60 % 60);
    var seconds = parseInt(total_second / 1000 % 60);
    day = timeFormat(day)
    hour = timeFormat(hour)
    minute = timeFormat(minute)
    seconds = timeFormat(seconds)
    obj = {
      day: day,
      hou: hour,
      min: minute,
      sec: seconds,
      state: 0
    }
  } else {
    obj = {
      day: '00',
      hou: '00',
      min: '00',
      sec: '00',
      state: 1
    }
  }

  return obj;
  // return hour + " : " + minute + " : " + seconds;
}
const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  //return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  return formatNumber(year) + formatNumber(month) + formatNumber(day)
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
  showMessage: showMessage, 
  GetAfterDate: GetAfterDate,
  fromatCountdown: fromatCountdown,
  formatDate: formatDate

}