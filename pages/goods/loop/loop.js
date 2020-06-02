 
var call = require("../../../utils/request.js");
var WxParse = require('../../../components/wxParse/wxParse.js');
Page({
  data: {

  },
  onLoad: function (options) {
    var _this = this;
    call.getData('/app/user/appgetbannerdate', {
      DB_BANNER_ID:options.id
    }, function (res) {
        var artice = res.banner.B_NOTE;
        console.log(artice)
        WxParse.wxParse('artice', 'html', artice, _this, 5);
    }, function () {})
  }
})