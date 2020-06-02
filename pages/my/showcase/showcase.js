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
    console.log(options);
    var _this = this;
    var EX_TYPE = "";
    if(options.type == '1'){
      EX_TYPE = "about-us";
    }else if(options.type == '2'){
      EX_TYPE = "order-guide";
    }else if(options.type == '5'){
      EX_TYPE = "user_withdrawal";
    }
    call.getData('/app/user/appgetexplain', {
      EX_TYPE: EX_TYPE
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