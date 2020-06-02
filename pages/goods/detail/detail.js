// pages/goods/detail/detail.js
var WxParse = require('../../../components/wxParse/wxParse.js');
const app = getApp();
var call = require("../../../utils/request.js");
var util = require("../../../utils/util.js")
var endTimeSecond = []
var timeOut;

var getUrl = require('../../../utils/url.js')
var url = getUrl.getUrl()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    iconsUrl: getUrl.iconsUrl(),
    imageUrl:getUrl.imageUrl(),
    clock: "秒杀已结束",
    timeState: 2,
    goodsorderType:'1', // 1 立即购买 2 积分兑换 3、原价购买 4 、一健开团






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
     
    this.setData({ id: options.id })
    if(options.SUP_OPENID){
      wx.setStorageSync("SUP_OPENID",options.SUP_OPENID)
    }
    this.getDetail()
  },
  getShareBox() {
    this.setData({
      sharebox: false
    })
  },
  // 商品详情
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
          specSelected: res.goods.specif.length > 0 ? res.goods.specif[0].SPE_NAME + "(" + res.goods.specif[0].DIN_NAME + ")" : "",
          specId: res.goods.specif.length > 0 ? res.goods.specif[0].DB_SPECIFICATION_ID : "",
          smoney: res.goods.specif.length > 0 ? res.goods.specif[0].SPE_MONEY : "",
          store: res.goods.store,
          SPE_INTEGRAL: res.goods.specif.length > 0  ? res.goods.specif[0].SPE_INTEGRAL : "",
          DB_TASTE_ID:res.goods.taste.length > 0 ? res.goods.taste[0].DB_TASTE_ID : "", // 口味id 
          tasteOpt:res.goods.taste.length > 0 ? res.goods.taste[0].TA_NAME : "", // 口味名称
          // SPE_NOWMONEY: res.goods.specif[0].SPE_NOWMONEY,
          // interPrice: res.goods.specif[0].SPE_INTEGRAL + "积分" + "+¥" + res.goods.specif[0].SPE_NOWMONEY
        })


        var currentDate = new Date().getTime()
        if (res.goods.G_TYPE == 2) {
          //距开始时间 
          var startSecond = new Date(res.goods.STARTDATE.replace(/-/g, '/')).getTime() - currentDate
          console.log('startSecond:' + startSecond)
          if (startSecond > 0) {
            _this.setData({
              timeState: 0
            })
            //倒计时
            _this.countdown(startSecond)
            return false
          }
          //距结束时间
          var endSecond = new Date(res.goods.ENDDATE.replace(/-/g, '/')).getTime() - currentDate
          console.log('endSecond:' + endSecond)
          if (endSecond > 0) {
            _this.setData({
              timeState: 1
            })
            //倒计时
            _this.countdown(endSecond)

          } else {
            _this.setData({
              timeState: 2
            })
          }
        }







        var tuanList = res.goods.tuan;
        //团列表
        if (res.goods.tuan && tuanList.length > 0) {
          for (var i = 0; i < tuanList.length; i++) {
            // var formateDate = tuanList[i].TUAN_END_DATE.split(".")
            // console.log('格式化日期', formateDate)
            var endTime = tuanList[i].TUAN_END_DATE
            var strEnd = {
              'time': endTime.replace(/-/g, '/'),
              'timeState': 1
            }
            endTimeSecond.push(strEnd)
          }
          _this.setData({
            endTimeSecond: endTimeSecond
          })
          //结束时间
          _this.countdownEnd()
        }




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
  
  // 一键开团
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
  },

  timeFormat(param) { //小于10的格式化函数
    return param < 10 ? '0' + param : param;
  },
  //结束时间
  countdownEnd: function() {
    var that = this
    let nowTime = new Date().getTime();
    let timeList = that.data.endTimeSecond;
    var totaltime = 0;
    let countDownArr = [];
    timeList.forEach(o => {
      let endTime = new Date(o.time).getTime();
      let obj = null;
      let totalSeconds = (endTime - nowTime) / 1000;
      totaltime = totalSeconds
      // console.log(totalSeconds)
      // 如果活动未结束，对时间进行处理
      if (totalSeconds > 0) {
        // 获取天、时、分、秒
        let day = parseInt(totalSeconds / (60 * 60 * 24));
        let hou = parseInt(totalSeconds % (60 * 60 * 24) / 3600);
        let min = parseInt(totalSeconds % (60 * 60 * 24) % 3600 / 60);
        let sec = parseInt(totalSeconds % (60 * 60 * 24) % 3600 % 60);
        obj = {
          day: that.timeFormat(day),
          hou: that.timeFormat(hou),
          min: that.timeFormat(min),
          sec: that.timeFormat(sec),
          state: 0
        }
      } else { //活动已结束，全部设置为'00'
        obj = {
          day: '00',
          hou: '00',
          min: '00',
          sec: '00',
          state: 1
        }
      }
      countDownArr.push(obj);
    })
    // 渲染，然后每隔一秒执行一次倒计时函数
    that.setData({
      endCountDownList: countDownArr
    })
    // console.log('endCountDownList', that.data.endCountDownList)
    timeOut = setTimeout(function() {
      that.countdownEnd();
    }, 1000)
  },
  groupDetails: function(e) {
    console.log(e)
    var that = this
    var TUAN_ID = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/group/groupDetails/groupDetails?TUAN_ID=' + TUAN_ID + '&DB_GOODS_ID=' + that.data.id,
    })
  },
  //秒杀倒计时
  countdown: function (duringMs) {
    var that = this
    console.log(duringMs)
    // 渲染倒计时时钟
    that.setData({
      clock: util.fromatCountdown(duringMs) //格式化时间
    });
    if (duringMs <= 0) {
      that.setData({
        clock: "秒杀已结束",
      });
      // timeout则跳出递归
      return;
    }
    //settimeout实现倒计时效果
    timeOut = setTimeout(function () {
      duringMs -= 1000;
      that.countdown(duringMs);
    }, 1000)
  },



  /**
   * 操作按钮 
   * goodsorderType 1 立即购买 2 积分兑换 3、原价购买 4 、一健开团 5 加入购物车
   */
  submit(e) { 
    this.setData({ goodsorderType: e.currentTarget.dataset.goodsordertype, showSpec: true })
  },
  // 商品详情框 - 确认按钮
  handleSub() {
    var _this = this;
    var orderParam = {
      DB_GOODS_ID: _this.data.id, // 商品id
      DB_SPECIFICATION_ID: _this.data.specId, // 选择的规格
      NUM: _this.data.num, // 商品的数量
      DB_TASTE_ID:_this.data.DB_TASTE_ID // 选择的口味id
    }
    if(_this.data.goodsorderType == '5'){
      call.getData('/app/shopcar/appaddshopcar', {
        DB_SPECIFICATION_ID: _this.data.specId,
        DB_TASTE_ID:_this.data.DB_TASTE_ID,
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
      return;
    }
    wx.setStorageSync('orderParam', orderParam)
    wx.navigateTo({
      url: '/pages/cart/pay-order/pay-order?orderType='+_this.data.goodsorderType,
    })
    // if (this.data.type == 1) {
    //   this.setData({
    //     showSpec: false
    //   })
    // } else if (this.data.type == 2) {
    //   // 立即购买
    //   console.log("立即购买")
    //   var orderParam = {
    //     detail: _this.data.detail,
    //     specSelected: _this.data.specSelected,
    //     num: _this.data.num,
    //     amoney: _this.data.smoney,
    //     specId: _this.data.specId
    //   }
    //   wx.setStorageSync('orderParam', orderParam)
    //   wx.navigateTo({
    //     url: '/pages/cart/pay-order/pay-order?orderType=buyNow',
    //   })
    // } else if (this.data.type == 3) {
    //   // 加入购物车
    //   console.log("加入购物车", _this)

    
    // } else if (this.data.type == 4) {
    //   var orderParam = {
    //     detail: _this.data.detail,
    //     specSelected: _this.data.specSelected,
    //     num: _this.data.num,
    //     amoney: _this.data.smoney,
    //     specId: _this.data.specId,
    //     SPE_INTEGRAL: _this.data.SPE_INTEGRAL,
    //     SPE_NOWMONEY: _this.data.SPE_NOWMONEY
    //   }
    //   wx.setStorageSync('orderParam', orderParam)
    //   wx.navigateTo({
    //     url: '/pages/cart/pay-order/pay-order?orderType=exchageInter',
    //   })
    // } else if( this.data.type == 5 ){
    //   // 一键开团
    //   var orderParam = {
    //     detail: _this.data.detail,
    //     specSelected: _this.data.specSelected,
    //     num: _this.data.num,
    //     amoney: _this.data.smoney,
    //     specId: _this.data.specId,
    //     SPE_INTEGRAL: _this.data.SPE_INTEGRAL,
    //     SPE_NOWMONEY: _this.data.SPE_NOWMONEY,
    //     DB_TASTE_ID:_this.data.DB_TASTE_ID, // 口味id
    //     tasteOpt:_this.data.tasteOpt, // 口味名称
    //   }
    //   wx.setStorageSync('orderParam', orderParam)
    //   wx.navigateTo({
    //     url: '/pages/cart/pay-order/pay-order?orderType=pintuan',
    //   })

    // }
  },
  onUnload: function() {
    clearTimeout(timeOut)
  },
  onShareAppMessage: function(res) {
    console.log(this.data.id);
    if (res.from === 'button') { 
      console.log(res);
    }
    return {
      title: "",
      path: "/pages/goods/detail/detail?id=" + this.data.id + "&SUP_OPENID="+wx.getStorageSync('openid')
    }
  },














})