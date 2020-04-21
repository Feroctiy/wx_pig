// pages/my/integral/list.js
var call = require("../../../utils/request.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    isHideLoadMore: false,
    pageNum: 1,
    pageSize: 10,
    load_h: true,
    line_h: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  getList:function(){
    var _this = this;
    call.getData('/app/user/appgetuserintegral', {
      OPENID: wx.getStorageSync('openid'),
      PULLNUM:0
    }, function (res) {
      if (res.state == "success") {
        _this.setData({
          list: res.integra
        })
      }
      console.log(res);
    }, function () { })
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
    this.getList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})