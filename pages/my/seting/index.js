var call = require("../../../utils/request.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    key:"",
    mobile:"",
    userInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    _this.getUserInfo();
    wx.login({
      success(res) {
        if (res.code) {
          call.getData('/app/user/appgetkey', {
            code: res.code
          }, function (res) { 
            _this.setData({key:res})
          }, function () {})
        }
      }
    })
  },
  onGetPhoneNumber(e) {
    var _this = this;
    console.log(e.detail.errMsg == "getPhoneNumber:ok");
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      call.getData('/app/user/decrypt', {
        keyStr: _this.data.key,
        ivStr:e.detail.iv,
        encDataStr:e.detail.encryptedData
      }, function (res) {  
        _this.bindPhone(res.phoneNumber)
      }, function () {})
    }
  },
  bindPhone(phone){
    var _this = this;
    call.getData('/app/user/appuserbindphone', {
      PHONE: phone,
      OPENID: wx.getStorageSync('openid')
    }, function (res) {
      console.log(res);
      if (res.state == "success") { 
        wx.showToast({ title: "绑定成功", icon: 'none', duration: 2000, success:function(){
          setTimeout(function () {
             _this.getUserInfo();
          }, 1000)
        }});
      } 
    }, function () {})
  },
  getUserInfo() {
    var _this = this;
    call.getData('/app/user/appgetuser', {
      OPENID: wx.getStorageSync('openid')
    }, function (res) {
      if (res.state == "success") {
        _this.setData({
          userInfo: res.user,
          mobile: res.user.U_PHONE ? res.user.U_PHONE.slice(0,3) + '****' + res.user.U_PHONE.slice(7):""
        })
      }
    }, function () {})
  },
})