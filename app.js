//app.js
//获取api接口文档
const api = require('utils/api');
var token;
var markStatu;
App({
  data: ({
    //userId: {},
    cb_back: null,
  }),
  onLaunch: function (options) {
    console.log("onLaunch")
    console.log(options)
    // if(options.scene == 1011) {
    //   markStatu='open';
    //   this.globalData.markStatu = markStatu
    //   console.log(this.globalData.markStatu)
    // }
    //console.log(options)
    //调用API从本地缓存中获取数据
    var that = this;
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs);

    // 微信登入,读取缓存数据token
    token = wx.getStorageSync('token') || null;
    console.log(token)
    // 没有缓存数据
    if (token == null) {
      that.login()
    } else {
      wx.checkSession({
        // 有缓存并验证成功
        success: function () {
          console.log("走缓存")
        },
        //有缓存但验证不成功
        fail: function () {
          console.log("缓存不成功,重新登录")
          that.login();
        }
      })
    }
  },
  onShow: function (options) {
    var that = this;
    var openId = wx.getStorageSync('openId');
    console.log(openId)
    if(openId) {
      console.log("onShow")
      // 再次打开小程序,读取缓存数据token
      token = wx.getStorageSync('token') || null;
      // 没有缓存数据
      if (token == null) {
        that.login()
      } else {
        
        wx.checkSession({
          // 有缓存并验证成功
          success: function () {
            //console.log("onShow走缓存")
            let systemVersion = that.globalData.systemVersion;
            wx.request({
              url: api.getCustomerStatus,
              data: {
                openId: openId,
                systemVersion: systemVersion
                //unionId: unionId,
              },
              success: function (res) {
                var res = res.data;
                if (res.code == 0) {
                  // console.log(res.data.statusStr)
                  wx.setStorageSync('customerStatus', res.data.statusStr);
                }
              }
            })
          },
          //有缓存但验证不成功
          fail: function () {
            console.log("onShowLogin")
            // console.log("onShow缓存不成功,重新登录")
            that.login();
          }
        })
      }



    }
    
  },
  login: function (callback) {
    var that = this;
    //登录接口
    console.log('11111111')
    wx.login({
      success: function (res) {
        var code = res.code;
        console.log("登录成功")
        //获取用户信息接口
        that.getUserInfo(function (res) {
         console.log("调用用户信息成功")
          var encryptedData = res.encryptedData
          var iv = res.iv
          let systemVersion = that.globalData.systemVersion;
          //登录请求
          wx.request({
            url: api.login,
            method: "POST",
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: {
              code: code,
              encryptedData: encryptedData,
              iv: iv,
              systemVersion: systemVersion
            },
            success: function (s) {
              console.log('登录请求成功')
              var loginData = s.data.data;
              var openId = loginData.openId
              //console.log(loginData.openId)
              console.log(loginData)
              wx.setStorageSync('token', loginData.sessionKey);
              wx.setStorageSync('openId', loginData.openId);
              wx.setStorageSync('unionId', loginData.unionId);
              wx.setStorageSync('customerStatus', loginData.customerStatus);
              var res_info={
                openId: loginData.openId,
                unionId: loginData.unionId,
                customerStatus: loginData.customerStatus
              }
              //console.log(getCurrentPages()[0])
              if (getCurrentPages().length != 0) {
                getCurrentPages()[getCurrentPages().length - 1].onLoad()
              }
              //console.log(res_info)
              typeof callback == "function" && callback(res_info);            
            },
            fail:function(res){
              console.log(res)
            }
          })
        })
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
 
  //调用用户信息函数
  getUserInfo: function (cb) {
    var that = this;
    that.data.cb_back = cb;
    //调用用户信息接口
    wx.getUserInfo({
      withCredentials: true,
      success: function (res) {
        // console.log('调用用户信息借口，成功')
        if (res.userInfo){
          typeof cb == "function" && cb(res);
        }else {
          console.log("拒绝1")
         // that.setopen();
        }

      },
      fail: function (res) {
        console.log("拒绝2")
        that.setopen();
      }
    })
  },

  //授权失败,再次调用用户信息
  setopen: function () {
    var that = this;
    wx.showModal({
      title: "警告",
      content: "您点击了拒绝授权,将无法正常显示个人信息,点击确定重新获取授权",
      showCancel: false,
      success: function () {
        wx.openSetting({
          success: function (e) {
            // console.log('从新调用用户信息')
            if (e["authSetting"]["scope.userInfo"]) {
              if (that.data.cb_back) {
                that.getUserInfo(that.data.cb_back)
              }
            } else {
              //console.log("授权失败1")
              
              that.setopen()
            }
          },
          fail: function () {
            console.log("授权失败2")
            // that.setopen();
          }

        })
      }

    })
  },
  shareMessage: function (res, json) {
    var currentUrl = getCurrentPages()[getCurrentPages().length - 1];
    console.log(currentUrl.route)
    console.log(json)
    var str=''
    if(json) {
       str="?"
      for(let item in json) {
        str += item + "=" + json[item] + "&";
        console.log(str)
      }
      str = str.substring(0, str.length - 1);
    } 
    console.log(str)
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '比价、采购高效精准',
      path: '/' + currentUrl.route+str,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  //点击事件处理
  TapFunc: function(cb){
    var that=this;
    let currentTapTime = Date.parse(new Date());
    let tapTime = that.globalData.tapTime

    if (!tapTime) {
      that.globalData.tapTime = currentTapTime;
      console.log("首次点击")
      typeof cb == "function" && cb();
    } else if (currentTapTime - tapTime < 500) {
      console.log("连续点击多次")
      return;
    } else {
      console.log("正常点击事件")
      that.globalData.tapTime = currentTapTime;
      typeof cb == "function" && cb();
    }
  },
  globalData: {
    // customerStatus: "",
    // token: "",
    // openId: "",
    // unionId: "",
    // areaAll: null,
    tapTime:0,
    markStatu: markStatu,
    systemVersion:"1.0.2"
  },
})
//growingio代码
var gio = require('vds-mina.js')
gio.projectId = "b6888bfa4bd5672e"
gio.appId = "wx731262261f6fb38d"

// {
//   "pagePath": "pages/shopping_car/shopping_car/shopping_car",
//     "text": "购物车",
//       "iconPath": "images/shopping_icon.png",
//         "selectedIconPath": "images/shopping_selected_icon.png"
// },
