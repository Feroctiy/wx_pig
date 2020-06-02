var app = getApp()
var call = require("../../../utils/request.js");
var Utils = require("../../../utils/util.js");
// 1 立即购买 2 积分兑换 3、原价购买 4 、一健开团 orderType
Page({
  data: {
    orderType: "", //1 立即购买 2 积分兑换 3、原价购买 4 、一健开团 5、购物车下单
    curAddressData: null, // 当前收货地址
    // 下单参数
    payOrderParam: {
      shopcarlist: "", // 购物车组id
      DB_GOODS_ID: "", // 商品id
      DB_SPECIFICATION_ID: "", // 规格id
      DB_TASTE_ID: "", // 口味id
      NUM: "", // 商品数量
      DB_ADDRESS_ID: "", // 地址ID
      DB_USER_COU_ID: "", // 优惠券ID
      O_NOTE: "", // 备注
      O_DATE: "", // 时间
      TUAN_ID: ""
    },
    buyNowInfoMem: "", // 商品详情携带的参数
    goodDetail: {}, // 商品详情
    totalPrice: 0, // 总价格
    goodtotalPrice: 0, // 商品总价格
    orderData: null, // 购物车订单数据
    couponList: [], // 优惠券



    hasNoCoupons: true,





    goodsList: [],
    isNeedLogistics: 0, // 是否需要物流信息
    allGoodsPrice: 0,
    yunPrice: 0,
    allGoodsAndYunPrice: 0,
    goodsJsonStr: "",

    coupons: [],
    youhuijine: 0, //优惠券金额
    curCoupon: null, // 当前选择使用的优惠券




    show: false,
    overlay: false,




    dayList: [],
    weekdayName: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
    dayName: ["今天", "明天", "后天"],

    items: [],
    mainActiveIndex: 0,
    activeId: [],
    max: 2
  },
  onLoad: function (e) {
    var that = this;
    that.setData({
      isNeedLogistics: 1,
      orderType: e.orderType // 订单类型
    });
    that.initShippingAddress(); // 默认收货地址
    if (e.orderType == '5') {
      that.setData({
        shopcarlist: e.shoppingcartlist.split(',')
      })
      that.getOrderData();
      return;
    }
    var buyNowInfoMem = wx.getStorageSync('orderParam');
    that.setData({
      buyNowInfoMem: buyNowInfoMem,
      ["payOrderParam.DB_GOODS_ID"]: buyNowInfoMem.DB_GOODS_ID || '',
      ["payOrderParam.NUM"]: buyNowInfoMem.NUM || '1',
      ["payOrderParam.DB_TASTE_ID"]: buyNowInfoMem.DB_TASTE_ID || '',
      ["payOrderParam.DB_SPECIFICATION_ID"]: buyNowInfoMem.DB_SPECIFICATION_ID || '',
      ["payOrderParam.TUAN_ID"]: buyNowInfoMem.TUAN_ID || ''
    })
    that.getDetail(); // 商品详情

    // if (e.orderType == "buyNow") {
    //   that.setData({
    //     buyNowInfoMem: buyNowInfoMem,
    //     "orderData.money": buyNowInfoMem.num * buyNowInfoMem.amoney
    //   })
    // } else if (e.orderType == "exchageInter") {
    //   var buyNowInfoMem = wx.getStorageSync('orderParam');
    //   that.setData({
    //     buyNowInfoMem: buyNowInfoMem,
    //     "orderData.money": buyNowInfoMem.num * buyNowInfoMem.amoney
    //   })
    // } else if (e.orderType == "pintuan") {
    //   var buyNowInfoMem = wx.getStorageSync('orderParam');
    //   that.setData({
    //     buyNowInfoMem: buyNowInfoMem,
    //     "orderData.money": buyNowInfoMem.num * buyNowInfoMem.amoney
    //   })
    // } else {
    //   console.log("sssss", e.shoppingcartlist)
    //   that.setData({
    //     shopcarlist: e.shoppingcartlist.split(',')
    //   })
    //   this.getOrderData();
    // }

  },
  // 商品详情
  getDetail: function () {
    var _this = this;
    call.getData('/app/goods/appgoodsdatile', {
      DB_GOODS_ID: _this.data.payOrderParam.DB_GOODS_ID,
      OPENID: wx.getStorageSync('openid')
    }, function (res) {
      console.log(res);
      if (res.state == "success") {
        // 商品规格、商品口味、商品价格
        var totalPrice = 0
        var interPrice = ''
        var interPriceNum = 0
        for (var i = 0; i < res.goods.specif.length; i++) {
          if (res.goods.specif[i].DB_SPECIFICATION_ID == _this.data.payOrderParam.DB_SPECIFICATION_ID) {
            var price = res.goods.specif[i].SPE_MONEY
            totalPrice = (price * _this.data.payOrderParam.NUM).toFixed(2)

            if(_this.data.orderType == '2'){
              interPrice =(res.goods.specif[i].SPE_INTEGRAL * _this.data.payOrderParam.NUM).toFixed(2)+"积分+" + (res.goods.specif[i].SPE_NOWMONEY * _this.data.payOrderParam.NUM).toFixed(2)+"元"
              interPriceNum = (res.goods.specif[i].SPE_INTEGRAL * _this.data.payOrderParam.NUM).toFixed(2)
              totalPrice = (res.goods.specif[i].SPE_NOWMONEY * _this.data.payOrderParam.NUM).toFixed(2)
            }



          }
        }
        if (res.goods.G_TYPE == 1) {
          _this.couponList()
        }
        _this.setData({
          goodDetail: res.goods,
          totalPrice: totalPrice,
          interPrice:interPrice,
          goodtotalPrice: totalPrice,
          interPriceNum:interPriceNum
        })

      }
    }, function () {})
  },
  // 获取默认的收货地址
  initShippingAddress: function () {
    var that = this;
    call.getData('/app/address/appuserdefaultadd', {
      OPENID: wx.getStorageSync('openid')
    }, function (res) {
      if (res.state == "success") {
        that.setData({
          curAddressData: res.address,
          ['payOrderParam.DB_ADDRESS_ID']: res.address.DB_ADDRESS_ID
        });
      } else {
        that.setData({
          curAddressData: null
        });
      }
      // that.processYunfei(); 
    }, function () {})
  },
  // 如果没有收货地址 - 新增收货地址
  addAddress: function () {
    wx.navigateTo({
      url: "/pages/address/add/index?type=add"
    })
  },
  // 选择收货地址
  selectAddress: function () {
    wx.navigateTo({
      url: "/pages/address/list/index?back=1"
    })
  },
  // 提交订单
  onSubmit() {
    var that = this;
    if (Utils.isEmpty(that.data.payOrderParam.DB_ADDRESS_ID)) {
      wx.showToast({
        title: '请先设置您的收货地址',
        icon: 'none'
      })
      return;
    }
    if (Utils.isEmpty(that.data.payOrderParam.O_DATE)) {
      wx.showToast({
        title: '请选择配送时间',
        icon: 'none'
      })
      return;
    }
    console.log(that.data.orderType);
    //1 立即购买 2 积分兑换 3、原价购买 4 、一健开团 5、购物车下单
    if (that.data.orderType == '1') {
      that.handleBuy();
    } else if (that.data.orderType == '2') {
      that.handleInterExchage();
    } else if (that.data.orderType == '3') {
      that.createSingleOrder();
    } else if (that.data.orderType == '4') {
      that.createTuanOrder();
    } else if (that.data.orderType == '5') {
      that.handleCart();
    }
  },
  // 1、立即购买
  handleBuy() {
    var that = this;
    call.getData('/app/order/appGoodsCreateOrder', {
      OPENID: wx.getStorageSync('openid'),
      DB_SPECIFICATION_ID: that.data.payOrderParam.DB_SPECIFICATION_ID,
      DB_TASTE_ID: that.data.payOrderParam.DB_TASTE_ID,
      NUM: that.data.payOrderParam.NUM,
      DB_ADDRESS_ID: that.data.payOrderParam.DB_ADDRESS_ID, // 地址ID
      DB_USER_COU_ID: that.data.payOrderParam.DB_USER_COU_ID, // 优惠券ID
      O_NOTE: that.data.payOrderParam.O_NOTE, // 备注
      O_DATE: that.data.payOrderParam.O_DATE // 时间
    }, function (res) {
      if (res.state == "success") {
        wx.navigateTo({
          url: '/pages/cart/pay-money/pay-money?money=' + that.data.totalPrice + '&O_PLAY_Z_ID=' + res.O_PLAY_Z_ID
        })
      } else {
        wx.showToast({
          title: res.message,
          icon: 'none'
        })
      }
    }, function () {})
  },
  // 4 、一健开团  
  createTuanOrder() {
    var that = this;
    call.getData('/app/order/appCreateTuanOrder', {
      OPENID: wx.getStorageSync('openid'),
      TUAN_ID: that.data.payOrderParam.TUAN_ID,
      DB_GOODS_ID: that.data.payOrderParam.DB_GOODS_ID,
      DB_SPECIFICATION_ID: that.data.payOrderParam.DB_SPECIFICATION_ID,
      NUM: that.data.payOrderParam.NUM,
      DB_TASTE_ID: that.data.payOrderParam.DB_TASTE_ID,
      DB_ADDRESS_ID: that.data.payOrderParam.DB_ADDRESS_ID, // 地址ID
      DB_USER_COU_ID: that.data.payOrderParam.DB_USER_COU_ID, // 优惠券ID
      O_NOTE: that.data.payOrderParam.O_NOTE, // 备注
      O_DATE: that.data.payOrderParam.O_DATE // 时间
    }, function (res) {
      if (res.state == "success") {
        wx.navigateTo({
          url: '/pages/cart/pay-money/pay-money?money=' + that.data.totalPrice + '&O_PLAY_Z_ID=' + res.O_PLAY_Z_ID
        })
      } else {
        wx.showToast({
          title: res.message,
          icon: "none"
        })
      }
    }, function () {})
  },
  // 3、appCreateSingleOrder 单独购买
  createSingleOrder() {
    var that = this;
    call.getData('/app/order/appCreateSingleOrder', {
      OPENID: wx.getStorageSync('openid'),
      DB_GOODS_ID: that.data.payOrderParam.DB_GOODS_ID,
      DB_SPECIFICATION_ID: that.data.payOrderParam.DB_SPECIFICATION_ID,
      NUM: that.data.payOrderParam.NUM,
      DB_TASTE_ID: that.data.payOrderParam.DB_TASTE_ID,
      DB_ADDRESS_ID: that.data.payOrderParam.DB_ADDRESS_ID, // 地址ID 
      O_NOTE: that.data.payOrderParam.O_NOTE, // 备注
      O_DATE: that.data.payOrderParam.O_DATE // 时间
    }, function (res) {
      if (res.state == "success") {
        wx.navigateTo({
          url: '/pages/cart/pay-money/pay-money?money=' + that.data.totalPrice + '&O_PLAY_Z_ID=' + res.O_PLAY_Z_ID
        })
      } else {
        wx.showToast({
          title: res.message,
          icon: "none"
        })
      }
    }, function () {})
  },
  // 2 积分兑换
  handleInterExchage() {
    var that = this;
    call.getData('/app/order/appExchangeCreateOrder', {
      OPENID: wx.getStorageSync('openid'),
      DB_SPECIFICATION_ID: that.data.payOrderParam.DB_SPECIFICATION_ID,
      DB_TASTE_ID: that.data.payOrderParam.DB_TASTE_ID,
      NUM: that.data.payOrderParam.NUM,
      DB_ADDRESS_ID: that.data.payOrderParam.DB_ADDRESS_ID, // 地址ID
      O_NOTE: that.data.payOrderParam.O_NOTE, // 备注
      O_DATE: that.data.payOrderParam.O_DATE // 时间
    }, function (res) {
      if (res.state == "success") {
        if (res.O_PLAY_Z_ID) {
          wx.navigateTo({
            url: '/pages/cart/pay-money/pay-money?money=' + that.data.totalPrice + '&O_PLAY_Z_ID=' + res.O_PLAY_Z_ID
          })
        } else {
          wx.navigateTo({
            url: '/pages/cart/pay-success/pay-success',
          })
        }

      } else {
        wx.showToast({
          title: res.message,
        })
      }
    }, function () {})
  },
  // 5、购物车下单
  handleCart() {
    var that = this;
    call.getData('/app/shopcar/appshopcarCreateOrder', {
      OPENID: wx.getStorageSync('openid'),
      shopcarlist: that.data.shopcarlist, // 购物车组id
      DB_ADDRESS_ID: that.data.payOrderParam.DB_ADDRESS_ID, // 地址ID
      DB_USER_COU_ID: that.data.payOrderParam.DB_USER_COU_ID, // 优惠券ID
      O_NOTE: that.data.payOrderParam.O_NOTE, // 备注
      O_DATE: that.data.payOrderParam.O_DATE // 时间
    }, function (res) {
      if (res.state == "success") {
        wx.navigateTo({
          url: '/pages/cart/pay-money/pay-money?money=' + that.data.totalPrice + '&O_PLAY_Z_ID=' + res.O_PLAY_Z_ID
        })
      }
      console.log(res);
    }, function () {})
  },
  // 获取购物车的订单数据
  getOrderData() {
    var _this = this;
    call.getData('/app/shopcar/appshopcarPrepare', {
      OPENID: wx.getStorageSync('openid'),
      shopcarlist: _this.data.shopcarlist
    }, function (res) {
      wx.hideLoading()
      _this.setData({
        orderData: res,
        totalPrice: res.money,
        goodtotalPrice: res.money
      })
    }, function () {})
  },



  //用户优惠券
  couponList: function () {
    var _this = this;
    call.getData('/app/user/appusercourse', {
      UC_TYPE: 1,
      OPENID: wx.getStorageSync('openid')
    }, function (res) {
      console.log(res);
      if (res.state == "success") {
        var uclist = res.uclist
        var couponList = []
        var couponName = []
        if (uclist.length > 0) {
          for (var i = 0; i < uclist.length; i++) {
            couponList.push(uclist[i])
            couponName.push('满' + uclist[i].COU_MAN + '减' + uclist[i].COU_MONEY)
            if (_this.data.totalPrice >= uclist[i].COU_MAN) {
              DB_USER_COU_ID = uclist[i].DB_USER_COU_ID
              that.setData({
                conIdx: i,
                totalPrice: (_this.data.totalPrice - uclist[i].COU_MONEY).toFixed(2)
              })
            }
          }
        }
        _this.setData({
          couponList: couponList,
          couponName: couponName
        })
      }
    }, function () {})
  },
  //选择优惠券
  bindClassChange(e) {


    var that = this
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var conIdx = e.detail.value
    var couponList = that.data.couponList
    // 先判断优惠券是否能用
    if (that.data.totalPrice < couponList[conIdx].COU_MONEY || that.data.totalPrice < couponList[conIdx].COU_MAN) {
      console.log('优惠券用不了')
      wx.showToast({
        title: '不满足使用条件',
        icon: 'none'
      })
    } else {
      that.setData({
        conIdx: conIdx,
      })
      that.data.payOrderParam.DB_USER_COU_ID = couponList[conIdx].DB_USER_COU_ID
      that.setData({
        totalPrice: (that.data.totalPrice - couponList[conIdx].COU_MONEY).toFixed(2)
      })
    }



    // var conIdx = e.detail.value
    // that.setData({ conIdx: conIdx})
    // var couponList = that.data.couponList
    // that.payOrderParam.DB_USER_COU_ID = couponList[conIdx].DB_USER_COU_ID
    // that.setData({
    //   totalPrice: (that.data.totalPrice - couponList[conIdx].COU_MONEY).toFixed(2)
    // })
  },














  onClose() {
    this.data.show = false
    this.setData({
      show: false
    })
  },
  onClickNav({
    detail = {}
  }) {
    this.setData({
      mainActiveIndex: detail.index || 0
    });
  },

  onClickItem({
    detail = {}
  }) {
    const activeId = this.data.activeId === detail.id ? null : detail.id;
    this.setData({
      activeId
    });
    this.setData({
      ['payOrderParam.O_DATE']: this.data.items[this.data.mainActiveIndex].name + detail.text,
      show: false
    })
  },
  onShow: function () {
    var that = this;
    var shopList = [];

    if (that.data.state == true) {
      return false
    } else {
      console.log('addid', that.data.addId)
      if (that.data.addId == '' || that.data.addId == null || that.data.addId == undefined) {
        console.log('没有添加地址')
        that.initShippingAddress();
      } else {
        that.getAdd()
      }
    }


    // if ("buyNow" == that.data.orderType) {
    //   var buyNowInfoMem = wx.getStorageSync('buyNowInfo');
    //   if (buyNowInfoMem && buyNowInfoMem.shopList) {
    //     shopList = buyNowInfoMem.shopList

    //   }
    // } else if("exchageInter" == that.data.orderType){

    // }else { 
    //   var shopCarInfoMem = wx.getStorageSync('shopCarInfo');
    //   if (shopCarInfoMem && shopCarInfoMem.shopList) {
    //     shopList = shopCarInfoMem.shopList
    //     shopList = shopCarInfoMem.shopList.filter(entity => {
    //       return entity.active;
    //     });
    //   }
    // }
    // that.setData({
    //   goodsList: shopList,
    // });
    this.getDayList()

  },




  getAdd: function () {
    var that = this;
    call.getData('/app/address/appshowoneadd', {
      DB_ADDRESS_ID: that.data.addId
    }, function (res) {
      console.log(res);
      if (res.state == "success") {
        that.setData({
          curAddressData: res.address,
          ['payOrderParam.DB_ADDRESS_ID']: res.address.DB_ADDRESS_ID
        });
      }
      // that.processYunfei();
      console.log(res);
    }, function () {})
    // wx.request({
    //   url: url + '/appaddcontroller/appshowoneadd.do',
    //   data: {
    //     DB_ADDRESS_ID: that.data.addId
    //   },
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   success: function (res) {
    //     console.log('地址详情', res.data)
    //     that.setData({
    //       curAddressData: res.address,
    //       ['payOrderParam.DB_ADDRESS_ID']: res.address.DB_ADDRESS_ID
    //     });
    //   }
    // })
  },








  getDistrictId: function (obj, aaa) {
    if (!obj) {
      return "";
    }
    if (!aaa) {
      return "";
    }
    return aaa;
  },

  createOrder: function (e) {
    wx.showLoading();
    var that = this;
    var loginToken = app.globalData.token // 用户登录 token
    var remark = ""; // 备注信息
    if (e) {
      remark = e.detail.value.remark; // 备注信息
    }
    /* 备注信息必填
    if (e && that.data.orderType == 'buykj' && remark == '') {
      wx.hideLoading();
      wx.showModal({
        title: '提示',
        content: '请添加备注信息！',
        showCancel: false
      })
      return;
    }
    */
    var postData = {
      token: loginToken,
      goodsJsonStr: that.data.goodsJsonStr,
      remark: remark
    };
    if (that.data.isNeedLogistics > 0) {
      if (!that.data.curAddressData) {
        wx.hideLoading();
        wx.showModal({
          title: '友情提示',
          content: '请先设置您的收货地址！',
          showCancel: false
        })
        return;
      }
      if ("buyPT" == that.data.orderType) {
        postData.pingtuanOpenId = that.data.goodsList[0].pingtuanId;
      } else if ("buykj" == that.data.orderType) {
        postData.kjid = that.data.goodsList[0].kjid
      }

      postData.provinceId = that.data.curAddressData.provinceId;
      postData.cityId = that.data.curAddressData.cityId;
      if (that.data.curAddressData.districtId) {
        postData.districtId = that.data.curAddressData.districtId;
      }
      postData.address = that.data.curAddressData.address;
      postData.linkMan = that.data.curAddressData.linkMan;
      postData.mobile = that.data.curAddressData.mobile;
      postData.code = that.data.curAddressData.code;
      postData.expireMinutes = app.siteInfo.closeorder;
    }
    if (that.data.curCoupon) {
      postData.couponId = that.data.curCoupon.id;
    }
    if (!e) {
      postData.calculate = "true";
    }

    wx.request({
      url: app.globalData.urls + '/order/create',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: postData, // 设置请求的 参数
      success: (res) => {
        // console.log(postData)
        wx.hideLoading();
        if (res.data.code != 0) {
          wx.showModal({
            title: '错误',
            content: res.data.msg,
            showCancel: false
          })
          return;
        }

        if (e && "buyNow" != that.data.orderType) {
          // 清空购物车数据
          wx.removeStorageSync('shopCarInfo');
          wx.removeStorageSync('buykjInfo');
          wx.removeStorageSync('PingTuanInfo');
        }
        //console.log(that.data.goodsList[0].price)
        if (!e) {
          var allGoodsAndYunPrice = res.data.data.amountLogistics + res.data.data.amountTotle

          that.setData({
            isNeedLogistics: res.data.data.isNeedLogistics,
            allGoodsPrice: res.data.data.amountTotle,
            allGoodsAndYunPrice: allGoodsAndYunPrice, //res.data.data.amountLogistics + res.data.data.amountTotle,
            yunPrice: res.data.data.amountLogistics
          });
          that.getMyCoupons();
          return;
        }
        // 配置模板消息推送
        var postJsonString = {};
        postJsonString.keyword1 = {
          value: res.data.data.dateAdd,
          color: '#173177'
        }
        postJsonString.keyword2 = {
          value: res.data.data.amountReal + '元',
          color: '#173177'
        }
        postJsonString.keyword3 = {
          value: res.data.data.orderNumber,
          color: '#173177'
        }
        postJsonString.keyword4 = {
          value: '订单已关闭',
          color: '#173177'
        }
        postJsonString.keyword5 = {
          value: '您可以重新下单，请在30分钟内完成支付',
          color: '#173177'
        }
        app.sendTempleMsg(res.data.data.id, -1,
          app.siteInfo.closeorderkey, e.detail.formId,
          'pages/index/index', JSON.stringify(postJsonString));
        postJsonString = {};
        postJsonString.keyword1 = {
          value: '您的订单已发货，请注意查收',
          color: '#173177'
        }
        postJsonString.keyword2 = {
          value: res.data.data.orderNumber,
          color: '#173177'
        }
        postJsonString.keyword3 = {
          value: res.data.data.dateAdd,
          color: '#173177'
        }
        app.sendTempleMsg(res.data.data.id, 2,
          app.siteInfo.deliveryorderkey, e.detail.formId,
          'pages/order-detail/order-detail?id=' + res.data.data.id, JSON.stringify(postJsonString));
        wx.redirectTo({
          url: "/pages/success/success?order=" + res.data.data.orderNumber + "&money=" + res.data.data.amountReal + "&id=" + res.data.data.id
        });
      }
    })
  },

  processYunfei: function () {
    var that = this;
    var goodsList = this.data.goodsList;
    var goodsJsonStr = "[";
    var isNeedLogistics = 0;
    var allGoodsPrice = 0;

    for (let i = 0; i < goodsList.length; i++) {
      let carShopBean = goodsList[i];
      if (carShopBean.logistics) {
        isNeedLogistics = 1;
      }
      allGoodsPrice += carShopBean.price * carShopBean.number;

      var goodsJsonStrTmp = '';
      if (i > 0) {
        goodsJsonStrTmp = ",";
      }


      let inviter_id = 0;
      let inviter_id_storge = wx.getStorageSync('inviter_id_' + carShopBean.goodsId);
      if (inviter_id_storge) {
        inviter_id = inviter_id_storge;
      }


      goodsJsonStrTmp += '{"goodsId":' + carShopBean.goodsId + ',"number":' + carShopBean.number + ',"propertyChildIds":"' + carShopBean.propertyChildIds + '","logisticsType":0, "inviter_id":' + inviter_id + '}';
      goodsJsonStr += goodsJsonStrTmp;


    }
    goodsJsonStr += "]";
    //console.log(goodsJsonStr);
    that.setData({
      isNeedLogistics: isNeedLogistics,
      goodsJsonStr: goodsJsonStr
    });
    that.createOrder();
  },

  getMyCoupons: function () {
    var that = this;
    wx.request({
      url: app.globalData.urls + '/discounts/my',
      data: {
        token: app.globalData.token,
        status: 0
      },
      success: function (res) {
        if (res.data.code == 0) {
          var coupons = res.data.data.filter(entity => {
            return entity.moneyHreshold <= that.data.allGoodsAndYunPrice;
          });
          if (coupons.length > 0) {
            that.setData({
              hasNoCoupons: false,
              coupons: coupons
            });
          }
        }
      }
    })
  },
  bindChangeCoupon: function (e) {
    const selIndex = e.detail.value[0] - 1;
    if (selIndex == -1) {
      this.setData({
        youhuijine: 0,
        curCoupon: null
      });
      return;
    }
    //console.log("selIndex:" + selIndex);
    this.setData({
      youhuijine: this.data.coupons[selIndex].money,
      curCoupon: this.data.coupons[selIndex]
    });
  },























  // 选择时间
  choseTime() {
    this.setData({
      show: true
    })
  },
  // 时间列表
  getDayList() {
    Date.prototype.addDays = function (number) {
      return new Date(this.getTime() + 24 * 60 * 60 * 1000 * number);
    };
    Date.prototype.addMins = function (number) {
      return new Date(this.getTime() + 60 * 1000 * number);
    };
    var dayList = [];
    var item = []
    var dayName = ["今天", "明天", "后天"];
    var weekdayName = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

    var currentTime = new Date();
    for (var i = 0; i < 10; i++) {
      var newDay = currentTime.addDays(i);
      dayList.push({
        year: newDay.getFullYear(),
        month: newDay.getMonth() + 1,
        date: newDay.getDate(),
        day: newDay.getDay()
      });
      var dayStr = newDay.getMonth() + 1 + "月" + newDay.getDate() + "日";
      if (i <= 2) {
        dayStr = dayName[i];
      }
      dayStr += "（" + weekdayName[newDay.getDay()] + "）";
      if (i == 0) {
        item.push({
          text: dayStr,
          name: newDay.getMonth() + 1 + "-" + newDay.getDate() + " ",
          children: this.getCurTime()
        })
      } else {
        item.push({
          text: dayStr,
          name: newDay.getMonth() + 1 + "-" + newDay.getDate() + " ",
          children: this.getTimeRange()
        })
      }
    }
    console.log(item);
    this.setData({
      items: item
    })
  },
  // 获取当前时间
  getCurTime() {
    var currentTime = new Date();
    if (currentTime.getHours() < 8) {
      currentTime.setHours(9, 0);
    }
    var newTime = currentTime;
    var index = 0;
    var str = ''
    // while ( newTime.getDay() == currentTime.getDay() && newTime.getHours() * 100 + newTime.getMinutes() < (24 - 1) * 100 + 59 ) {
    //   var hourStr = (newTime.getHours()) >= 10 ? newTime.getHours().toString() : "0" + newTime.getHours().toString();
    //   var minStr =  newTime.getMinutes() >= 10 ? newTime.getMinutes().toString() : "0" + newTime.getMinutes().toString();
    //   newTime = newTime.addMins(60);
    //   index++;
    //   str += ',' + hourStr
    // }
    // var a = str.slice(1).split(',');

    console.log("当前时间",currentTime.getHours())


    for (var i = currentTime.getHours() + 6 ; i < 24; i++) {
      str += ',' + i
    }
    var a = str.slice(1).split(',');
    console.log(a);

    var time = []
    for (var i = 0; i < a.length; i++) {
      if (i > 0) {
        var t = `${a[i-1]}:00-${a[i]}:00`
        var t1 = {
          text: t,
          id: i
        }
        time.push(t1)
      }
    }
    return time
  },
  // 获取时间区间
  getTimeRange() {
    var str = "";

    for (var i = 9; i < 24; i++) {
      str += ',' + i
    }
    var a = str.slice(1).split(',');

    var time = []
    for (var i = 0; i < a.length; i++) {

      if (i > 0) {
        var t = `${a[i-1]}:00-${a[i]}:00`
        var t1 = {
          text: t,
          id: i
        }
        time.push(t1)
      }
    }
    return time
  }
})