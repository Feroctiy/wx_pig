var app = getApp()
var call = require("../../../utils/request.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    payType: '1'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      money: options.money,
      O_PLAY_Z_ID: options.O_PLAY_Z_ID,
      id: options.id
    })
  },
  // 确认支付
  confirm: function () {
    var _this = this;
    if (_this.data.payType == '1') {
      if (_this.data.O_PLAY_Z_ID) {
        call.getData('/app/order/wxgroupxiadan', {
          OPENID: wx.getStorageSync('openid'),
          O_PLAY_Z_ID: _this.data.O_PLAY_Z_ID
        }, function (res) {
          console.log(res.prepay_id) // 
          _this.appwxrepeatsign(res.prepay_id)
        }, function () {})
      } else {
        call.getData('/app/order/wxxiadan', {
          OPENID: wx.getStorageSync('openid'),
          DB_ORDER_ID: _this.data.id
        }, function (res) {
          console.log(res.prepay_id) // 
          _this.appwxrepeatsign(res.prepay_id)
        }, function () {})
      }
    } else if (_this.data.payType == '2') {
      call.getData('/app/order/userBalancePay', {
        OPENID: wx.getStorageSync('openid'),
        O_PLAY_Z_ID: _this.data.O_PLAY_Z_ID
      }, function (res) {
        console.log(res);
        if (res.state == "success") {
          wx.navigateTo({
            url: '/pages/cart/pay-success/pay-success',
          })
        }


      }, function () {})
    }





  },
  // 支付类型的选择 1 微信 2 余额支付
  radiochange(e) {
    this.setData({
      payType: e.detail.value
    })
  },
  // /app/wxpay/appwxrepeatsign
  appwxrepeatsign(prepay_id) {
    var _this = this;
    call.getData('/app/wxpay/appwxrepeatsign', {
      prepay_id: prepay_id,
    }, function (res) {
      console.log(res)
      wx.requestPayment({
        timeStamp: res.timeStamp,
        nonceStr: res.nonceStr,
        package: res.package,
        signType: 'MD5',
        paySign: res.paySign,
        success(res) {
          wx.navigateTo({
            url: '/pages/cart/pay-success/pay-success',
          })
        },
        fail(res) {}
      })
    }, function () {})
  }
})