// pages/my/rechargecard/index.js
var call = require("../../../utils/request.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  onLoad: function (options) {

  },
  formsubmit(e) {
    console.log(e.detail.value);
    var _this = this;
    call.getData('/app/buyorder/appgetSavings', {
      SA_ORDER: e.detail.value.SA_ORDER,
      SA_PASSWORD: e.detail.value.SA_PASSWORD
    }, function (res) {
      if (res.status == "success") {
        _this.appSavingsExchange(res.savings.DB_SAVINGS_ID)
      }else{
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 2000
        });
      }
      console.log(res);
    }, function () {})
  },
  // /app/buyorder/appSavingsExchange
  appSavingsExchange(id) {
    var _this = this;
    call.getData('/app/buyorder/appSavingsExchange', {
      DB_SAVINGS_ID: id,
      OPENID: wx.getStorageSync('openid')
    }, function (res) {
      if (res.status == "success") {
        wx.showToast({
          title: "卡充值成功",
          icon: 'none',
          duration: 2000,
          success: function () {
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              })
            }, 1000)

          }
        });
      }
      console.log(res);
    }, function () {})
  }
})