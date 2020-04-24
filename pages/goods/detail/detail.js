// pages/goods/detail/detail.js
var WxParse = require('../../../components/wxParse/wxParse.js');
const app = getApp();
var call = require("../../../utils/request.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabSize: 0,
    showSpec: false,
    detail: {},
    specSelected: "",
    specClass: 'none',
    specId: '',
    type: 1,
    num: 1,
    smoney:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    call.getData('/app/goods/appgoodsdatile', {
      DB_GOODS_ID: options.id ,
      OPENID: wx.getStorageSync('openid')
    }, function (res) {
      console.log(res);
      if (res.state == "success") {
        _this.setData({
          detail: res.goods,
          specSelected: res.goods.specif[0].SPE_NAME + "(" + res.goods.specif[0].DIN_NAME + ")",
          specId: res.goods.specif[0].DB_SPECIFICATION_ID,
          smoney: res.goods.specif[0].SPE_MONEY
        })
        var artice = res.goods.G_NOTE;
        WxParse.wxParse('artice', 'html', artice, _this, 5);
      }
    }, function () {})

    _this.getcartNum();
  },
 
  cancle() {
    this.setData({
      showSpec: false
    })
  },
  selectSpec: function (e) {
    var that = this
    var idx = e.currentTarget.id
    that.setData({
      tabSize: idx,
      specId: e.currentTarget.dataset.fid,
      smoney: e.currentTarget.dataset.money
    })

    that.data.detail.specif.forEach(item => {
      console.log(item);
      if (item.DB_SPECIFICATION_ID == e.currentTarget.dataset.fid) {
        that.setData({
          specSelected: item.SPE_NAME + "(" + item.DIN_NAME + ")"
        })
      }
    })
  },
  //规格弹窗开关
  toggleSpec() {
    this.setData({
      showSpec: !this.data.showSpec
    })
  },
  onChange(event) {
    console.log(event.detail);
  },

  /**
   * 全部评论页面
   */
  goComment: function () {
    wx.navigateTo({
      url: '/pages/goods/comment/index',
    })
  },
  // 购物车跳转
  goCart: function () {
    wx.switchTab({
      url: '/pages/cart/home/home',
    })
  },
  onChange(event) {
    this.setData({
      num: event.detail
    })
    console.log(event.detail);
  },

  // 加入购物车
  joinCart() {
    this.setData({
      type: 3,
      showSpec: true
    })
  },
  // 立即购买 /:type
  submit() {
    this.setData({
      type: 2,
      showSpec: true
    })
  },
  handleSub() {
    var _this = this;
    if (this.data.type == 1) {
      this.setData({
        showSpec: false
      })
    } else if (this.data.type == 2) {
      // 立即购买
      console.log("立即购买")
      var orderParam = {
        detail:_this.data.detail,
        specSelected:_this.data.specSelected,
        num:_this.data.num,
        amoney:_this.data.smoney,
        specId:_this.data.specId
      }
      wx.setStorageSync('orderParam', orderParam)
      wx.navigateTo({
        url: '/pages/cart/pay-order/pay-order?orderType=buyNow',
      })
    } else if (this.data.type == 3) {
      // 加入购物车
      console.log("加入购物车", _this)

      call.getData('/app/shopcar/appaddshopcar', {
        DB_SPECIFICATION_ID: _this.data.specId,
        OPENID: wx.getStorageSync('openid'),
        NUM: _this.data.num
      }, function (res) {
        console.log(res);
        if (res.state == "success") {
          wx.showToast({
            title: '已加入购物车',
            icon: 'none',
            duration: 1500
          })
          _this.setData({
            showSpec: false
          })
          _this.getcartNum();
        }
      }, function () {})
    }
  },
  // 购物车数量
  getcartNum(){
    // 
    var _this = this;
    call.getData('/app/shopcar/appusershopcarnum', { 
      OPENID: wx.getStorageSync('openid')
    }, function (res) {
      console.log(res);
      if (res.state == "success") {
         _this.setData({
          cartNum:res.ShopCarNum
         })
      }
    }, function () {})
  }
})