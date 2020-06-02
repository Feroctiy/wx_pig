var getUrl = require('../../../utils/url.js')
var url = getUrl.getUrl()
var supOpenid = '' //上级openid
var PULLNUM = 0
Page({
  data: {
    state:false,
    dataList:[]
  },
  onLoad: function(options) {
    var that = this
    that.userInfo()
    that.offlineNum()
    that.userList() 
  },
  //用户信息
  userInfo: function() {
    var that = this
    wx.getStorage({
      key: 'openid',
      success: function(res) {
        wx.request({
          url: url + '/app/user/appgetuser',
          data: {
            OPENID: res.data
          },
          header: {
            'content-type': 'application/json'
          },
          success: function(res) { 
            if (res.data.state == 'success') {
              that.setData({ userInfo: res.data.user })
            } else {
              wx.showToast({ title: res.data.message, icon: 'none' });
            }
          }
        })
      },
    })
  },
  //人数
  offlineNum: function() {
    var that = this
    wx.getStorage({
      key: 'openid',
      success: function(res) {
        wx.request({
          url: url + '/app/user/appgetofflinenum',
          data: {
            OPENID: res.data
          },
          header: {
            'content-type': 'application/json'
          },
          success: function(res) { 
            if (res.data.state == 'success') {
              that.setData({
                directly: res.data.directly,
                indirect: res.data.indirect
              })
            } else {
              wx.showToast({ title: res.data.message, icon: 'none' });
            }

          },
          fail: function() {}
        })
      },
    })
  },
  userList:function(){
    var that = this
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        wx.request({
          url: url + '/app/user/appgetoffline',
          data: {
            OPENID: res.data,
            PULLNUM:PULLNUM
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            console.log(res.data)
            if (res.data.state == 'success') {
              var dataList = that.data.dataList
              var newinfo = res.data.userlist
              if (newinfo.length > 0) {
                for (var j = 0; j < newinfo.length; j++) {
                  dataList.push(newinfo[j])
                }
              }
              that.setData({ dataList: dataList })
              if(res.data.userlist < 10){
                that.setData({ state: true })
              }
            } else {
              wx.showToast({
                title: res.data.message,
                icon: 'none'
              });
            }
          },
        })
      },
    })
  },
  myAccount: function() {
    wx.navigateTo({
      url: '../myAccount/myAccount',
    })
  },
  onPullDownRefresh: function () {
    var that = this
    PULLNUM = 0
    wx.showNavigationBarLoading()
    setTimeout(() => {
      that.setData({ dataList: [] })
      that.userList() 
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
    }, 500)
  },
  onReachBottom: function () {
    var that = this
    if(that.data.state){
      return;
    }
    PULLNUM = PULLNUM + 1
    setTimeout(() => { that.userList() }, 500)
  }
})