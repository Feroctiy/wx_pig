// pages/address/list/index.js

const app = getApp();
var call = require("../../../utils/request.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList: [
      {
        "addressId": "03792f59034248fb9181a96886819a12",
        "openid": "oc5cv4qjauhvztyq_tdemwpnvkd0",
        "name": "吴系挂",
        "phone": "13993282301",
        "provice": "陕西省",
        "city": "西安市",
        "region": "雁塔区",
        "add": "明德二路城南翡翠",
        "state": 1,
        "longitude": "108.983840",
        "latitude": "34.236310",
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    this.getAddressList();
  }, 
  /**
   * 添加地址
   */
  addAddess: function () {
    wx.navigateTo({
      url: '/pages/address/add/index?type="add"',
    })
  },

  editAddress:function(e){
    console.log(e)
    wx.navigateTo({
      url: '/pages/address/add/index?type="edit"',
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
  }

})