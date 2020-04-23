// pages/cart/pay-order-detail/pay-order-detail.js
var call = require("../../../utils/request.js")
var util = require("../../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderDetail: {},
    DB_ORDER_ID:'',
    goods:{},
    specif:{},
    shop:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      DB_ORDER_ID:options.id
    })
    this.getOrderDetail()
  },

  // 获取订单详情
  getOrderDetail: function() {
    var _this = this;
    call.getData('/app/order/apporderdatile', {
      DB_ORDER_ID: this.data.DB_ORDER_ID,
      OPENID: wx.getStorageSync('openid')
    }, function (res) {
      if (res.state == "success") {
        _this.setData({
          orderDetail:res.order,
          goods: res.order.shop[0].goods,
          specif: res.order.shop[0].specif,
          shop:res.order.shop[0]
        })
        // util.showMessage("兑换成功")
     
      } 

    }, function () { })
  }


})