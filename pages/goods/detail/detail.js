// pages/goods/detail/detail.js
var WxParse = require('../../../components/wxParse/wxParse.js');
const app = getApp();
var call = require("../../../utils/request.js");
var util = require("../../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabSize: 0,
    tabSize1: 0,
    showSpec: false,
    detail: {},
    specSelected: "",
    specClass: 'none',
    specId: '',
    type: 1,
    num: 1,
    smoney: "",
    store: {},
    id: "",
    sharecode: true,
    sharebox: true,
    interPrice: "",
    SPE_NOWMONEY: "",
    SPE_INTEGRAL: "",
    flavour:[{name:'甜',id:'1'},{name:'巧克力',id:'2'}]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    this.getDetail()
  },
  getShareBox() {
    this.setData({
      sharebox: false
    })
  },
  getDetail: function () {
    var _this = this;
    call.getData('/app/goods/appgoodsdatile', {
      DB_GOODS_ID: _this.data.id,
      OPENID: wx.getStorageSync('openid')
    }, function (res) {
      console.log(res);
      if (res.state == "success") {
        _this.setData({
          detail: res.goods,
          specSelected: res.goods.specif[0].SPE_NAME + "(" + res.goods.specif[0].DIN_NAME + ")",
          specId: res.goods.specif[0].DB_SPECIFICATION_ID,
          smoney: res.goods.specif[0].SPE_MONEY,
          store: res.goods.store,
          SPE_INTEGRAL: res.goods.specif[0].SPE_INTEGRAL,
          SPE_NOWMONEY: res.goods.specif[0].SPE_NOWMONEY,
          interPrice: res.goods.specif[0].SPE_INTEGRAL + "积分" + "+¥" + res.goods.specif[0].SPE_NOWMONEY
        })
        var artice = res.goods.G_NOTE;
        WxParse.wxParse('artice', 'html', artice, _this, 5);
      }
    }, function () {})

    _this.getcartNum();
  },

  getcode: function () {
    var that = this;
    wx.showLoading({
      title: '生成中...',
    })
    // /app/share/appgetshare

    var _this = this;
    call.getData('/app/goods/appSharePosters', {
      OPENID: wx.getStorageSync('openid'),
      DB_GOODS_ID: _this.data.id,
    }, function (res) {
      console.log(res);
      

        wx.downloadFile({
          url: res,
          success: function (res) {
            wx.hideLoading()
            _this.setData({
              codeimg: res.tempFilePath,
              sharecode: false,
              sharebox: true
            });
          }
        })
      
    }, function () {})

    // wx.request({
    //   url: app.globalData.urls + '/qrcode/wxa/unlimit',
    //   data: {
    //     scene: "i=" + that.data.goodsDetail.basicInfo.id + ",u=" + app.globalData.uid + ",s=1",
    //     page: "pages/goods-detail/goods-detail",
    //     expireHours:1
    //   },
    //   success: function (res) {
    //     if (res.data.code == 0) {
    //       wx.downloadFile({
    //         url: res.data.data,
    //         success: function (res) {
    //           wx.hideLoading()
    //           that.setData({
    //             codeimg: res.tempFilePath,
    //             sharecode: false,
    //             sharebox: true
    //           });
    //         }
    //       })
    //     }
    //   }
    // });
  },
  savecode: function () {
    var that = this;
    wx.saveImageToPhotosAlbum({
      filePath: that.data.codeimg,
      success(res) {
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 2000
        })
      }
    })
    that.setData({
      sharecode: true,
    })
  },
  closeshare: function () {
    this.setData({
      sharebox: true,
      sharecode: true
    })
  },

  // 分店信息
  otherShop: function () {
    wx.navigateTo({
      url: '/pages/goods/store/list',
    })
  },

  // 关注店铺
  giveStateH: function (e) {
    console.log(e)
    var _this = this;
    call.getData('/app/share/appusersavegive', {
      OPENID: wx.getStorageSync('openid'),
      DB_STORE_ID: e.currentTarget.dataset.id
    }, function (res) {
      console.log(res);
      if (res.state == "success") {
        var message = (res.message == "CANCEL") ? "取消成功" : "关注成功"
        util.showMessage(message)
        _this.getDetail()
      }
    }, function () {})
  },
  //进店逛逛
  gotoStore: function (e) {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },

  cancle() {
    this.setData({
      showSpec: false
    })
  },
  selectflavour(e){
    var that = this
    var idx = e.currentTarget.id;
    that.setData({
      tabSize1: idx
    })
  },
  selectSpec: function (e) {
    var that = this
    var idx = e.currentTarget.id
    that.setData({
      tabSize: idx,
      specId: e.currentTarget.dataset.fid,
      smoney: e.currentTarget.dataset.money,
      interPrice: e.currentTarget.dataset.intergral + "积分+¥" + e.currentTarget.dataset.moneynowmoney
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

  /**
   * 全部评论页面
   */
  goComment: function () {
    wx.navigateTo({
      url: '/pages/goods/comment/index?id='+this.data.id,
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
  opentuan(){
    this.setData({ type: 5, showSpec: true })
  },
  // 积分兑换
  exchange() {
    this.setData({
      type: 4,
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
        detail: _this.data.detail,
        specSelected: _this.data.specSelected,
        num: _this.data.num,
        amoney: _this.data.smoney,
        specId: _this.data.specId
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
    } else if (this.data.type == 4) {
      var orderParam = {
        detail: _this.data.detail,
        specSelected: _this.data.specSelected,
        num: _this.data.num,
        amoney: _this.data.smoney,
        specId: _this.data.specId,
        SPE_INTEGRAL: _this.data.SPE_INTEGRAL,
        SPE_NOWMONEY: _this.data.SPE_NOWMONEY
      }
      wx.setStorageSync('orderParam', orderParam)
      wx.navigateTo({
        url: '/pages/cart/pay-order/pay-order?orderType=exchageInter',
      })
    } else if( this.data.type == 5 ){
      // 一键开团
      var orderParam = {
        detail: _this.data.detail,
        specSelected: _this.data.specSelected,
        num: _this.data.num,
        amoney: _this.data.smoney,
        specId: _this.data.specId,
        SPE_INTEGRAL: _this.data.SPE_INTEGRAL,
        SPE_NOWMONEY: _this.data.SPE_NOWMONEY
      }
      wx.setStorageSync('orderParam', orderParam)
      wx.navigateTo({
        url: '/pages/cart/pay-order/pay-order?orderType=pintuan',
      })

    }
  },
  // 购物车数量
  getcartNum() {
    // 
    var _this = this;
    call.getData('/app/shopcar/appusershopcarnum', {
      OPENID: wx.getStorageSync('openid')
    }, function (res) {
      console.log(res);
      if (res.state == "success") {
        _this.setData({
          cartNum: res.ShopCarNum
        })
      }
    }, function () {})
  }
})