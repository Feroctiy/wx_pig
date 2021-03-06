// pages/my/integral/index.js
var call = require("../../../utils/request.js")
var util = require("../../../utils/util.js")
var getUrl = require('../../../utils/url.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods: [],
    imageUrl: getUrl.imageUrl()
    
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      num: options.num
    })
    this.appAllgoodslist();
    this.appcouponslist();
  },

  onShow() {
    this.getUserInfo();
  },
  getUserInfo() {
    var _this = this;
    call.getData('/app/user/appgetuser', {
      OPENID: wx.getStorageSync('openid')
    }, function (res) {
      if (res.state == "success") {
        _this.setData({
          userInfo: res.user
        })
      }
      console.log(res);
    }, function () {})
  },
  // /app/integralgoods/appAllgoodslist
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
    }, function () {})
  },
  goDetail(e) {
    wx.navigateTo({
      url: '/pages/goods/detail/detail?id=' + e.currentTarget.dataset.id
    })
  },
  goCouDetail(e){
    wx.navigateTo({
      url: '/pages/my/coupons/detail?id=' + e.currentTarget.dataset.id
    })
  },
  // 积分兑换优惠券
  // /app/integralgoods/appcouponslist
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
  goList(){
    wx.navigateTo({
      url: '/pages/my/integral/list',
    })
  },
  goOrder:function(){
    wx.navigateTo({
      url: "/pages/my/integral/coupons?type=0"
    })
  },
  goStore:function(){
    wx.navigateTo({
      url: "/pages/my/integral/coupons?type=1"
    })
  }

})