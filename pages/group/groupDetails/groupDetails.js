// pages/groupDetails/groupDetails.js
var getUrl = require('../../../utils/url.js')
var call = require("../../../utils/request.js");
var url = getUrl.getUrl()
var date = require('../../../utils/util.js');
var DB_GOODS_ID = '' //商品id
var DB_SPECIFICATION_ID = '' //规格id
var TUAN_ID = ''
var timeOut = ''
var OPENID = '' //用户openid
var supOpenid = '' //上级openid
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showSpec:false,
    tabSize: 0,
    tabSize1: 0,
    iconsUrl: getUrl.iconsUrl(),
    layerState: true,
    shareType: 2,
    num: 1,
    SPE_NAME: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    DB_GOODS_ID = options.DB_GOODS_ID
    TUAN_ID = options.TUAN_ID
    //是否有上级id
    if (JSON.stringify(options) == "{}") {
      supOpenid = ''
    } else {
      supOpenid = options.supOpenid
      getUrl.userLogin(supOpenid)
    }
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        OPENID = res.data
      },
    })
    that.getDetail()
    that.proDetails();
    that.tuanDetails()
  },
  // 商品详情
  getDetail: function () {
    var _this = this;
    call.getData('/app/goods/appgoodsdatile', {
      DB_GOODS_ID: DB_GOODS_ID,
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
      }
    }, function () {})
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











  tuanDetails: function () {
    var that = this
    wx.request({
      url: url + '/app/order/appTuanDetail',
      data: {
        TUAN_ID: TUAN_ID,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log('团详情', res.data)
        wx.hideLoading()
        if (res.data.state == 'success') {
          var tuan = res.data.tuan
          var tuanOrder = res.data.Tuan_Order_List
          that.setData({
            tuan: tuan,
            tuanOrder: tuanOrder
          })
          console.log('倒计时')
          var currentDate = new Date().getTime()
          var TUAN_END_DATE = tuan.TUAN_END_DATE
          var endTime = new Date(TUAN_END_DATE.replace(/-/g, '/')).getTime()
          console.log('时间戳', endTime, currentDate)
          var total_second = endTime - currentDate
          that.countdown(total_second)
          for (var i = 0; i < tuanOrder.length; i++) {
            if (OPENID === tuanOrder[i].O_OPENID) {
              that.setData({ shareType: 1 })
              return false;
            } else {
              that.setData({ shareType: 2 })
            }
          }

        } else {
          wx.showToast({ title: res.data.message, icon: 'none' })
        }
      },
      complete: function () {
        wx.hideLoading()
      }
    })
  },
  goIndex: function () {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  //商品详情
  proDetails: function () {
    var that = this
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        wx.request({
          url: url + '/app/goods/appgoodsdatile',
          data: {
            OPENID: res.data,
            DB_GOODS_ID: DB_GOODS_ID,
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            console.log(res.data)
            wx.hideLoading()
            if (res.data.state == 'success') {
              var goods = res.data.goods
              var specList = goods.specif
              that.setData({
                goods: goods,
                specList: specList,
              })
              //默认规格
              if (specList.length > 0) {
                DB_SPECIFICATION_ID = specList[0].DB_SPECIFICATION_ID
                var SPE_INVENTORY = specList[0].SPE_INVENTORY
                var SPE_MONEY = specList[0].SPE_MONEY
                var SPE_NAME = specList[0].SPE_NAME
                var SPE_NOWMONEY = specList[0].SPE_NOWMONEY
                that.setData({
                  currentSpec: DB_SPECIFICATION_ID,
                  SPE_INVENTORY: SPE_INVENTORY,
                  SPE_MONEY: SPE_MONEY,
                  SPE_NAME: SPE_NAME,
                  SPE_NOWMONEY: SPE_NOWMONEY
                })
              }
            } else {
              wx.showToast({ title: res.data.message, icon: 'none' })
            }
          },
          complete: function () {
            wx.hideLoading()
          }
        })
      },
    })

  },
  // 我要参团
  layerState: function (e) {
    console.log(e.currentTarget.dataset.state)
    var that = this
    var operaState = e.currentTarget.dataset.state
    that.setData({
      showSpec: !that.data.showSpec,
      num: 1
    })
    if (operaState !== '') {
      that.setData({
        operaState: operaState
      })
    }
  },
  /* 点击减号 */
  bindMinus: function (e) {
    var that = this
    var num = that.data.num
    // 如果大于1时，才可以减 
    if (num > 1) {
      num--;
    }
    // 将数值与状态写回 
    that.setData({
      num: num,
    });
  },
  /* 点击加号 */
  bindPlus: function (e) {
    var that = this
    var num = that.data.num
    num++;
    // 将数值与状态写回 
    that.setData({
      num: num,
    });
  },
  //选择规格
  getSpecId: function (e) {
    var that = this
    DB_SPECIFICATION_ID = e.currentTarget.dataset.id
    var SPE_INVENTORY = e.currentTarget.dataset.num
    var SPE_MONEY = e.currentTarget.dataset.price
    var SPE_NAME = e.currentTarget.dataset.name
    var SPE_NOWMONEY = e.currentTarget.dataset.nprice
    that.setData({
      currentSpec: DB_SPECIFICATION_ID,
      SPE_INVENTORY: SPE_INVENTORY,
      SPE_MONEY: SPE_MONEY,
      SPE_NOWMONEY: SPE_NOWMONEY,
      SPE_NAME: SPE_NAME
    })

  },
  //参团
  createGroupOrder: function () {
    var that = this
    if (DB_SPECIFICATION_ID == '') {
      wx.showToast({
        title: '请选择规格',
        icon: 'none'
      })
      return false;
    }
    that.setData({
      layerState: true,
    })
    wx.redirectTo({
      url: '../createGroupOrder/createGroupOrder?DB_GOODS_ID=' + DB_GOODS_ID + '&DB_SPECIFICATION_ID=' + DB_SPECIFICATION_ID + '&NUM=' + that.data.num + '&TUAN_ID=' + TUAN_ID,
    })
  },
  handleSub(){
    var _this = this;
    var orderParam = {
      DB_GOODS_ID: DB_GOODS_ID, // 商品id
      DB_SPECIFICATION_ID: _this.data.specId, // 选择的规格
      NUM: _this.data.num, // 商品的数量
      DB_TASTE_ID:_this.data.DB_TASTE_ID, // 选择的口味id
      TUAN_ID:TUAN_ID
    }
    wx.setStorageSync('orderParam', orderParam)
    wx.navigateTo({
      url: '/pages/cart/pay-order/pay-order?orderType=4',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearTimeout(timeOut)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //倒计时
  countdown: function (duringMs) {
    var that = this
    // 渲染倒计时时钟
    that.setData({
      clock: date.fromatCountdown(duringMs) //格式化时间
    });
    console.log(that.data.clock, duringMs)
    if (duringMs <= 0) {
      that.setData({
        clock: "拼团已结束",
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
})