// pages/my/coupons/list.js
var call = require("../../../utils/request.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    isHideLoadMore: false,
    pageNum: 0,
    pageSize: 10,
    load_h: true,
    line_h: true,
    currentType: 0,
    tabs: ["全部","未使用","已使用","已过期"],
    tabClass: ["", "", "", ""],
  },
  statusTap: function (e) {
    var obj = e;
    var count = 0;
    for (var key in obj) {
      count++;
    }
    if (count == 0) {
      var curType = 0;
    } else {
      var curType = e.currentTarget.dataset.index;
    }
    this.data.currentType = curType
    this.setData({
      currentType: curType
    });
    this.onShow();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function(options) {
    this.getList()
  },
  // 列表
  getList: function() {
    var _this = this;
    call.getData('/app/user/appusercourse', {
      OPENID: wx.getStorageSync('openid'),
      PULLNUM: this.data.pageNum,
      UC_TYPE: this.data.currentType
    }, function(res) {
      console.log(res)
      var listArr = _this.data.list;
      if (res.state == "success") {
        for (var i = 0; i < res.uclist.length; i++) {
          listArr.push(res.uclist[i])
        }
        if (_this.data.pageNum == 0) {
          _this.setData({
            list: res.uclist,
          })
        } else {
          _this.setData({
            list: listArr,
          })
        }
        if (res.uclist.length < 10) {
          _this.setData({
            load_h: true,
            line_h: false
          })
        }
      }
    }, function() {})
  },
 touse:function(e){
   wx.switchTab({
     url: '/pages/index/index',
   })
 },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  }
})