// pages/my/index/index.js
var call = require("../../../utils/request.js");
var getUrl = require('../../../utils/url.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageUrl: getUrl.imageUrl(),
    userInfo: {},
    iconList: [
      { url: "sale1.png",icon: 'cardboardfill',color: 'red',type: 1,name: '待付款'}, 
      { url: "sale2.png", icon: 'recordfill', color: 'orange', type: 2, name: '待发货' }, 
      { url: "sale3.png", icon: 'picfill', color: 'yellow', type: 3, name: '待收货' }, 
      { url: "sale4.png", icon: 'noticefill', color: 'olive', type: 4, name: '评价' }, 
      { url: "sale5.png", icon: 'noticefill', color: 'olive', type: 0, name: '退款/售后' }
    ],
    gridCol: 5,
    recomlist: [],
    openid: ''
  },
  onLoad: function (options) {
    this.appgetrecomlist();
  },
  onShow: function () {
    if (wx.getStorageSync('openid')) {
      this.setData({
        openid: wx.getStorageSync('openid')
      })
      this.getUserInfo();
    }
  },
  // 获取用户信息
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
  goOrder: function (e) {
    console.log(e)
    if (!wx.getStorageSync('openid')) {
      wx.navigateTo({
        url: '/pages/login/login',
        url: `/pages/login/login?from=${this.route}&tab=true`,
      })
      return;
    }
    if(e.currentTarget.dataset.type == 0){ 
      wx.navigateTo({
        url: '/pages/my/afterSaleList/afterSaleList?type=' + e.currentTarget.dataset.type,
      })
    }else{
      wx.navigateTo({
        url: '/pages/my/order/order?type=' + e.currentTarget.dataset.type,
      })
    }
    
  },

  goBalance() {
    if (!wx.getStorageSync('openid')) {
      wx.navigateTo({
        url: '/pages/login/login',
        url: `/pages/login/login?from=${this.route}&tab=true`,
      })
      return;
    }
    wx.navigateTo({
      url: '/pages/my/balance/balance',
    })
  },

  /**
   * 个人信息
   */
  goInfo: function () {
    if (!wx.getStorageSync('openid')) {
      wx.navigateTo({
        url: '/pages/login/login',
        url: `/pages/login/login?from=${this.route}&tab=true`,
      })
      return;
    }

    wx.navigateTo({
      url: '/pages/my/info/info',
    })
  },
  goLevel() {

    if (!wx.getStorageSync('openid')) {
      wx.navigateTo({
        url: '/pages/login/login',
        url: `/pages/login/login?from=${this.route}&tab=true`,
      })
      return;
    }

    wx.navigateTo({
      url: '/pages/my/userlevel/index',
    })
  },
  /**
   * 收货地址
   */
  goAddress: function () {
    if (!wx.getStorageSync('openid')) {
      wx.navigateTo({
        url: '/pages/login/login',
        url: `/pages/login/login?from=${this.route}&tab=true`,
      })
      return;
    }

    wx.navigateTo({
      url: '/pages/address/list/index?back=0',
    })
  },
  // 下单指南与关于我们
  goShowCase: function (e) {
    wx.navigateTo({
      url: '/pages/my/showcase/showcase?type=' + e.currentTarget.dataset.type
    })
  },
  // 账户与安全
  goSetings: function () {
    if (!wx.getStorageSync('openid')) {
      wx.navigateTo({
        url: '/pages/login/login',
        url: `/pages/login/login?from=${this.route}&tab=true`,
      })
      return;
    }
    wx.navigateTo({
      url: '/pages/my/seting/index',
    })
  },
  // 分销中心
  goShareCenter() {
    if (!wx.getStorageSync('openid')) {
      wx.navigateTo({
        url: '/pages/login/login',
        url: `/pages/login/login?from=${this.route}&tab=true`,
      })
      return;
    }
    wx.navigateTo({
      url: '/pages/sharesCenter/userInfo/userInfo',
    })
  },
  // 拨打商家电话
  call() {
    wx.makePhoneCall({
      phoneNumber: '1340000' //仅为示例，并非真实的电话号码
    })
  },
  // 推荐列表
  appgetrecomlist() {
    var _this = this;
    call.getData('/app/goods/appgetrecomlist', {
      DB_STORE_ID: wx.getStorageSync('DB_STORE_ID'),
      PULLNUM: '0'
    }, function (res) {
      if (res.state == "success") {
        _this.setData({
          recomlist: res.goods
        })
      }
      console.log(res);
    }, function () {})
  },
  goDetail(e) {
    if (!wx.getStorageSync('openid')) {
      if (!wx.getStorageSync('openid')) {
        wx.navigateTo({
          url: '/pages/login/login',
          url: `/pages/login/login?from=${this.route}&tab=true`,
        })
        return;
      }
      return;
    }
    wx.navigateTo({
      url: '/pages/goods/detail/detail?id=' + e.currentTarget.dataset.id
    })
  },
  goFollow(e) {
    if (!wx.getStorageSync('openid')) {
      if (!wx.getStorageSync('openid')) {
        wx.navigateTo({
          url: '/pages/login/login',
          url: `/pages/login/login?from=${this.route}&tab=true`,
        })
        return;
      }
      return;
    }
    wx.navigateTo({
      url: '/pages/my/follow/index'
    })
  },
  goIntegral(e) {
    if (!wx.getStorageSync('openid')) {
      if (!wx.getStorageSync('openid')) {
        wx.navigateTo({
          url: '/pages/login/login',
          url: `/pages/login/login?from=${this.route}&tab=true`,
        })
        return;
      }
      return;
    }
    wx.navigateTo({
      url: '/pages/my/integral/index?num=' + this.data.userInfo.U_INTEGRAL
    })
  },
  goCoupon(e) {
    if (!wx.getStorageSync('openid')) {
      if (!wx.getStorageSync('openid')) {
        wx.navigateTo({
          url: '/pages/login/login',
          url: `/pages/login/login?from=${this.route}&tab=true`,
        })
        return;
      }
      return;
    }
    wx.navigateTo({
      url: '/pages/my/coupons/list'
    })
  }
})