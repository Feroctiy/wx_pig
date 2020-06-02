var getUrl = require('../../../utils/url.js')
var url = getUrl.getUrl()
var PULLNUM = 0
var supOpenid = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        console.log('supOpenid', res.data)
        supOpenid = res.data
        that.proList()
      },
    })
  },
  proList: function () {
    var that = this
    wx.request({
      url: url + '/app/goods/appgetgrouplist',
      data: {
        PULLNUM: PULLNUM,
        OPENID: supOpenid
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.state == 'success') {
          var dataList = that.data.dataList
          var newinfo = res.data.goods
          if (newinfo.length > 0) {
            for (var j = 0; j < newinfo.length; j++) {
              dataList.push(newinfo[j])
            }
          }
          that.setData({
            dataList: dataList
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          });
        }

      }
    })
  },
  //商品详情
  groupProDetails: function (e) {
    var DB_GOODS_ID = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../groupProDetails/groupProDetails?DB_GOODS_ID=' + DB_GOODS_ID,
    })

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this
    PULLNUM = 0
    wx.showNavigationBarLoading()
    setTimeout(() => {
      that.setData({
        dataList: []
      })

      that.proList()

      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
    }, 500)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
    PULLNUM = PULLNUM + 1
    setTimeout(() => {
      that.proList()
    }, 500)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})