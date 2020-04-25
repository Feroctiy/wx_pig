var call = require("../../../utils/request.js")
var util = require("../../../utils/util.js")

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    couponslist:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.appcouponslist();
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
  goCouDetail(e) {
    wx.navigateTo({
      url: '/pages/my/coupons/detail?id=' + e.currentTarget.dataset.id
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})