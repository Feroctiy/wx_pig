// pages/my/coupons/detail.js
var call = require("../../../utils/request.js")
var util = require("../../../utils/util.js")
Page({
  //   /app/integralgoods/appcoupons
  // 传：DB_COUPONS_ID：优惠券id


  /**
   * 页面的初始数据
   */
  data: {
    coupons:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    call.getData('/app/integralgoods/appcoupons', {
      DB_COUPONS_ID: options.id 
    }, function (res) {
      console.log(res);
      if (res.state == "success") {
        _this.setData({
          coupons: res.coupons
        })
      }
    }, function () {})
  },
    useCoupons:function(e){
      var _this = this;
      call.getData('/app/integralgoods/appsavecoupons', {
        DB_COUPONS_ID: this.data.coupons.DB_COUPONS_ID,
        OPENID: wx.getStorageSync('openid')
      }, function (res) {
        if (res.state == "success") {
          util.showMessage("兑换成功")
          wx.navigateTo({
            url: '/pages/my/coupons/list',
          })
        }else{
          util.showMessage("积分不足")
        }

      }, function () { })
    }
})