// pages/my/index/index.js
var call = require("../../../utils/request.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[{},{},{}],
    userInfo: {},
    iconList: [{
      url: "sale1.png",
      icon: 'cardboardfill',
      color: 'red',
      type: 1,
      name: '待付款'
    }, {
      url: "sale2.png",
      icon: 'recordfill',
      color: 'orange',
      type: 2,
      name: '待发货'
    }, {
      url: "sale3.png",
      icon: 'picfill',
      color: 'yellow',
      type: 3,
      name: '待收货'
    }, {
      url: "sale4.png",
      icon: 'noticefill',
      color: 'olive',
      type: 4,
      name: '评价'
    }, {
      url: "sale5.png",
      icon: 'noticefill',
      color: 'olive',
      type: 0,
      name: '退款/售后'
    }],
    gridCol: 5,
    recomlist: [],
    openid: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
     
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (wx.getStorageSync('openid')) {
      this.setData({
        openid: wx.getStorageSync('openid')
      })
      this.getUserInfo();
    }
  },
})