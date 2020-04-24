var util = require("../../../utils/util.js")
var call = require("../../../utils/request.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function(options) {
    this.getList()
  },
  // 关注列表
  getList() {
    var _this = this;
    call.getData('/app/share/appgetusergive', {
      OPENID: wx.getStorageSync('openid')
    }, function (res) {
      console.log(res);
      if (res.state == "success") {
        _this.setData({
          shopList: res.give.givelist
        })
      }
    }, function () { })
  },
  // <!-- /app/share/appgetusergive --> /app/share/appusercancelgive

 // 取消关注
 cancelgive:function(e){
   var _this = this;
   call.getData('/app/share/appusercancelgive', {
     OPENID: wx.getStorageSync('openid'),
     DB_GIVE_ID: e.currentTarget.dataset.id
   }, function (res) {
     console.log(res);
     if (res.state == "success") {
       util.showMessage("取消成功")
     }
   }, function () { })
 },
 // 进店逛逛
  gotoShop:function(e){
    wx.navigateTo({
      url: '/pages/my/follow/index?id=' + e.currentTarget.dataset.id,
    })
  }

})