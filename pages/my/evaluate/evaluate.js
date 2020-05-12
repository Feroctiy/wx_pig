var call = require("../../../utils/request.js")
var util = require("../../../utils/util.js")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: 3,
    imgList: [],
    imgs:[],
    remark: '',
    upload_url:app.globalData.url + "/app/comments/appSaveCommentsImg"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      DB_SHOPCAR_ID: options.id
    })

  },
  textareaBInput: function (e) {

    this.setData({
      remark: e.detail.value
    });
  },
  onChange(event) {
    this.setData({
      value: event.detail
    });
  },
  handle() {
    var _this = this;
    call.getData('/app/comments/appsavecomment', {
      OPENID: wx.getStorageSync('openid'),
      DB_SHOPCAR_ID: _this.data.DB_SHOPCAR_ID,
      COM_NOTE: _this.data.remark,
      COM_NUM: _this.data.value,
      imglist: _this.data.imgs
    }, function (res) {
      console.log(res);
      if (res.state == "success") {
        wx.navigateBack({
          delta: 1
        })
      }
    }, function () {})
  },
  ChooseImage() {
    this.setData({
      imgList1: []
    })
    wx.chooseImage({
      count: 3,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success: (res) => {
        console.log(res);
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths),
            imgList1: res.tempFilePaths
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths,
            imgList1: res.tempFilePaths
          })
        }
        
        this.uploadimg({
          url: this.data.upload_url,
          path: this.data.imgList1
        })
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
      title: '删除',
      content: '确定要删除图片吗？',
      cancelText: '取消',
      confirmText: '确认',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          // if (this.data.delList[e.currentTarget.dataset.index]) {
          //   this.delFun(this.data.delList[e.currentTarget.dataset.index].id)
          // }
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })
  },
  uploadimg(data) {
    var that = this,
      i = data.i ? data.i : 0, //当前上传的哪张图片
      success = data.success ? data.success : 0, //上传成功的个数
      fail = data.fail ? data.fail : 0; //上传失败的个数
    wx.uploadFile({
      url: data.url,
      filePath: data.path[i],
      name: 'file', //这里根据自己的实际情况改
      formData: null, //这里是上传图片时一起上传的数据
      success: (resp) => {
        console.log(resp)
        success++; //图片上传成功，图片上传成功的变量+1

        that.setData({
          imgs: that.data.imgs.concat( JSON.parse(resp.data))

        })

        console.log(this.data)

        //这里可能有BUG，失败也会执行这里,所以这里应该是后台返回过来的状态码为成功时，这里的success才+1
      },
      fail: (res) => {
        fail++; //图片上传失败，图片上传失败的变量+1
        console.log('fail:' + i + "fail:" + fail);
      },
      complete: () => {
        console.log(i);
        console.log(that.data)
        i++; //这个图片执行完上传后，开始上传下一张
        if (i == data.path.length) { //当图片传完时，停止调用          
          console.log('执行完毕');
          that.setData({
            uploadImgs: true
          })
          wx.showToast({
            title: "图片上传完成",
            icon: 'none',
            duration: 2000
          })
          console.log('成功：' + success + " 失败：" + fail);
        } else { //若图片还没有传完，则继续调用函数
          console.log(i);
          data.i = i;
          data.success = success;
          data.fail = fail;
          that.uploadimg(data);
        }
      }
    });
  }




})