var call = require("../../../utils/request.js")
var util = require("../../../utils/util.js")
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
    this.getstoreHome();
  },
  // /app/user/appgetstoreHome
  getstoreHome() {
    call.getData('/app/user/appgetstoreHome', {}, function (res) {
      console.log(res);
    }, function () {})
  }

})