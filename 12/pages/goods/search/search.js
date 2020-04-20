// pages/search/search.js

const app = getApp();
var openid
var Refresh = 0
var inputVal
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    state: false,
    stateFocus: false,
    history: [],
    isSearch: true
  },

  navBack: function () {
    wx.navigateBack({
      delta: 1,
    })
  },
  onLoad: function (options) {
    var that = this 
    //获取存储信息
    wx.getStorage({
      key: 'openid',
      success: function (res) { 
        openid = res.data
        that.getHis()
      }
    })
  },
  getinputVal: function (e) {
    var that = this
    inputVal = e.detail.value
    that.setData({
      inputVal: inputVal,
      stateFocus: true
    })
    if (that.data.stateFocus == true) {
      that.setData({
        list: [],
        state: false
      })
    } else {
      that.setData({
        state: true
      })
    }
    console.log(inputVal)
  },
  search: function (e) {
    var that = this
    console.log('inputVal', inputVal)
    if (inputVal == '' || inputVal == undefined) {
      wx.showToast({
        title: '请输入搜索内容',
        icon: 'loading',
        duration: 2000
      })
    } else {
      that.setData({
        hiddenLoading: false,
        list: []
      })
      Refresh = 0
      that.getSearch()
    }
  },

  // 商品列表
  getSearch: function () {
    var that = this
    wx.request({
      url: url + '/appwxgoodscontroller/appgoodslist.do',
      data: {
        INPUT: inputVal,
        OPENID: openid,
        PULLNUM: Refresh,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log('列表 ', res.data)
        if (res.data.length != 0) {
          var list = that.data.list
          for (var j = 0; j < res.data.length; j++) {
            list.push(res.data[j])
          }
          that.setData({
            list: list,
            state: true,
          })
        } else {
          console.log('已加载完成')
        }
        that.setData({
          stateFocus: false,
          isSearch: false
        })
        that.getHis()
      },
      complete: function () {
        wx.hideLoading()
        that.setData({
          hiddenLoading: true,
        })
      }
    })
  },
  getHis: function () {
    var that = this
    wx.request({
      url: url + '/appwxgoodscontroller/appsearlist.do',
      data: {
        OPENID: openid,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log('历史搜索 ', res.data)
        that.setData({
          history: res.data,
        })
      },
      complete: function () {
        wx.hideLoading()
        that.setData({
          hiddenLoading: true,
        })
      }
    })
  },
  // 历史纪录
  clickHis: function (e) {
    var that = this
    inputVal = e.currentTarget.dataset.name
    that.setData({
      inputVal: inputVal
    })
    console.log('inputVal', inputVal)
    if (inputVal == '' || inputVal == undefined) {
      wx.showToast({
        title: '请输入搜索内容',
        icon: 'loading',
        duration: 2000
      })
    } else {
      that.setData({
        hiddenLoading: false,
        list: []
      })
      Refresh = 0
      that.getSearch()
    }
  },
  todetail: function (e) {
    console.log(e.currentTarget.dataset.id)
    var index = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../shopDetail/shopDetail?index=' + index + '&one=1',
    })
  },
  // 删除历史记录
  toDel: function () {
    var that = this
    wx.request({
      url: url + '/appwxgoodscontroller/appuserdelete.do',
      data: {
        OPENID: openid,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log('删除返回的数据', res.data)
        that.setData({
          history: [],
        })
      },
      complete: function () {
        wx.hideLoading()
        that.setData({
          hiddenLoading: true,
        })
      }
    })
  }
})