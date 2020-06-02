var call = require("../../utils/request.js");
Page({
  data: {
    notice:[]
  },
  onLoad: function (options) {
    var _this = this;
    call.getData('/app/user/appgetnotice', {
      DB_STORE_ID: wx.getStorageSync('DB_STORE_ID')
    }, function (res) {
      console.log(res);
      if (res.state == "success") { 
        _this.setData({ notice: res.notice }) 
      }
    }, function () {})
  }
})