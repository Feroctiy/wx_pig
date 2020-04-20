var app = getApp()
var call = require("../../../utils/request.js")

Page({
  data: {
    goodsList: [],
    orderData: {},
    isNeedLogistics: 0, // 是否需要物流信息
    allGoodsPrice: 0,
    yunPrice: 0,
    allGoodsAndYunPrice: 0,
    goodsJsonStr: "",

    hasNoCoupons: true,
    coupons: [],
    youhuijine: 0, //优惠券金额
    curCoupon: null, // 当前选择使用的优惠券


    orderType: "", //订单类型，购物车下单或立即支付下单，默认是购物车，
    // 下单参数
    payOrderParam: {
      shopcarlist: "", // 购物车组id
      DB_ADDRESS_ID: "", // 地址ID
      DB_USER_COU_ID: "", // 优惠券ID
      O_NOTE: "", // 备注
      O_DATE: "" // 时间
    },
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
  onClose() {
    this.data.show = false
    this.setData({
      show: false
    })
  },
  onClickNav({
    detail = {}
  }) {
    console.log("*******", detail);
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
      } else {
        that.getAdd()
      }
    }


    //立即购买下单
    if ("buyNow" == that.data.orderType) {
      var buyNowInfoMem = wx.getStorageSync('buyNowInfo');
      if (buyNowInfoMem && buyNowInfoMem.shopList) {
        shopList = buyNowInfoMem.shopList

      }
    } else {
      //购物车下单
      var shopCarInfoMem = wx.getStorageSync('shopCarInfo');
      if (shopCarInfoMem && shopCarInfoMem.shopList) {
        // shopList = shopCarInfoMem.shopList
        shopList = shopCarInfoMem.shopList.filter(entity => {
          return entity.active;
        });
      }
    }
    that.setData({
      goodsList: shopList,
    });
    this.getDayList()

  },

  onLoad: function (e) {
    console.log(e);
    var that = this;
    //显示收货地址标识
    that.setData({
      isNeedLogistics: 1,
      orderType: e.orderType,
      // shopcarlist:e.shoppingcartlist.split(',')
    });
    that.initShippingAddress();
    if (e.orderType == "buyNow") {
      var buyNowInfoMem = wx.getStorageSync('orderParam');
      that.setData({
        buyNowInfoMem: buyNowInfoMem,
        "orderData.money": buyNowInfoMem.num * buyNowInfoMem.amoney
      })
    } else {
      this.getOrderData();
    }

  },
  // 获取确认订单的数据
  getOrderData() {
    // /app/shopcar/appshopcarPrepare
    var _this = this;
    call.getData('/app/shopcar/appshopcarPrepare', {
      OPENID: wx.getStorageSync('openid'),
      shopcarlist: _this.data.shopcarlist
    }, function (res) {
      wx.hideLoading()
      console.log(res);

      _this.setData({
        orderData: res
      })


    }, function () {})

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
  // 获取默认的收货地址
  initShippingAddress: function () {
    var that = this;
    call.getData('/app/address/appuserdefaultadd', {
      OPENID: wx.getStorageSync('openid')
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
    // /app/address/appuserdefaultadd
    // wx.request({
    //   url: app.globalData.urls + '/user/shipping-address/default',
    //   data: {
    //     token: app.globalData.token
    //   },
    //   success: (res) => {
    //     if (res.data.code == 0) {
    //       that.setData({
    //         curAddressData: res.data.data
    //       });
    //     } else {
    //       that.setData({
    //         curAddressData: null
    //       });
    //     }
    //     that.processYunfei();
    //   }
    // })
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
  addAddress: function () {
    wx.navigateTo({
      url: "/pages/address/add/index"
    })
  },
  selectAddress: function () {
    wx.navigateTo({
      url: "/pages/address/list/index?back=1"
    })
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

  // 提交订单  /app/shopcar/appshopcarCreateOrder
  onSubmit() {
    var that = this;
    if ("buyNow" == that.data.orderType) {
      // 立即购买
      call.getData('/app/order/appGoodsCreateOrder', {
        OPENID: wx.getStorageSync('openid'),
        DB_SPECIFICATION_ID: that.data.buyNowInfoMem.specId,
        NUM: that.data.buyNowInfoMem.num,
        DB_ADDRESS_ID: that.data.payOrderParam.DB_ADDRESS_ID, // 地址ID
        DB_USER_COU_ID: that.data.payOrderParam.DB_USER_COU_ID, // 优惠券ID
        O_NOTE: that.data.payOrderParam.O_NOTE, // 备注
        O_DATE: that.data.payOrderParam.O_DATE // 时间
      }, function (res) {
        if (res.state == "success") {
          console.log(res);
          wx.navigateTo({
            url: '/pages/cart/pay-money/pay-money?money=' + that.data.buyNowInfoMem.amoney + '&O_PLAY_Z_ID=' + res.O_PLAY_Z_ID
          })
        }

      }, function () {})
    } else {
      //购物车下单
      call.getData('/app/shopcar/appshopcarCreateOrder', {
        OPENID: wx.getStorageSync('openid'),
        shopcarlist: that.data.payOrderParam.shopcarlist || ["0bbc5a2b0cbb412890cfb772ab14e432", "006fe523d19048a3bfbee41b242e71a7"], // 购物车组id
        DB_ADDRESS_ID: that.data.payOrderParam.DB_ADDRESS_ID || "4e6b3154039c49219ae57f0c581dc0f3", // 地址ID
        DB_USER_COU_ID: that.data.payOrderParam.DB_USER_COU_ID, // 优惠券ID
        O_NOTE: that.data.payOrderParam.O_NOTE, // 备注
        O_DATE: that.data.payOrderParam.O_DATE || "04-18 10:00-12:00" // 时间
      }, function (res) {
        if (res.state == "success") {

        }
        console.log(res);
      }, function () {})

    }
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
    while (
      newTime.getDay() == currentTime.getDay() &&
      newTime.getHours() * 100 + newTime.getMinutes() <
      (24 - 1) * 100 + 59
    ) {
      var hourStr =
        newTime.getHours() >= 10 ?
        newTime.getHours().toString() :
        "0" + newTime.getHours().toString();
      var minStr =
        newTime.getMinutes() >= 10 ?
        newTime.getMinutes().toString() :
        "0" + newTime.getMinutes().toString();
      newTime = newTime.addMins(60);
      index++;
      str += ',' + hourStr
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
    var str = ""
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