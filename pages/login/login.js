// pages/login/login.js
var call = require("../../utils/request.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    userInfo: ""
  },
  onGotUserInfo: function (e) {
    this.setData({
      userInfo: e.detail.userInfo
    })
    this.login()
  },
  login() {
    var _this = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          wx.login({
            success: function (res) {
              if (res.code) {
                call.getData('/app/user/appgetopenid', {
                  code: res.code
                }, function (res) {
                  console.log(res);
                  call.getData('/app/user/appuserlogin', {
                    OPENID: res,
                    U_NICKNAME: _this.data.userInfo.nickName,
                    U_IMG: _this.data.userInfo.avatarUrl,
                    SUP_OPENID: ""
                  }, function (res) {
                    console.log(res);
                    wx.setStorageSync('openid', res)
                    wx.navigateBack({
                      delta: 1
                    });

                  }, function () {})
                }, function () {})
              } else {
                console.log('登录失败！' + res.errMsg);
              }
            }
          });


        } else {
          console.log('登录失败！' + res.errMsg);

        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})