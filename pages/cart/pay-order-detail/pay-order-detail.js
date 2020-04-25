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
  },
  // 退款
  goAfterSale(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/my/afterSale/afterSale?id=' + id,
    })
  },
  // 评价
  evaluate(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/my/evaluate/evaluate?id=' + id,
    })
  },
  // 确认收货
  receiptHandle(e) {
    var id = e.currentTarget.dataset.id;
    var _this = this;
    wx.showModal({
      title: '提示',
      content: '是否要确认收货？',
      success(res) {
        if (res.confirm) {
          call.getData('/app/order/usereditorder', {
            DB_ORDER_ID: id
          }, function (res) {
            console.log(res);
            if (res.state == "success") {

            }
          }, function () { })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 取消订单
  cancleOrder(e) {
    console.log(e);
    var id = e.currentTarget.dataset.id;
    var _this = this;
    wx.showModal({
      title: '提示',
      content: '是否要取消订单？',
      success(res) {
        if (res.confirm) {
          _this.handleCancle(id);
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  handleCancle(id) {
    console.log(id);
    var _this = this;
    call.getData('/app/order/appDeleteOrder', {
      DB_ORDER_ID: id
    }, function (res) {
      console.log(res);
      if (res.state == "success") {
        wx.navigateBack({
          url:'/pages/my/order/order'
        })
      }
    }, function () { })
  },

  // 支付
  payOrder(e) {
    var id = e.currentTarget.dataset.id;
    var money = e.currentTarget.dataset.money;
    wx.navigateTo({
      url: '/pages/cart/pay-money/pay-money?id=' + id + '&money=' + money,
    })
  },

})