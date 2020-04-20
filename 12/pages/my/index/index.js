// pages/my/index/index.js
var call = require("../../../utils/request.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    iconList: [{
      icon: 'cardboardfill',
      color: 'red',
      name: '待付款'
    }, {
      icon: 'recordfill',
      color: 'orange',
      name: '待发货'
    }, {
      icon: 'picfill',
      color: 'yellow',
      name: '待收货'
    }, {
      icon: 'noticefill',
      color: 'olive',
      name: '评价'
    }, {
      icon: 'noticefill',
      color: 'olive',
      name: '退款/售后'
    }],
    gridCol: 5,
    recomlist:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) { 
    this.appgetrecomlist();
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
    if(wx.getStorageSync('openid')){
      this.getUserInfo();
    }
  },
  // 获取用户信息
  getUserInfo(){
    var _this = this;
    call.getData('/app/user/appgetuser', {
      OPENID: wx.getStorageSync('openid')
    }, function (res) {
      if(res.state == "success"){
        _this.setData({
          userInfo:res.user
        })
      }
      console.log(res);
    }, function () {})
  },
 

  /**
   * 我的订单
   */
  goOrder: function() {
    wx.navigateTo({
      url: '/pages/my/order/order',
    })
  },

  /**
   * 个人信息
   */
  goInfo: function() {
    wx.navigateTo({
      url: '/pages/my/info/info',
    })
  },
  /**
   * 收货地址
   */
  goAddress: function () {
    wx.navigateTo({
      url: '/pages/address/list/index',
    })
  },
  // 下单指南与关于我们
  goShowCase:function(e){ 
    wx.navigateTo({
      url: '/pages/my/showcase/showcase?type='+ e.currentTarget.dataset.type
    })
  },
  // 账户与安全
  goSetings:function(){
    wx.navigateTo({
      url: '/pages/my/seting/index',
    })
  },
  // 拨打商家电话
  call(){
    wx.makePhoneCall({
      phoneNumber: '1340000' //仅为示例，并非真实的电话号码
    })
  },
  // 推荐列表
  appgetrecomlist(){
    var _this = this;
    call.getData('/app/goods/appgetrecomlist', {
      DB_STORE_ID: wx.getStorageSync('DB_STORE_ID'),
      PULLNUM:'0'
    }, function (res) {
      if(res.state == "success"){
        _this.setData({
          recomlist:res.goods
        })
      }
      console.log(res);
    }, function () {})
  },
  goDetail(e) {
    wx.navigateTo({
      url: '/pages/goods/detail/detail?id='+e.currentTarget.dataset.id
    })
  },
  goIntegral(e) {
    wx.navigateTo({
      url: '/pages/my/integral/index?num='+this.data.userInfo.U_INTEGRAL
    })
  }
})