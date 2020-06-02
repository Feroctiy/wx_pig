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
    that.proList()
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        console.log('supOpenid', res.data)
        supOpenid = res.data
        
      },
    })
  },
  proList: function () {
    var that = this
    wx.request({
      url: url + '/app/goods/appgetgrouplist',
      data: {
        PULLNUM: PULLNUM,
        DB_STORE_ID: wx.getStorageSync('DB_STORE_ID')
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
    if (!wx.getStorageSync('openid')) {
      wx.navigateTo({
        url: '/pages/login/login',
        url: `/pages/login/login?from=${this.route}&tab=true`,
      })
      return;
    }
    wx.navigateTo({
      url: '/pages/goods/detail/detail?id=' + e.currentTarget.dataset.id
    })
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