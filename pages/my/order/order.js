var call = require("../../../utils/request.js")
var util = require("../../../utils/util.js")

const app = getApp(),
  pageStart = 1; 
Page({

  data: {
    statusType: ["全部", "待付款", "待发货", "待收货", "待评价"],
    currentType: 0,
    tabClass: ["", "", "", "", ""],
    bodyHeight: null,
    requesting: false,
    endStatus: false,
    emptyShow: true,
    page: pageStart,
    listData: [],
    hasTop: true,
    enableBackToTop: true,
    refreshSize: 0,
    bottomSize: 0,
    empty: false
  }, 
  onLoad: function (options) {

  }, 
  onReady: function () {

  }, 
  onShow: function () {
    // wx.showLoading();
    // var that = this;
    // that.setData({
    //   orderList: [{}, {}]
    // });
    this.getOrderList();
  },
  statusTap: function (e) {
    var obj = e;
    var count = 0;
    for (var key in obj) {
      count++;
    }
    if (count == 0) {
      var curType = 0;
    } else {
      var curType = e.currentTarget.dataset.index;
    }
    this.data.currentType = curType
    this.setData({
      currentType: curType
    });
    this.onShow();
  }, 
  receiptHandle(e){ 
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
          }, function () {})
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
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

      }
    }, function () {})
  },
  payOrder(e) {
    var id = e.currentTarget.dataset.id;
    var money = e.currentTarget.dataset.money;
    wx.navigateTo({
      url: '/pages/cart/pay-money/pay-money?id=' + id + '&money=' + money,
    })
  },
  getStatus(value) {
    return util.getStatus(value)
  },
  getList(type, currentPage) {
    this.setData({
      requesting: true
    })
    wx.showNavigationBarLoading();
    this.getShopServiceOrder(type, currentPage);
  }, 
  refresh() {
    this.getList('refresh', pageStart);
    this.setData({
      empty: false,
      endStatus: false
    })
  }, 
  more() {
    this.getList('more', '10');
  },
  getOrderList: function (type, currentPage) {
    var _this = this;
    call.getData('/app/order/apporderdestate', {
      OPENID: wx.getStorageSync('openid'),
      O_STATE: 0,
      PULLNUM: 0
    }, function (res) {
      console.log(res);
      if (res.state == "success") {
        _this.setData({
          list: res.orderlist
        })
        console.log(_this.data);
      }
    }, function () {})
  },
  goAfterSale(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/my/afterSale/afterSale?id='+id,
    })
  }

})






 