var call = require("../../../utils/request.js")
var util = require("../../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: 3,
    imgList:[],
    remark:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      DB_SHOPCAR_ID:options.id
    })

  },
  textareaBInput: function (e) { 
     
    this.setData({ 
      remark: e.detail.value
    });
  },
  onChange(event) {
    this.setData({
      value: event.detail
    });
  },
  handle(){
    var _this = this;
    call.getData('/app/comments/appsavecomment', {
      OPENID:wx.getStorageSync('openid'),
      DB_SHOPCAR_ID: _this.data.DB_SHOPCAR_ID,
      COM_NOTE:_this.data.remark,
      COM_NUM:_this.data.value
    }, function (res) {
      console.log(res);
      if (res.state == "success") {
        wx.navigateBack({
          delta: 1
        })
      }
    }, function () {}) 
  }

 

   
})