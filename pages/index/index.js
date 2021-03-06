const app = getApp();
var call = require("../../utils/request.js");
var getUrl = require('../../utils/url.js');

Page({
  data: {
    imageUrl: getUrl.imageUrl(),
    gridCol: 5,
    cardCur: 0,
    indexData: {},
    customBar: app.globalData.CustomBar,
    store: "",
    goodsList: [],
    groupList: []
  },
  onLoad: function (options) { 
  },
  onShow() {
    var _this = this;
    if (wx.getStorageSync('store')) {
      var store = wx.getStorageSync('store');
      this.setData({ store: store })
      call.getData('/app/user/appgetplat', {
        DB_STORE_ID: wx.getStorageSync('DB_STORE_ID')
      }, function (res) {
        _this.setData({ indexData: res }) 
      }, function () {})
    } else {
      _this.pos();
    }
  },
  pos: function () { 
    var that = this;
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          wx.showModal({
            title: '是否授权当前位置',
            content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
            success: function (res) {
              if (res.cancel) {} else if (res.confirm) {
                wx.openSetting({
                  success: function (data) {
                    if (data.authSetting["scope.userLocation"] == true) {
                      wx.showToast({ title: '授权成功', icon: 'success', duration: 5000 })
                      that.path();
                    } else {
                      wx.showToast({ title: '授权失败', icon: 'success', duration: 5000 })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) { //初始化进入
          that.path();
        } else {
          that.path();
        }
      }
    })
  },
  path: function () { 
    var _this = this;
    //获取用户的初始位置
    wx.getLocation({
      type: "gcj02",
      success: (res) => {
        wx.setStorageSync('start_long', res.longitude);
        wx.setStorageSync('start_lati', res.latitude);
        this.setData({
          longitude: res.longitude,
          latitude: res.latitude
        });

        call.getData('/app/user/appgetstoreHome', { LAT: res.latitude, LON: res.longitude }, function (res) {
          console.log(res);
          if (res.status == "success") {
            _this.setData({ store: res.store[0] })
            wx.setStorageSync('store', res.store[0])
            wx.setStorageSync('DB_STORE_ID', res.store[0].DB_STORE_ID)
            call.getData('/app/user/appgetplat', {
              DB_STORE_ID: res.store[0].DB_STORE_ID
            }, function (res) {
              _this.setData({  indexData: res }) 
            }, function () {})
  
          }else{
            wx.showToast({title:res.message,icon:"none"})
          }
        }, function () {})

      },
      fail: function (res) {
        console.log(res);
      }
    });
  },
  // 商品详情页面
  goDetail(e) {
    var type = e.currentTarget.dataset.type //类型（1普通；2秒杀；3拼团；4众筹；）
    var DB_GOODS_ID = e.currentTarget.dataset.id
    if (!wx.getStorageSync('openid')) {
      wx.navigateTo({
        url: '/pages/login/login',
        url: `/pages/login/login?from=${this.route}&tab=true`,
      })
      return;
    }
    wx.navigateTo({
      url: '/pages/goods/detail/detail?id=' + e.currentTarget.dataset.id
    })
  },
  // 店铺列表
  goStoreList() {
    wx.navigateTo({ url: '/pages/goods/store/list' })
  },
  // 商品搜索
  goSearch() {
    wx.navigateTo({ url: '/pages/goods/search/search'})
  },
  // 轮播图
  goBanner(e) { 
    wx.navigateTo({
      url: '/pages/goods/loop/loop?id=' + e.currentTarget.dataset.id,
    })
  },
  // 公告列表
  goNotice() {
    wx.navigateTo({ url: '/pages/notice/notice' })
  },
  // 活动页面
  goShare(){
    if (!wx.getStorageSync('openid')) {
      wx.navigateTo({
        url: '/pages/login/login',
        url: `/pages/login/login?from=${this.route}&tab=true`,
      })
      return;
    }
    wx.navigateTo({ url: '/pages/share/share' })
  },
  // 秒杀列表
  goSeckilList(){
    wx.navigateTo({ url: '/pages/goods/seckilList/index' })
  },
  // 团购列表
  goGroupList(){
    wx.navigateTo({
      url: '/pages/goods/groupList/index'
    }) 
  },
  allproduct() {
    wx.navigateTo({ url: '/pages/goods/index/index' })
  },
  goGoods() {
    wx.navigateTo({ url: '/pages/goods/index/index' })
  }
})