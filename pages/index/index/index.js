const tip = require('../../../utils/tip.js');
var app = getApp();
const api = require('../../../utils/api');
const alert = require('../../../utils/alert.js');
var openId;
var customerStatus;
var animationCloudData;
var timerId;
var intervalId;
var interval;
var mobileIsBidding;
var isSlider;
// var openId = wx.getStorageSync('openId');
// var customerStatus = wx.getStorageSync('customerStatus');
// var unionId = wx.getStorageSync('unionId');
var unionId = "";
// var productCategoryId = 1;
var shareMessageArg = {};
var startPoint;
var systemVersion;
Page({
  data: {
    // 页面配置  
    winWidth: 0,
    winHeight: 0,
    // tab切换 
    currentTab: 0,
    lists: {},
    showModalStatus: false, //选择商品型号的时候，显示的遮层
    hasNum: true,
    titleData: [{
      img: "/images/kaiguanchazuo.png",
      title: "开关插座",
      url: "../optionalBag/optionalBag?id=9"
    }, {
      img: "/images/yushigui.png",
      title: "浴室柜",
      url: "../optionalBag/optionalBag?id=24"
    }, {
      img: "/images/qiangdizhuan.png",
      title: "墙地砖",
      url: "../optionalBag/optionalBag?id=14"
    }, {
      img: "/images/chugui.png",
      title: "橱柜",
      url: "../optionalBag/optionalBag?id=1"
    }, {
      img: "/images/diban.png",
      title: "地板",
      url: "../optionalBag/optionalBag?id=3"
    }, {
      img: "/images/zuobianqi.png",
      title: "座便器",
      url: "../optionalBag/optionalBag?id=12"
    }, {
      img: "/images/youhuizuhe.png",
      title: "超值组合",
      url: "../CombinationBag/CombinationBag"
    }, {
      img: "/images/zhucaipinlei.png",
      title: "主材品类",
      url: "../optionalBag/optionalBag?id=1"
    }],
    hiddenad: true,
    buttonTop: 350,
    buttonLeft: 300,
    codeMsg: "获取验证码",
    getCodeDisable: false
  },
  onLoad: function (options) {
    console.log(options);
    systemVersion = getApp().globalData.systemVersion;
    //根据用户状态判断是否弹出手机注册页面
    if (options &&options.arg) {
      if (options.arg == "toRegistered") {
        alert.alert('open', this, 300);
      }
    }
    console.log(app.globalData)
    if(app.globalData.markStatu == 'open') {
      alert.alert('open', this, 300);
    }
    shareMessageArg = options;
    var that = this; 
    openId = wx.getStorageSync('openId');
    unionId = wx.getStorageSync('unionId');
    customerStatus = wx.getStorageSync('customerstatusStr');
    that.setData({
      customerStatus: customerStatus
    })
    console.log(customerStatus)
    if (openId) {
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
            console.log(res.data.statusStr)
            wx.setStorageSync('customerstatusStr', res.data.statusStr);
            customerStatus = res.data.statusStr
            that.setData({
              customerStatus: res.data.statusStr
            })
            console.log(that.data.customerStatus)
          }
        }
      })
      //没有注册,进入注册页面
      // if (customerStatus == "forArchives") {
      //   wx.navigateTo({
      //     url: '../perfect_data/perfect_data',
      //     success: function () {
      //     }
      //   })
      // }

      // if (customerStatus == "forArchives") {
      //   this.setData({
      //     hiddenad: false
      //   })
      // }
      //获取省市区数据
      wx.request({
        url: api.getAreaAll,
        method: 'GET',
        data: {
          openId: openId,
          systemVersion: systemVersion
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          //console.log(res)
          let res_area = res.data;

          if (res_area.code == 0) {
            let arr = res_area.data.results;
            // console.log(arr)
            var country = []
            var province = []
            var city = []
            var area = []
            for (let value of arr) {
              if (value.Type == "country") {
                country.push(value)
              } else if (value.Type == "province") {
                province.push(value)
              } else if (value.Type == "city") {
                city.push(value)
              } else if (value.Type == "area") {
                area.push(value)
              }
            }
            // that.globalData.areaAll=arr;
            var areaAll = {
              "country": country,
              "province": province,
              "city": city,
              "area": area
            }
            wx.setStorageSync('areaAll', areaAll);
          }
        }
      })
    }

  },

  onReady: function () {
    // 页面渲染完成
    // 实例化一个动画
    var that = this;
    var animationData = wx.createAnimation({
      duration: 500, // 默认为400     动画持续时间，单位ms
      timingFunction: 'ease-in-out'
    });
    animationCloudData = wx.createAnimation({
      duration: 500, // 默认为400   
      timingFunction: 'ease-in-out'
    });
    //动画的脚本定义必须每次都重新生成，不能放在循环外
    animationCloudData.scale(1.1, 1.1).step().scale(1, 1).step();
    // 更新数据
    that.setData({
      // 导出动画示例
      animationCloudData: animationCloudData.export(),
    })

    timerId = setInterval(function () {
      //动画的脚本定义必须每次都重新生成，不能放在循环外
      animationCloudData.scale(1.1, 1.1).step().scale(1, 1).step();
      // 更新数据
      that.setData({
        // 导出动画示例
        animationCloudData: animationCloudData.export(),
      })
    }.bind(that), 1000);
  },

  /* 生命周期函数--监听页面显示 */
  onShow: function () {
    console.log("onShow")
    systemVersion = getApp().globalData.systemVersion;
    var that = this;
    let currentTime = Date.parse(new Date())
    that.setData({
      urlTime: currentTime
    })
    if (interval) {
      that.setData({
        codeMsg: interval
      })
    }
    if (openId) {
      console.log("onSHow openId")
      //监控客户状态
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
            console.log(res.data.statusStr)
            wx.setStorageSync('customerstatusStr', res.data.statusStr);
            customerStatus = res.data.statusStr
            that.setData({
              customerStatus: res.data.statusStr
            })
            console.log(that.data.customerStatus)
          }
        }
      })
    }

  },
  weapp: function (res) {
    console.log(res)
  },
  //客服
  userGuide: function () {
    var that = this;
    // let url1 = "https://go.jiaw.com/upload/static_detail_1.png?t=" + this.urlTime
    // wx.previewImage({
    //   urls: [url1]
    // })
    clearInterval(timerId);
    console.log(customerStatus);
    if (customerStatus == "unregister") {
      isSlider = true;
      that.setData({
        isSlider: isSlider
      })
      alert.alert('open', this, 300);
    }    
  },
  onShareAppMessage: function (e) {
    getApp().shareMessage(e, shareMessageArg)
  },
  //隐藏广告
  hiddenad: function () {
    this.setData({
      hiddenad: true
    })
  },

  // 首单立享拖动
  buttonStart: function (e) {
    startPoint = e.touches[0]
  },
  buttonMove: function (e) {
    var screenHeight;
    var screenWidth;
    wx.getSystemInfo({
      success: function (res) {
        screenHeight = res.windowHeight;
        screenWidth = res.windowWidth;
      }
    });
    var endPoint = e.touches[e.touches.length - 1]
    var translateX = endPoint.clientX - startPoint.clientX
    var translateY = endPoint.clientY - startPoint.clientY
    startPoint = endPoint
    var buttonTop = this.data.buttonTop + translateY
    var buttonLeft = this.data.buttonLeft + translateX
    // console.log(buttonLeft, buttonTop)
    // console.log(screenWidth, screenHeight)
    if(buttonTop < -55) {
      return;
    }
    if(buttonLeft < -51) {
      return;
    }
    if(buttonTop > screenHeight - 55) {
      return;
    }
    if(buttonLeft > screenWidth - 51) {
      return;
    }
    this.setData({
      buttonTop: buttonTop,
      buttonLeft: buttonLeft
    })
  },
  buttonEnd: function (e) {
    console.log('end')
  },
  //显示首单注册弹窗
  showFirstOrderRegistor: function (res) { 
    console.log("点击")
    clearInterval(timerId)
    let that = this;
    isSlider = true;
    that.setData({
      isSlider: isSlider
    })
    console.log(res)
    console.log(isSlider)
    console.log(that.data.isSlider)
    console.log(res.currentTarget.dataset.statu)
    let statu = res.currentTarget.dataset.statu;
    alert.alert(statu, that, 300)
  },
  //点击蒙层隐藏弹窗
  addBtn: function (res) {
    var that = this;
    isSlider = false;
    that.setData({
      isSlider: isSlider
    })
    console.log(isSlider)
    console.log(that.data.isSlider)
    let statu = res.currentTarget.dataset.statu;
    alert.alert(statu, this, 300)
    timerId = setInterval(function () {
      //动画的脚本定义必须每次都重新生成，不能放在循环外
      animationCloudData.scale(1.1, 1.1).step().scale(1, 1).step();
      // 更新数据
      that.setData({
        // 导出动画示例
        animationCloudData: animationCloudData.export(),
      })
    }.bind(that), 1000);
  },
  //点击按钮隐藏弹窗
  registerClose: function (e) {
    var that = this;
    isSlider = false;
    that.setData({
      isSlider: isSlider
    })
    console.log(e)
    let statu = e.currentTarget.dataset.statu;
    alert.alert(statu, this, 300)
    timerId = setInterval(function () {
      //动画的脚本定义必须每次都重新生成，不能放在循环外
      animationCloudData.scale(1.1, 1.1).step().scale(1, 1).step();
      // 更新数据
      that.setData({
        // 导出动画示例
        animationCloudData: animationCloudData.export(),
      })
    }.bind(that), 1000);
  },
  //失去焦点获取手机号码
  getMobile: function (e) {
    var that = this;
    var phone = e.detail.value;
    clearInterval(intervalId);
    that.setData({
      phoneNumber: phone,
      codeMsg: "获取验证码",
      getCodeDisable: false
    })
  },
  //点击获取验证码
  getCode: function (e) {
    var that = this;
    if (this.data.getCodeDisable) {
      tip.tip_msg(this, "短信正在发送，请注意查收")
      return;
    }
    var mobile = e.currentTarget.dataset.phone;
    var regMobile = /^0?1[3|4|5|7|8][0-9]\d{8}$/;
    if (mobile == "") {
      tip.tip_msg(that, "手机号不能为空");
      return;
    } else if (!regMobile.test(mobile)) {
      tip.tip_msg(that, "请输入正确的手机格式");
      return;
    }
    wx.request({
      url: api.sendValidationSms,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        mobile: mobile,
        openId: openId,
        systemVersion: systemVersion
      },
      success: function (res) {
        console.log(res);
        console.log(res.data.code)
        if(res.data.code == "0") {
          tip.tip_msg(that, "发送成功");
          interval = res.data.data.interval;
          if (interval) {
            that.setData({
              getCodeDisable: true
            })
            intervalId = setInterval(function () {
              if (interval == 1) {
                clearInterval(intervalId);
                that.setData({
                  codeMsg: "获取验证码",
                  getCodeDisable: false
                })
                return;
              }
              interval--;
              that.setData({
                codeMsg: interval
              })
            }, 1000)
          }
        } else if (res.data.code == "-1") {
          tip.tip_msg(that, res.data.message);
        }
      }
    })
  },
  //立即注册
  formSubmit: function (e) {
    var that = this;
    console.log(e)
    var value = e.detail.value;
    var regMobile = /^0?1[3|4|5|7|8][0-9]\d{8}$/;
    console.log(value)
    console.log(value.mobile)
    console.log(value.code)
    console.log(value.referreMobile)
    if (value.mobile == "") {
      console.log(tip.tip_msg)
      tip.tip_msg(that, "手机号不能为空");
      return;
    } else if (!regMobile.test(value.mobile)) {
      tip.tip_msg(that, "请输入正确的手机格式");
      return;
    }
    if (value.code == "") {
      tip.tip_msg(that, "验证码不能为空")
      return;
    }
    if (value.referreMobile != "") {
      if (!regMobile.test(value.referreMobile)) {
        tip.tip_msg(that, "请输入正确的手机格式");
        return;
      }
    }
    wx.request({
      url: api.toMobileBidding,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        openId: openId,
        unionId: unionId,
        mobile: value.mobile,
        code: value.code,
        systemVersion: systemVersion
      },
      success: function (res) {
        console.log(res)
        if(res.data.code == "0") {
          wx.setStorageSync('customerstatusStr', "forArchives");
          that.setData({
            customerStatus: "forArchives"
          })
          alert.alert('close', that, 300);
          isSlider = false;
          that.setData({
            isSlider: isSlider
          })
          tip.tip_msg(that, "注册成功");
          clearInterval(timerId);
        } else if (res.data.code == "-1") {
          tip.tip_msg(that, res.data.message)
        }
      }
    })
  },
  //换一批
  hotRefresh: function () {

  },
  //搜索聚焦跳转至搜索页面
  focus_search: function(){
    wx.navigateTo({
      url: '../search/search',
    })
  }
}) 
