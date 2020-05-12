const app = getApp();
var call = require("../../utils/request.js");
Page({
  data: {
    img: '',
    customBar: app.globalData.CustomBar,
    height: ""
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中'
    })
    var _this = this;
    _this.setData({
      height: 'calc(100vh - 100rpx-' + app.globalData.CustomBar + 'px)'
    })
    call.getData('/app/share/appShare', {
      OPENID: wx.getStorageSync('openid'),
    }, function (res) {
      console.log(res);

      _this.setData({
        img: res
      })
      setTimeout(function () {
        wx.hideLoading()
      }, 2000)


    }, function () {})
  },
  downloadImg() { //下载文件资源到本地，客户端直接发起一个 HTTP GET 请求，返回文件的本地临时路径
    var _this = this
    wx.downloadFile({
      url: _this.img,
      success(res) {
        wx.saveImageToPhotosAlbum({ // 下载成功后再保存到本地
          filePath: res.tempFilePath, //返回的临时文件路径，下载后的文件会存储到一个临时文件
          success() {
            // _this.sharePop = !_this.sharePop
            wx.showToast({
              title: '图片保存成功',
              icon: 'none',
              duration: 2000
            })
          }
        })
      }
    })
  }


})