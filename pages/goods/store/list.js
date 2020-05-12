var call = require("../../../utils/request.js")
var util = require("../../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    storeList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getstoreHome();
  },
  // /app/user/appgetstoreHome
  getstoreHome() {
    var _this = this;
    call.getData('/app/user/appgetstoreHome', {}, function (res) {
      console.log(res);
      if (res.status == "success") {
        _this.setData({
          storeList: res.store
        })
      }
    }, function () {})
  },
  gotoStore:function(e){
    wx.setStorageSync('store', e.currentTarget.dataset.store)
    wx.setStorageSync('DB_STORE_ID', e.currentTarget.dataset.id)
    wx.switchTab({
      url: '/pages/index/index',
    })
  }

})