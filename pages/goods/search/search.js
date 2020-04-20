const app = getApp();
var openid;
var call = require("../../../utils/request.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    value: ""
  },
  onLoad: function (options) {
    var that = this
    //获取存储信息
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        openid = res.data
      }
    })
  },
  search(e) {
    var _this = this;
    call.getData('/app/goods/appgoodslist', {
      DB_STORE_ID: wx.getStorageSync('DB_STORE_ID'),
      INPUT: e.detail,
      G_TYPE_ID: '',
      PULLNUM: '0'

    }, function (res) {
      console.log(res);

      if (res.state == "success") {
        _this.setData({
          list: res.goods
        })

      }
    }, function () {})



  },
  onClick() {
    console.log(this.data)
  },
  todetail(e){
    wx.navigateTo({
      url: '/pages/goods/detail/detail?id='+e.currentTarget.dataset.id
    })
  }
})