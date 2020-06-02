// pages/widthDraw/widthDraw.js
var getUrl = require('../../../utils/url.js')
var url = getUrl.getUrl()
var DB_BANK_CARD_ID = '' //银行卡id
var MONEY = 0 //提现金额
var STATE = 1
Page({

  /**
   * 页面的初始数据
   */
  data: {
    iconsUrl: getUrl.iconsUrl(),
    STATE: 1,
    cardList: [],
    currentCard: ''
  },
  //提现方式
  withType: function(e) {
    var that = this
    STATE = e.currentTarget.dataset.state * 1
    that.setData({
      STATE: STATE,
      currentCard: ''
    })
    if (STATE == 2) {
      //银行卡列表
      that.cardList()
    }
  },
  //全部提现
  getAllBalance: function(e) {
    var that = this
    MONEY = e.currentTarget.dataset.id
    that.setData({
      iptValue: MONEY
    })
  },
  //选择银行卡
  getCardId: function(e) {
    var that = this
    DB_BANK_CARD_ID = e.currentTarget.dataset.id
    that.setData({
      currentCard: DB_BANK_CARD_ID
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    that.userInfo()
  },
  //用户信息
  userInfo: function() {
    var that = this
    wx.getStorage({
      key: 'openid',
      success: function(res) {
        wx.request({
          url: url + '/app/user/appgetuser',
          data: {
            OPENID: res.data
          },
          header: {
            'content-type': 'application/json'
          },
          success: function(res) {
            console.log(res.data)
            if (res.data.state == 'success') {
              that.setData({
                userInfo: res.data.user
              })
            } else {
              wx.showToast({
                title: res.data.message,
                icon: 'none'
              });
            }

          }
        })
      },
    })
  },
  //银行卡列表
  cardList: function() {
    var that = this
    wx.getStorage({
      key: 'openid',
      success: function(res) {
        wx.request({
          url: url + '/app/user/backcardlist',
          data: {
            OPENID: res.data
          },
          header: {
            'content-type': 'application/json'
          },
          success: function(res) {
            console.log(res.data)
            if (res.data.state == 'success') {
              var cardList = res.data.backcar
              var lastNumList = []
              if (cardList.length > 0) {
                for (var i = 0; i < cardList.length; i++) {
                  var cardId = cardList[i].BC_CARD_NUM
                  if (cardId !== '' && cardId !== null) {
                    var lastnum = cardId.replace(/\s|\xA0/g, "")
                    lastnum = lastnum.substring(lastnum.length - 4)
                    lastNumList.push(lastnum)
                  }
                }
              }
              that.setData({
                cardList: cardList,
                lastNumList: lastNumList
              })
              
            } else {
              wx.showToast({
                title: res.data.message,
                icon: 'none'
              });
            }

          }
        })
      },
    })
  },
  addBankCard: function() {
    wx.navigateTo({
      url: '../addBankCard/addBankCard',
    })
  },
  getMoney:function(e){
    var that = this
    MONEY = e.detail.value
    that.setData({
      iptValue: MONEY
    })
  },
  //提现
  widthDraw: function () {
    var that = this
    if (MONEY == '' || MONEY == 0){
      wx.showToast({
        title: '提现金额为空',
        icon:'none'
      })
      return false;
    }
    if (STATE == 2 && DB_BANK_CARD_ID == '') {
      wx.showToast({
        title: '请选择银行卡',
        icon: 'none'
      })
      return false;
    }
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        wx.request({
          url: url + '/app/user/appuserwithdrawal',
          data: {
            OPENID: res.data,
            DB_BANK_CARD_ID: DB_BANK_CARD_ID,
            MONEY: MONEY,
            STATE: STATE
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            console.log(res.data)
            if (res.data.state == 'success') {
              wx.redirectTo({
                url: '../withDrawSuccess/withDrawSuccess',
              })
            } else {
              wx.showToast({
                title: res.data.message,
                icon: 'none'
              });
            }

          }
        })
      },
    })
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
    var that = this
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1]; //当前页面
    console.log(currPage)
    if (currPage.data.STATE == 1) {
      console.log('..............')
    } else {
      that.cardList()
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    MONEY = 0 //提现金额
    STATE = 1
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})