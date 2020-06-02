// pages/myAccount/myAccount.js
var getUrl = require('../../../utils/url.js')
var url = getUrl.getUrl()
var supOpenid = '' //上级openid
var PULLNUM = 0
Page({
  data: {
    iconsUrl: getUrl.iconsUrl(),
    record: [],
    refreshState: false
  },
  //提现规则
  selfSetting: function () {
    wx.navigateTo({
      url: '/pages/my/showcase/showcase?type=5'
    })
  },
  onLoad: function (options) {
    var that = this
    that.userInfo()
    that.record()
  },
  //用户信息
  userInfo: function () {
    var that = this
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        wx.request({
          url: url + '/app/user/appgetuser',
          data: {
            OPENID: res.data
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            console.log(res.data)
            if (res.data.state == 'success') {
              that.setData({
                userInfo: res.data.user
              })
            } else {
              wx.showToast({
                title: res.data.message,
                icon: 'none'
              });
            }

          }
        })
      },
    })
  },
  //消费记录
  record: function () {
    var that = this
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        wx.request({
          url: url + '/app/user/appgetuserrecord',
          data: {
            OPENID: res.data,
            PULLNUM: PULLNUM
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            console.log(res.data)
            if (res.data.state == 'success') {
              var record = that.data.record
              var newinfo = res.data.record
              if (newinfo.length > 0) {
                for (var j = 0; j < newinfo.length; j++) {
                  record.push(newinfo[j])
                }
              }
              that.setData({
                record: record
              })
            } else {
              wx.showToast({
                title: res.data.message,
                icon: 'none'
              });
            }

          }
        })
      },
    })
  },
  widthDraw: function () {
    wx.navigateTo({
      url: '../widthDraw/widthDraw',
    })
  },
  onShow: function () {
    var that = this
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1]; //当前页面
    console.log(currPage)
    if (currPage.data.refreshState == false) {
      console.log('..............')
    } else {
      PULLNUM = 0
      that.setData({
        record: [],
      })
      that.userInfo()
      that.record()
    }
  },
  onUnload: function () {
    PULLNUM = 0
  }
})