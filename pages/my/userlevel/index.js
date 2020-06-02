var call = require("../../../utils/request.js");
var getUrl = require('../../../utils/url.js')
Page({
  data: {
    imageUrl: getUrl.imageUrl(),
    userInfo:{},
    num:'10',
    perfect:"",
    phone:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.appGetSetUp();

  },
  onShow: function () {
    if (wx.getStorageSync('openid')) {
      this.setData({
        openid: wx.getStorageSync('openid')
      })
      this.getUserInfo();
    }
  },
  // 获取用户信息
  getUserInfo() {
    var _this = this;
    call.getData('/app/user/appgetuser', {
      OPENID: wx.getStorageSync('openid')
    }, function (res) {
      if (res.state == "success") {
        var num = ( res.user.U_ACTIVE/(res.user.U_ACTIVE+parseFloat(res.user.growth))).toFixed(2)*100;
        console.log(num);
        _this.setData({ 
          userInfo: res.user ,
          num: num
        })
      }
    }, function () {})
  },
  goPerfectInfo(){
    wx.navigateTo({
      url: '/pages/my/info/info',
    })
  },
  bindPhone(){
    wx.navigateTo({
      url: '/pages/my/seting/index',
    })
  },
  goDes(){
    wx.navigateTo({
      url: '/pages/my/userlevel/des',
    })
  },

  goList(){
    wx.navigateTo({
      url: '/pages/my/userlevel/list',
    })
  },
  goindex(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  // app/user/appGetSetUp
  appGetSetUp(){
    var _this = this;
    call.getData('/app/user/appGetSetUp', {
      OPENID: wx.getStorageSync('openid')
    }, function (res) {
      console.log(res)
      if (res.state == "success") {
        _this.setData({
          perfect:res.perfect.SE_VALUE,
          phone:res.phone.SE_VALUE
        })
      }
    }, function () {})
  }
})