// pages/order_manage/firm_order/firm_order.js
const tip = require("../../../utils/tip.js");
const alert = require("../../../utils/alert.js");
const common = require("../../../utils/common.js");
//获取应用实例
var app = getApp();
//获取api接口文档
const api = require('../../../utils/api');
var openId;
var customerStatus;
var unionId;
var shareMessageArg = {};
var ServenoneNum;
var heightnoneNum;
var tapTime = 0;
var systemVersion;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModalStatus: false,
    isChooseProtocal: false,//同意平台协议
    paymentModal:false,
    set_color_num: 1,
    orderGoodsTotalPrice: 0,
    orderGoodsServePrice: 0,
    heightnone: "", //属性显示隐藏
    Servenone: "", //服务显示隐藏
    has_message: false,
    showAll: true
    //user:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    shareMessageArg = options;
    systemVersion = getApp().globalData.systemVersion
    openId = wx.getStorageSync('openId');
    unionId = wx.getStorageSync('unionId');
    customerStatus = wx.getStorageSync('customerstatusStr');
    that.setData({
      showAll: true
    })
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.system);
        console.log(res.system.indexOf("iOS"));
        if (res.system.indexOf("iOS") >= 0) {
          console.log("is_ios")
          that.setData({
            ios: true
          })
        } else {
          that.setData({
            ios: false
          })
        }

      }
    })
    if (openId) {
      wx.request({
        url: api.queryCommodityListFromShoppingCart,
        data: {
          openId: openId,
          systemVersion: systemVersion
        },
        success: function (res) {
          console.log(res)
          that.setData({
            shoppingcartLists: res.data.data.results,
          })
        }
      })
      wx.request({
        url: api.getAddressItem,
        data: {
          openId: openId,
          isDefault: "yes",
          pageIndex: 1,
          systemVersion: systemVersion
        },
        success: function (res) {
          console.log(res)
          if (res.data.code == 0) {
            that.setData({
              user: res.data.data.results[0],
            })
          } else {
            //tip.tip_msg(that,res.data.message)
          }

        }
      })

    }

    //查询购物车商品数量
    wx.request({
      url: api.queryCommodityNumFromShoppingCart,
      data: {
        openId: openId,
        systemVersion: systemVersion
      },
      success: function (res) {
        console.log(res)
        var resData = res.data.data
        console.log(resData)
        if (res.data.code == "0") {
          if (resData.shoppingCartServeMoney && resData.shoppingCartServeMoney > 0) {
            that.setData({
              orderGoodsTotalPrice: resData.shoppingCartServeMoney + resData.vipShoppingCartMoney,
              orderGoodsServePrice: resData.shoppingCartServeMoney
            })
          } else {
            that.setData({
              orderGoodsTotalPrice: resData.vipShoppingCartMoney
            })
          }
        } else {
          tip.tip_msg(that, res.errMsg)
        }
      }
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
    systemVersion = getApp().globalData.systemVersion
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },



  //转发
  onShareAppMessage: function (e) {
    getApp().shareMessage(e, shareMessageArg)
  },
  agreeStateChange: function (e) {
    var that = this;
    console.log(e.detail.value.length)
    if (e.detail.value.length == 1) {
      that.setData({
        isChooseProtocal: false
      })
    } else {
      that.setData({
        isChooseProtocal: true
      })
    }
  },

  formSubmit: function (e) {
    // var currentStatu = e.target.dataset.statu;
    // var showThis = e.target.dataset.show;
    // console.log(currentStatu, showThis)
    // common.common(currentStatu, this, 200, showThis);
    // return;
    var that = this;

    getApp().TapFunc(function () {
      var value = e.detail.value;
      var shopCarlist = that.data.shoppingcartLists;
      console.log(shopCarlist)
      var formRes = {
        openId: openId,
        unionId: unionId,
        shoppingCartItemIds: [], //购物车清单id
        customerAddressId: "",//收货地址id
        remark: value.leave_message, //留言信息
      }


      shopCarlist.forEach((item, index) => {
        formRes.shoppingCartItemIds.push(item.id)
      })

      formRes.shoppingCartItemIds = formRes.shoppingCartItemIds.join(",")
      // console.log(formRes.shoppingCartItemIds)
      // console.log(formRes)

      if (!that.data.user) {
        tip.tip_msg(that, "请选择收货地址");
        return;
      } else {
        formRes.customerAddressId = that.data.user.id; //设置收货地址id
      }

      // if (value.agreement.length == 0) {
      //   tip.tip_msg(that, "请同意平台协议");
      //   return;
      // }

      console.log("提交")
      formRes.systemVersion=systemVersion
      wx.request({
        url: api.placeOrderFromShoppingCart,
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: formRes,
        success: function (res) {
          console.log(formRes)
          console.log(res)
          if (res.data.code == 0) {

            wx.redirectTo({
              url: '/pages/order_manage/order_detail/order_detail?id=' + res.data.data.orderId,
            })
          } else {
            tip.tip_msg(that, res.data.message)
          }
        }
      })

    })
  },
  chooseGoodsAddress: function (e) {
    var curLength = getCurrentPages().length;
    console.log(curLength);
    if (curLength >= 4) {
      wx.redirectTo({
        url: '../../user_center/user_address/user_address?choose="true"'
      })
    } else {
      wx.navigateTo({
        url: '../../user_center/user_address/user_address?choose="true"'
      })
    }
  },
  //添加颜色
  add_color: function (e) {
    this.setData({
      set_color_num: ++this.data.set_color_num
    })
  },
  //删除颜色
  delete_color: function () {
    this.setData({
      set_color_num: --this.data.set_color_num
    })
  },
  //提交颜色
  form_submit_color: function (e) {
    var that = this;
    var value = e.detail.value;  //表单数据

    //提交
    for (var item in value) {
      if (!value[item]) {
        tip.tip_msg(that, "颜色和数量都不能为空");
        return;
      }
    }
    this.setData({
      showModalStatus: false
    })

    this.addBtn(e);
  },
  //点击显示人工调色
  show_setColor: function (e) {
    var that = this;
    var currentStatu = e.currentTarget.dataset.statu;
    alert.alert(currentStatu, that, 300);
  },
  addBtn: function (e) {
    var that = this;
    var currentStatu = e.currentTarget.dataset.statu;
    var showThis = e.currentTarget.dataset.show;
    common.common(currentStatu, that, 200, showThis);
  },
  //关闭支付方式弹窗
  paymentClose: function (e) {
    var that = this;
    var currentStatu = e.currentTarget.dataset.statu;
    var showThis = e.currentTarget.dataset.show;
    common.common(currentStatu, that, 200, showThis);
  },
  show_protocol: function () {
    // wx.previewImage({
    //   urls: ["../../../images/jsj_protocol.jpg"]
    // })
  },
  // 失焦验证颜色
  // verify_color: function(e){
  //   var that=this;
  //   var value = e.detail.value;
  //   var reg=/^#[0-9|a-f]{6}$/;
  //   if(!reg.test(value)) {
  //     tip.tip_msg(that, "请输入正确的色号");
  //   }
  // }

  //获取字符串中的数字
  get_num_by_String: function (str) {
    var res = {
      index: '',
      name: ''
    }
    for (var i = 0; i < str.length; i++) {
      var j = str.charCodeAt(i);
      if (j > 47 && j < 58) {
        res.index += str.charAt(i);
      } else {
        res.name += str.charAt(i)
      }
    }
    return res;
  },
  get_length_json: function (jsonData) {
    var lenght = 0;
    for (var item in jsonData) {
      length++
    }
    return length;
  },
  json_to_arr: function (jsonData) {
    var arr = [];
    arr.length = that.get_length_json(value) / 2;
    console.log(arr.length)
    for (let i = 0; i < arr.length; i++) {
      arr[i] = {}
    }

    for (let item in value) {
      let res = that.get_num_by_String(item);
      let arr_index = res.index;
      let name = res.name;
      arr[arr_index][name] = value[item];
    }
    that.setData({
      set_color_num: arr
    })
    arr = []
  },
  // 属性展开
  // shopCarattributeMore: function (e) {
  //   var heightnoneNum = e.target.dataset.id;
  //   console.log(heightnoneNum)

  //   this.setData({
  //     heightnone: heightnoneNum
  //   })
  // }
  // 属性展开
  shopCarattributeMore: function (e) {
    if (heightnoneNum != e.target.dataset.id) {
      heightnoneNum = e.target.dataset.id;
    } else {
      heightnoneNum = "";
    }
    console.log(heightnoneNum)
    this.setData({
      heightnone: heightnoneNum
    })
  },

  // 服务展开
  shopCarServeMore: function (e) {
    if (ServenoneNum != e.target.dataset.id) {
      ServenoneNum = e.target.dataset.id;
    } else {
      ServenoneNum = "";
    }
    this.setData({
      Servenone: ServenoneNum
    })
  },
  //留言有输入时,隐藏placeholder
  // input_message: function (res) {
  //   if (res.detail.value == '') {
  //     this.setData({
  //       has_message: false
  //     })
  //   } else {
  //     this.setData({
  //       has_message: true
  //     })
  //   }
  // },
  //留言聚焦
  focus_message: function () {
    this.setData({
      has_message: true
    })
  },
  //留言失去焦点
  blur_message: function (e) {
    console.log(e)
    if (e.detail.value != '') {
      this.setData({
        has_message: true
      })
    } else {
      this.setData({
        has_message: false
      })
    }
  },
  return_index: function () {
    wx.switchTab({
      url: "../../index/index/index"
    })
  },
// 选择支付方式
  choosePayWay: function (e) {
    // let pay_way = e.currentTarget.dataset.payway;
    // console.log(pay_way);
    // if(pay_way == "wechat") {
    //   console.log("pay_wechat");
    //   wx.request({
    //     url: "http://192.168.5.143/jiawang-wechart/customer/createPrePayInfo",
    //     method: "POST",
    //     header: {
    //       'content-type': 'application/x-www-form-urlencoded'
    //     },
    //     data: {
    //       openId: openId,
    //       totalMoney: 1
    //     },
    //     success: function (res) {
    //       console.log(res);
    //       var data = res.data.data;
    //       var nonceStr = data.nonceStr;
    //       var packages = data.package;
    //       var timeStamp = data.timeStamp;
    //       var signType = data.signType;
    //       var paySign = data.paySign;

    //       wx.requestPayment({
    //         'timeStamp': timeStamp,
    //         'nonceStr': nonceStr,
    //         'package': packages,
    //         'signType': signType,
    //         'paySign': paySign,
    //         'success': function (res) {
    //           console.log(res);
    //         },
    //         'fail': function (res) {
    //         }
    //       })
    //     }
    //   })
  //   } else if (pay_way == "offline") {
  //     wx.navigateTo({
  //       url: '../pay_offline/pay_offline',
  //     })
  //   }
  }

})