var call = require("../../../utils/request.js")
Page({
  data: {
    storeList:[]
  },
  onLoad: function (options) {
    this.getstoreHome();
  },
  // 获取店铺列表
  getstoreHome() {
    var _this = this;
    call.getData('/app/user/appgetstoreHome', {}, function (res) {
      console.log(res);
      if (res.status == "success") {
        _this.setData({ storeList: res.store })
      }
    }, function () {})
  },
  // 店铺切换
  gotoStore:function(e){
    wx.setStorageSync('store', e.currentTarget.dataset.store)
    wx.setStorageSync('DB_STORE_ID', e.currentTarget.dataset.id)
    wx.switchTab({ url: '/pages/index/index' })
  }

})