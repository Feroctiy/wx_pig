var app = getApp();
//项目URL相同部分，减轻代码量，同时方便项目迁移
//这里因为我是本地调试，所以host不规范，实际上应该是你备案的域名信息
// var host = 'https://api.tyy16888.com';
var host = 'https://lxk.jiafh.com/bake-workshop';
// var host = 'http://21n61u9161.51mypc.cn/';
/**
 * POST请求，
 * URL：接口
 * postData：参数，json类型
 * doSuccess：成功的回调函数
 * doFail：失败的回调函数
 */
function request(url, postData, doSuccess, doFail) {
  wx.request({
    url: host + url,
    data: postData,
    method: 'POST',
    success: function(res) {
      // if (res.data.status && res.data.status == '999' || res.data.status && res.data.status == '998') {
      //   wx.showToast({
      //     title: "登录已失效,请重新登录",
      //     icon: 'none',
      //     duration: 2000
      //   })
      //   getApp().login();
      //   return;
      // }
      // if (res.data.code && res.data.code == '401') {
      //   wx.showToast({
      //     title: "登录已失效,请重新登录",
      //     icon: 'none',
      //     duration: 2000
      //   });
      //   getApp().login();
      //   return;
      // }
      doSuccess(res.data);
    },
    fail: function() {
      doFail();
    },
  })
}

//GET请求，不需传参，直接URL调用，
function getData(url, param,doSuccess, doFail) {
  wx.request({
    url: host + url,
    data: param,
    header: {
      "content-type": "application/json;charset=UTF-8"
    },
    method: 'GET',
    success: function(res) {
      console.log(res);
      doSuccess(res.data);
    },
    fail: function() {
      doFail();
    },
  })
}

/**
 * module.exports用来导出代码
 * js文件中通过var call = require("../util/request.js")  加载
 * 在引入引入文件的时候"  "里面的内容通过../../../这种类型，小程序的编译器会自动提示，因为你可能
 * 项目目录不止一级，不同的js文件对应的工具类的位置不一样
 */
module.exports.request = request;
module.exports.getData = getData;