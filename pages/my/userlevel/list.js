var call = require("../../../utils/request.js");
Page({
  data: {
    list: {}
  },
  onLoad: function (options) {
    var _this = this;
    call.getData('/app/user/appgetuserGrowth', {
      OPENID: wx.getStorageSync('openid'),
      PULLNUM:'0'
    }, function (res) {
      if (res.state == 'success') {
        _this.setData({
          list:res.growth
        })
      }

    }, function () {})
  }
})