// pages/my/integral/list.js
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

  getList: function () {
    var _this = this;
    call.getData('/app/user/appgetuserintegral', {
      OPENID: wx.getStorageSync('openid'),
      PULLNUM: this.data.pageNum
    }, function (res) {
      var listArr = _this.data.list;
      if (res.state == "success") {
        for (var i = 0; i < res.integra.length; i++) {
          listArr.push(res.integra[i])
        }
        if (_this.data.pageNum == 0) {
          _this.setData({
            list: res.integra,
          })
        } else {
          _this.setData({
            list: listArr,
          })
        }
        if (res.integra.length < 10) {
          _this.setData({
            load_h: true,
            line_h: false
          })
        }
      }
      console.log(res);
    }, function () {})
  },
  onReachBottom: function () {
    var that = this;
    if (!this.data.line_h) {
      return;
    }
    that.setData({
      load_h: false
    })
    this.setData({
      pageNum: this.data.pageNum + 1
    });
    this.getList();
  }
})