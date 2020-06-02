var call = require("../../../utils/request.js")
var util = require("../../../utils/util.js")
const app = getApp()
var PULLNUM = 0
Page({
  data: {
    loadingstate: false,
    loadingstate1: false,
    couponslist: [],
    goods: [],
    statusType: ["优惠券", "积分商品"],
    currentType: 0,
    tabClass: ["", ""],
  },
  onLoad: function (options) {
    this.setData({
      currentType: options.type
    })
    this.appcouponslist();
    this.appAllgoodslist();
  },
  statusTap: function (e) {
    this.setData({ 
      couponslist: [],
      goods:[]
    })
    PULLNUM = 0;
    this.setData({
      currentType: e.currentTarget.dataset.index
    });
    console.log(this.data.currentType)
    if(this.data.currentType == 0){
      this.appcouponslist();
    }else if(this.data.currentType == 1){
      this.appAllgoodslist();
    }
    // this.appcouponslist();
  },

  appcouponslist() {
    var _this = this;
    call.getData('/app/integralgoods/appcouponslist', {
      DB_STORE_ID: wx.getStorageSync('DB_STORE_ID'),
      PULLNUM: PULLNUM
    }, function (res) {
      console.log(res);
      if (res.state == "success") {
        var dataList = _this.data.couponslist
        var newinfo = res.coupons
        if (newinfo.length > 0) {
          for (var j = 0; j < newinfo.length; j++) {
            dataList.push(newinfo[j])
          }
        }
        if(newinfo.length < 10){
          _this.setData({ loadingstate:true })
        }else{
          _this.setData({ loadingstate:false })
        }
        _this.setData({
          couponslist: dataList
        })
      }
    }, function () {})
  },
  // 积分商品
  appAllgoodslist: function () {
    var _this = this;
    call.getData('/app/integralgoods/appAllgoodslist', {
      DB_STORE_ID: wx.getStorageSync('DB_STORE_ID'),
      PULLNUM: PULLNUM
    }, function (res) {
      console.log(res);
      if (res.state == "success") {


        var dataList = _this.data.goods
        var newinfo = res.goods
        if (newinfo.length > 0) {
          for (var j = 0; j < newinfo.length; j++) {
            dataList.push(newinfo[j])
          }
        }
        if(newinfo.length < 10){
          _this.setData({ loadingstate1:true })
        }else{
          _this.setData({ loadingstate1:false })
        }
        _this.setData({
          goods: dataList
        })

      }
    }, function () {})
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
  onReachBottom: function () {
    console.log("ssssss")
    var that = this
    if(that.data.loadingstate1 == true){
      return;
    }
    PULLNUM = PULLNUM + 1
    setTimeout(() => {
      console.log(that)
      console.log(that.data.currentType)
      // if (that.data.currentType == 0) {
      //   that.appcouponslist();
      // } else 
      if (that.data.currentType == 1) {
        that.appAllgoodslist();
      }
    }, 500)
  }

})