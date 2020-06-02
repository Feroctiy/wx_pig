 var call = require("../../../utils/request.js");
 var WxParse = require('../../../components/wxParse/wxParse.js');
 Page({
   data: {
     memberInfo: {}
   },
   onLoad: function (options) {
     var _this = this;
     call.getData('/app/user/appgetmember', {
       OPENID: wx.getStorageSync('openid')
     }, function (res) {
       if (res.state == 'success') {
         _this.setData({
           memberInfo:res.member
         })
         var artice = res.member.ME_NOTE;
         WxParse.wxParse('artice', 'html', artice, _this, 5);
       }

     }, function () {})
   }
 })