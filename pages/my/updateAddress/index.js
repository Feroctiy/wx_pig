var call = require("../../../utils/request.js")
var util = require("../../../utils/util.js")

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addId:''
  },

  onLoad: function (options) {
    this.setData({
      DB_ORDER_ID: options.id
    })
    this.getOrderDetail()
  },
  onShow(){
    if (this.data.addId) {
      this.getAdd();
       
    } 
  },
  getAdd: function () {
    var that = this;
    call.getData('/app/address/appshowoneadd', {
      DB_ADDRESS_ID: that.data.addId
    }, function (res) {
      console.log(res);
      if (res.state == "success") {
        that.setData({
          address: res.address
        });
      }
      console.log(res);
    }, function () {})
  },

  // 获取订单详情
  getOrderDetail: function () {
    var _this = this;
    call.getData('/app/order/apporderdatile', {
      DB_ORDER_ID: this.data.DB_ORDER_ID,
      OPENID: wx.getStorageSync('openid')
    }, function (res) {
      if (res.state == "success") {
        _this.setData({
          orderDetail: res.order,
          addId:res.order.O_ADD_ID
        })
        _this.getAdd();
      }

    }, function () {})
  },
  selectAddress: function () {
    wx.navigateTo({
      url: "/pages/address/list/index?back=1"
    })
  },
  // /app/order/appEditOrderAdd

  handle(){
    var that = this;
    call.getData('/app/order/appEditOrderAdd', {
      DB_ADDRESS_ID: that.data.addId,
      DB_ORDER_ID:that.data.DB_ORDER_ID
    }, function (res) {
      console.log(res);
      if (res.state == "success") {
        util.showMessage("修改成功");
        wx.navigateBack({
          delta: 1,
        })
      }
      console.log(res);
    }, function () {})
  },
  canle(){
    wx.navigateBack({
      delta: 1,
    })
  }
})