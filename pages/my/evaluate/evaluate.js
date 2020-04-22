var call = require("../../../utils/request.js")
var util = require("../../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: 3,
    imgList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      DB_SHOPCAR_ID:options.id
    })

  },
  onChange(event) {
    this.setData({
      value: event.detail
    });
  },
  handle(){
    var _this = this;
    call.getData('/app/comments/appsavecomment', {
      DB_SHOPCAR_ID: options.id,
      COM_NOTE:'',
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