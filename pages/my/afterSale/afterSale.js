var call = require("../../../utils/request.js")
var util = require("../../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ["退款", "换货"],
    reason:"退款",
    imgList:[],
    orderDetail:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({DB_ORDER_ID:options.id})
    this.orderDetai(options.id)
  },
  // /app/order/apporderdatile
  orderDetai(id){
    var _this = this;
    call.getData('/app/order/apporderdatile', {
      DB_ORDER_ID: id
    }, function (res) {
      console.log(res);
      if (res.state == "success") {
        _this.setData({orderDetail:res.order})
      }
    }, function () {})
  },
  ChooseImage() {
    wx.chooseImage({
      count: 4, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths
          })
        }
      }
    });
  },
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  DelImg(e) {
    wx.showModal({
      title: '召唤师',
      content: '确定要删除这段回忆吗？',
      cancelText: '再看看',
      confirmText: '再见',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })
  },
  textareaBInput(e) {
    this.setData({
      textareaBValue: e.detail.value
    })
  },
  // 
  handleAfterSale(){
    var _this = this;
    call.getData('/app/order/apporderaftersales', {
      DB_ORDER_ID: _this.data.DB_ORDER_ID,
      AS_REASON:_this.data.textareaBValue,
      TYPE:'1',
      DB_SHOPCAR_ID:"74e1a3fabc064d249cabc7a7ebf94b71",
      imglist:_this.data.imgList
    }, function (res) {
      console.log(res);
      if (res.state == "success") {

      }
    }, function () {})
  }

  
})