var call = require("../../../utils/request.js")
var util = require("../../../utils/util.js")
var WxParse = require('../../../components/wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    call.getData('/app/user/appgetexplain', {
      EX_TYPE: options.type == '1' ? "about-us":"order-guide"
    }, function (res) {
      console.log(res);
      if (res.state == "success") {
        _this.setData({explain:res.explain})
        var artice = res.explain.EX_NOTE;
        WxParse.wxParse('artice', 'html', artice, _this, 5);
      }
    }, function () {})
  }
})