var call = require("../../../utils/request.js") 
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    comments:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    this.getCommList()
    // /app/goods/appgetCommList
  },
  getCommList: function () {
    var _this = this;
    call.getData('/app/goods/appgetCommList', {
      DB_GOODS_ID: _this.data.id,
      PULLNUM:0

    }, function (res) {
      console.log(res);
      if (res.state == "success") {
        _this.setData({
          comments: res.comlist
        })
      }
    }, function () {})
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