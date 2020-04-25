var call = require("../../../utils/request.js")
var util = require("../../../utils/util.js")

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    couponslist:[],
    goods: [],
    statusType: ["优惠卷", "积分商品"],
    currentType: 0,
    tabClass: ["", ""],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      currentType: options.type
    })
    this.appcouponslist();
    this.appAllgoodslist();
  },

  statusTap: function (e) {
    this.setData({
      list: []
    })
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
    this.appcouponslist(this.data.currentType);
  },

  appcouponslist() {
    var _this = this;
    call.getData('/app/integralgoods/appcouponslist', {
      DB_STORE_ID: wx.getStorageSync('DB_STORE_ID'),
      PULLNUM: '0'
    }, function (res) {
      console.log(res);
      if (res.state == "success") {
        _this.setData({
          couponslist: res.coupons
        })
      }
    }, function () {})
  },
  // 积分商品
  appAllgoodslist: function () {
    var _this = this;
    call.getData('/app/integralgoods/appAllgoodslist', {
      DB_STORE_ID: wx.getStorageSync('DB_STORE_ID'),
      PULLNUM: '0'
    }, function (res) {
      console.log(res);
      if (res.state == "success") {
        _this.setData({
          goods: res.goods
        })
      }
    }, function () { })
  },
  goCouDetail(e) {
    wx.navigateTo({
      url: '/pages/my/coupons/detail?id=' + e.currentTarget.dataset.id
    })
  },
  goDetail(e) {
    wx.navigateTo({
      url: '/pages/goods/detail/detail?id=' + e.currentTarget.dataset.id
    })
  },

})