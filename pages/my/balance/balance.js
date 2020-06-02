// pages/my/index/index.js
var call = require("../../../utils/request.js");
var getUrl = require('../../../utils/url.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageUrl: getUrl.imageUrl(),
    list: [],
    userInfo: {},
    tabSize:'0',
    otherStatus:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList();
    
  },
  onShow(){
    this.getUserInfo();
  },
  cardRecharge(){
    wx.navigateTo({
      url: '/pages/my/rechargecard/index',
    })
  },
  getUserInfo() {
    var _this = this;
    call.getData('/app/user/appgetuser', {
      OPENID: wx.getStorageSync('openid')
    }, function (res) {
      if (res.state == "success") {
        _this.setData({
          userInfo: res.user
        })
      }
      console.log(res);
    }, function () {})
  },
  // 充值列表
  getList() {
    var _this = this;
    call.getData('/app/buyorder/appgettopup', {}, function (res) {
      if (res.status == "success") {
        _this.setData({
          list: res.list,
          DB_TOP_UP_ID:res.list[0].DB_TOP_UP_ID
        })
      }
    }, function () {})
  },
  otherMoney(){
    this.setData({
      otherStatus:true,
      tabSize:100
    })
  },
  optMoney(e) {
    console.log(e);
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    this.setData({
      otherStatus:false,
      tabSize:index,
      DB_TOP_UP_ID:id
    })
    // this.recharge(id, '')
  },
  recharge(id, money) {
    var _this = this;
    call.getData('/app/buyorder/userbuyorder', {
      OPENID: wx.getStorageSync('openid'),
      DB_TOP_UP_ID: _this.data.DB_TOP_UP_ID,
      BO_MONEY: money
    }, function (res) {
      if (res.status == "success") {
        _this.xiadan(res.DB_BUY_ORDER_ID)
      }
    }, function () {})
  },
  xiadan(id) {
    var _this = this;
    call.getData('/app/buyorder/appwxxaidan', {
      OPENID: wx.getStorageSync('openid'),
      DB_BUY_ORDER_ID: id
    }, function (res) {
      console.log(res);
      
        _this.sign(res.prepay_id)
      
    }, function () {})
  },
  sign(id) {
    var _this = this;
    call.getData('/app/wxpay/appwxrepeatsign', {
      prepay_id: id
    }, function (res) {
      
        console.log(res);
        wx.requestPayment({
          timeStamp: res.timeStamp,
          nonceStr: res.nonceStr,
          package: res.package,
          signType: 'MD5',
          paySign: res.paySign,
          success (res) {
            wx.navigateBack({
              delta: -1
            })
          },
          fail (res) { }
        })
      
    }, function () {})

  },
  rechargeList(){
    wx.navigateTo({
      url: '/pages/my/rechargelist/index',
    })
  }

})