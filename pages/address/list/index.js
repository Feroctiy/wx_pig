// pages/address/list/index.js

const app = getApp();
var call = require("../../../utils/request.js");
var Utils = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    this.getAddressList();
  }, 
   
 
  toChoose: function(e) {
    var that = this
    var id = e.currentTarget.dataset.id
    // if (back == 0) {
    //   console.log('不返回')
    // } else {
      var pages = getCurrentPages(); // 获取页面栈
      var currPage = pages[pages.length - 1]; // 当前页面
      var prevPage = pages[pages.length - 2]; // 上一个页面
      prevPage.setData({
        state: false,
        addId: id
      })
      wx.navigateBack({
        delta: 1,
      })
    // }
  },
  /**
   * 添加地址
   */
  addAddess: function () {
    wx.navigateTo({
      url: '/pages/address/add/index',
    })
  },
  // 获取地址列表
  getAddressList(){
    var _this = this;
    call.getData('/app/address/appuseraddlist', { 
      OPENID: wx.getStorageSync('openid'), 
    }, function (res) {
      console.log(res);
      if (res.state == "success") { 
        _this.setData({
          addressList: res.address
        })
      }
    }, function () {})
  },
  //删除地址/app/address/appuserdeleteaddress
  delAddress(e){
    var that = this
    var num = e.currentTarget.dataset.id
    console.log(num)
    wx.showModal({
      title: '是否要删除地址？',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          that.setData({
            hiddenLoading: false,
          })
          call.getData('/app/address/appuserdeleteaddress', { 
            OPENID: wx.getStorageSync('openid'),
              DB_ADDRESS_ID: num 
          }, function (res) {
            console.log(res);
            if (res.state == "success") { 
              that.getAddressList();
            }
          }, function () {})
          
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  /**
   * 添加地址
   */
  addAddess: function () {
    wx.navigateTo({
      url: '/pages/address/add/index?type=add',
    })
  },

  editAddress:function(e){
    console.log(e)
    wx.navigateTo({
      url: '/pages/address/add/index?type=edit&id=' + e.currentTarget.dataset.id
    })
  },
  defaultAddress:function(e){
    var that = this
    call.getData('/app/address/appsetdefaultaddress', {
      OPENID: wx.getStorageSync('openid'),
      DB_ADDRESS_ID: e.currentTarget.dataset.id
    }, function (res) {
      if (res.state == "success") {
        Utils.showMessage("设置成功");
        that.getAddressList();
      }
    }, function () { })

  }

})