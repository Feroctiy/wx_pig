var call = require("../../../utils/request.js");
Page({
  data: {
    list: [],
    value: "",
    PULLNUM:0
  },
  onLoad: function (options) {  
  },
  search(e) {
    var _this = this;
    call.getData('/app/goods/appgoodslist', {
      DB_STORE_ID: wx.getStorageSync('DB_STORE_ID'),
      INPUT: e.detail,
      G_TYPE_ID: '',
      PULLNUM: _this.data.PULLNUM
    }, function (res) { 
      if (res.state == "success") {
        _this.setData({ list: res.goods })
      }else{
        _this.setData({ list: [] })
      }
    }, function () {})
  },
  // 商品详情
  todetail(e){
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
  }
})