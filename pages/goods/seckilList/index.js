var getUrl = require('../../../utils/url.js')
var url = getUrl.getUrl()
var PULLNUM = 0
//距开始时间 
var startSecond = []
//距结束时间
var endSecond = []
var timeOut
var supOpenid = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.proList();
  },
  proList: function () {
    var that = this
    wx.request({
      url: url + '/app/goods/appgetseckillist',
      data: {
        PULLNUM: PULLNUM,
        DB_STORE_ID: wx.getStorageSync('DB_STORE_ID')
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.state == 'success') {
          var dataList = that.data.dataList
          var newinfo = res.data.goods
          if (newinfo.length > 0) {
            for (var j = 0; j < newinfo.length; j++) {
              dataList.push(newinfo[j])
            }
          }
          that.setData({
            dataList: dataList
          })
          if (dataList.length > 0) {
            for (var i = 0; i < dataList.length; i++) {
              //CO_TYPE 商品类型  2：限时秒杀
              //秒杀商品
              if (dataList[i].G_TYPE == 2) {
                var strStart = {
                  'time': dataList[i].STARTDATE,
                  'G_TYPE': dataList[i].G_TYPE,
                  'timeState': 0
                }
                startSecond.push(strStart)
                var strEnd = {
                  'time': dataList[i].ENDDATE,
                  'G_TYPE': dataList[i].G_TYPE,
                  'timeState': 1
                }
                endSecond.push(strEnd)
              }
            }
            that.setData({ startSecond: startSecond, endSecond: endSecond })
            console.log('startSecond', that.data.startSecond)
            console.log('endSecond', that.data.endSecond)
            //开始时间
            that.countdownStart()
            //结束时间
            that.countdownEnd()
          }
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          });
        }

      }
    })
  },
  //商品详情
  proDetails: function (e) {
    if (!wx.getStorageSync('openid')) {
      wx.navigateTo({
        url: '/pages/login/login',
        url: `/pages/login/login?from=${this.route}&tab=true`,
      })
      return;
    }
    wx.navigateTo({
      url: '/pages/goods/detail/detail?id=' + e.currentTarget.dataset.id
    })
  },
  onHide: function () {
    clearTimeout(timeOut)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    PULLNUM = 0
    this.setData({
      dataList: []
    })
    startSecond = []
    //距结束时间
    endSecond = []
    clearTimeout(timeOut)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this
    PULLNUM = 0
    wx.showNavigationBarLoading()
    setTimeout(() => {
      that.setData({
        dataList: []
      })

      that.proList()

      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
    }, 500)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
    PULLNUM = PULLNUM + 1
    setTimeout(() => {
      that.proList()
    }, 500)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  timeFormat(param) { //小于10的格式化函数
    return param < 10 ? '0' + param : param;
  },
  countdownStart: function () {
    var that = this
    let nowTime = new Date().getTime();
    let timeList = that.data.startSecond;
    // console.log('startSecond', timeList)
    var totaltime = 0;
    let countDownArr = [];
    timeList.forEach(o => {
      let endTime = new Date(o.time.replace(/-/g, '/')).getTime();
      // console.log('endTime', endTime)
      let obj = null;
      let totalSeconds = (endTime - nowTime) / 1000;
      totaltime = totalSeconds
      // console.log(totalSeconds)
      // 如果活动未结束，对时间进行处理
      if (totalSeconds > 0) {
        // 获取天、时、分、秒
        let day = parseInt(totalSeconds / (60 * 60 * 24));
        let hou = parseInt(totalSeconds % (60 * 60 * 24) / 3600);
        let min = parseInt(totalSeconds % (60 * 60 * 24) % 3600 / 60);
        let sec = parseInt(totalSeconds % (60 * 60 * 24) % 3600 % 60);
        obj = {
          day: that.timeFormat(day),
          hou: that.timeFormat(hou),
          min: that.timeFormat(min),
          sec: that.timeFormat(sec),
          state: 0,
          CO_TYPE: o.CO_TYPE
        }
      } else { //活动已结束，全部设置为'00'
        obj = {
          day: '00',
          hou: '00',
          min: '00',
          sec: '00',
          state: 1,
          CO_TYPE: o.CO_TYPE
        }
      }
      countDownArr.push(obj);
    })
    // 渲染，然后每隔一秒执行一次倒计时函数
    that.setData({
      countDownList: countDownArr
    })
    // console.log('countDownList', that.data.countDownList)
    timeOut = setTimeout(function () {
      that.countdownStart();
    }, 1000)

  },
  countdownEnd: function () {
    var that = this
    let nowTime = new Date().getTime();
    let timeList = that.data.endSecond;
    console.log('endSecond', timeList)
    var totaltime = 0;
    let countDownArr = [];
    timeList.forEach(o => {
      let endTime = new Date(o.time.replace(/-/g, '/')).getTime();
      let obj = null;
      let totalSeconds = (endTime - nowTime) / 1000;
      totaltime = totalSeconds
      console.log(totalSeconds)
      // 如果活动未结束，对时间进行处理
      if (totalSeconds > 0) {
        // 获取天、时、分、秒
        let day = parseInt(totalSeconds / (60 * 60 * 24));
        let hou = parseInt(totalSeconds % (60 * 60 * 24) / 3600);
        let min = parseInt(totalSeconds % (60 * 60 * 24) % 3600 / 60);
        let sec = parseInt(totalSeconds % (60 * 60 * 24) % 3600 % 60);
        obj = {
          day: that.timeFormat(day),
          hou: that.timeFormat(hou),
          min: that.timeFormat(min),
          sec: that.timeFormat(sec),
          state: 0,
          G_TYPE: o.G_TYPE
        }
      } else { //活动已结束，全部设置为'00'
        obj = {
          day: '00',
          hou: '00',
          min: '00',
          sec: '00',
          state: 1,
          G_TYPE: o.G_TYPE
        }
        that.setData({
          buyState: 1
        })
      }
      countDownArr.push(obj);
    })
    // 渲染，然后每隔一秒执行一次倒计时函数
    that.setData({
      endCountDownList: countDownArr
    })
    // console.log('endCountDownList', that.data.endCountDownList)
    timeOut = setTimeout(function () {
      that.countdownEnd();
    }, 1000)
  }
})