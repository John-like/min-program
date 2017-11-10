// pages/order_manage/order_detail/order_detail.js
const alert = require('../../../utils/alert.js');
const api = require('../../../utils/api');
const tip = require("../../../utils/tip.js");
const common = require("../../../utils/common.js");
const encrypt = require('../../../utils/md.js');
var openId;
var customerStatus;
var unionId;
var shareMessageArg = {};
var ServenoneNum;
var heightnoneNum;
var systemVersion;
var codeindex = 0;
var orderId;
var orderMoney;
var serveMoney;
var queryById;
var orderCode;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    heightnone: "", //属性显示隐藏
    Servenone: "", //服务显示隐藏
    pay_bankInfo_show:true, //线下转账支付详情
    paymentModal: false,
    bankModal: false,
    focus_flag: false,
    arr: [0, 1, 2, 3, 4, 5],
    psw: [],
    psw_focus: true
    // showModalStatus:true, //弹窗是否显示
    // payTypeMask_show_default:"close" //弹窗显示状态
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    queryById = options.id;
    var that = this;
    systemVersion = getApp().globalData.systemVersion
    var orderInde = options.index;
    shareMessageArg = options;
    openId = wx.getStorageSync('openId');
    unionId = wx.getStorageSync('unionId');
    customerStatus = wx.getStorageSync('customerstatusStr');

    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面
    prevPage.setData({
      topindex: orderInde,
      topindexControl:true
    })

    if (openId) {
      wx.request({
        url: api.queryCommodityInfoByOrderCommodityId,
        data: {
          openId: openId,
          //unionId: unionId,
          orderId: options.id,
          systemVersion: systemVersion
        },
        success: function (res) {
           console.log(res)
           orderId = res.data.data.id;
          //  orderMoney = res.data.data.orderMoney;
           serveMoney = res.data.data.orderServeMoney;
           orderMoney = (serveMoney && serveMoney != "") ? res.data.data.orderMoney + serveMoney : res.data.data.orderMoney;
           orderCode = res.data.data.code;
           that.setData({
             paymentAmount: orderMoney
           })
          let res_data = res.data.data
          let orderCommodityInfos = res_data.orderCommodityInfos
          for (let item of orderCommodityInfos) {
            item.viewMore = true
          }
          console.log(res_data)
          // res_data.status = "paid"
          that.setData({
            orderdetailLists: res_data
          })
          let orderdetailLists = that.data.orderdetailLists
          if (orderdetailLists.status == "unpaid") {
            // that.setData({
            //   showModalStatus: true,
            //   payTypeMask_show_default: "close"
            // })
            var currentStatu = 'open';
            var showThis = 'paymentModal';
            console.log(currentStatu, showThis)
            common.common(currentStatu, that, 200, showThis);
          } else {
            // that.setData({
            //   showModalStatus: false,
            //   payTypeMask_show_default: "open"
            // })
          }
        }

      })
    }
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
    console.log(this.data.showModalStatus)
    let that = this;
    systemVersion = getApp().globalData.systemVersion
    let orderdetailLists = that.data.orderdetailLists
    if (!orderdetailLists) {
      return;
    }
    //未付款状态,弹出付款方式弹层
    // if (orderdetailLists.status == "unpaid") {
      // that.setData({
      //   showModalStatus: true,
      //   payTypeMask_show_default: "close"
      // })
    //   var currentStatu = 'open';
    //   var showThis = 'paymentModal';
    //   console.log(currentStatu, showThis)
    //   common.common(currentStatu, that, 200, showThis);
    // } else {
      // that.setData({
      //   showModalStatus: false,
      //   payTypeMask_show_default: "open"
      // })
    // }

  },

  //产看更多属性
  orderTypemore: function (res) {
    let that = this;
    let index = res.currentTarget.dataset.index
    let orderdetailLists = that.data.orderdetailLists;
    let orderCommodityInfos = orderdetailLists.orderCommodityInfos

    orderCommodityInfos[index].viewMore = !orderCommodityInfos[index].viewMore
    console.log(orderdetailLists)
    this.setData({
      orderdetailLists: orderdetailLists
    })
  },

  //转发
  onShareAppMessage: function (e) {
    getApp().shareMessage(e, shareMessageArg)
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
  //显示支付方式弹窗
  showPayType: function (e) {
    let that=this;
    // if (that.data.showModalStatus) {
    //   alert.alert("close", that, 300)
    //   return;
    // }
    // console.log(res.target.dataset.statu)
    // let statu = res.target.dataset.statu;
    // alert.alert(statu,that,300)
    orderId = e.currentTarget.dataset.id;
    orderMoney = e.currentTarget.dataset.money;
    orderCode = e.currentTarget.dataset.code;
    that.setData({
      paymentAmount: orderMoney
    })
    console.log(orderId, orderMoney, orderCode);
    var currentStatu = e.target.dataset.statu;
    var showThis = e.target.dataset.show;
    console.log(currentStatu, showThis)
    common.common(currentStatu, this, 200, showThis);

  },
  //关闭支付方式弹窗
  paymentClose: function (e) {
    var that = this;
    var currentStatu = e.currentTarget.dataset.statu;
    var showThis = e.currentTarget.dataset.show;
    common.common(currentStatu, that, 200, showThis);
  },
  //点击蒙层隐藏弹窗
  // addBtn: function (res) {
  //   let statu = res.target.dataset.statu;
  //   alert.alert(statu, this, 300)

  // },
  //点击蒙层隐藏弹窗
  addBtn: function (e) {
    var that = this;
    var currentStatu = e.currentTarget.dataset.statu;
    var showThis = e.currentTarget.dataset.show;
    common.common(currentStatu, that, 200, showThis);
  },
  //跳转到银行卡列表
  skipToBank: function (e) {
    var that = this;
    wx.navigateTo({
      url: '../../user_center/bank_card_manage/bank_card_manage',
    })
    common.common("close", that, 200, "paymentModel");
  },
  //选择支付方式
  // radioChange: function (e) {
  //   let that = this;
  //   console.log(e.detail.value)
  //   if (e.detail.value == "transfer") {
  //     that.setData({
  //       pay_bankInfo_show: true
  //     })
  //   } else {
  //     that.setData({
  //       pay_bankInfo_show: false
  //     })
  //   }
  // },
  // 选择支付方式
  choosePayWay: function (e) {
    console.log(orderId, orderMoney);
    let that = this;
    let pay_way = e.currentTarget.dataset.payway;
    console.log(pay_way);
    if(pay_way == "wechat") {
      console.log("pay_wechat");
      console.log(orderMoney)
      if (orderMoney > 300000) {
        wx.showModal({
          title: '温馨提示',
          content: '由于支付金额超过30万元，请使用线下转账，或联系客服。',
          success: function (res) {
            if (res.confirm) {
              common.common("close", that, 200, "paymentModal");
            } else if (res.cancel) {
              common.common("close", that, 200, "paymentModal");
            }
          }
        })
        return;
      }
      wx.request({
        url: api.createPrePayInfo,
        method: "POST",
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          openId: openId,
          systemVersion: systemVersion,
          orderId: orderId,
          totalMoney: orderMoney
        },
        success: function (res) {
          console.log(res);
          if (res.data.code == "0") {
            var nonceStr = res.data.data.nonceStr;
            var packages = res.data.data.package;
            var paySign = res.data.data.paySign;
            var signType = res.data.data.signType;
            var timeStamp = res.data.data.timeStamp;
            wx.requestPayment({
              'timeStamp': timeStamp,
              'nonceStr': nonceStr,
              'package': packages,
              'signType': signType,
              'paySign': paySign,
              'success': function (res) {
                console.log(res)
                common.common("close", that, 200, "paymentModal");
                wx.request({
                  url: api.queryCommodityInfoByOrderCommodityId,
                  data: {
                    openId: openId,
                    orderId: queryById,
                    systemVersion: systemVersion
                  },
                  success: function (res) {
                    console.log("支付完成")
                    console.log(res)
                    orderId = res.data.data.id;
                    serveMoney = res.data.data.orderServeMoney;
                    orderMoney = (serveMoney && serveMoney != "") ? res.data.data.orderMoney + serveMoney : res.data.data.orderMoney;
                    that.setData({
                      paymentAmount: orderMoney
                    })
                    let res_data = res.data.data
                    let orderCommodityInfos = res_data.orderCommodityInfos
                    for (let item of orderCommodityInfos) {
                      item.viewMore = true
                    }
                    console.log(res_data)
                    // res_data.status = "paid"
                    that.setData({
                      orderdetailLists: res_data
                    })
                    let orderdetailLists = that.data.orderdetailLists
                  }

                })
              },
              'fail': function (res) {
                console.log(res)
              }
            })
          } else {
            tip.tip_msg(that, res.data.message);
          }
        }
      })
      } else if (pay_way == "offline") {
        wx.navigateTo({
          url: '../pay_offline/pay_offline',
        })
      } else if (pay_way == "bank") {
      var currentStatu = e.currentTarget.dataset.statu;
        var showThis = e.currentTarget.dataset.show;
        console.log(currentStatu, showThis);
        common.common(currentStatu, that, 200, showThis);
        that.setData({
          psw: []
        })
      }
  },

  cardPayClose: function (e) {
    var that = this;
    var currentStatu = e.currentTarget.dataset.statu;
    var showThis = e.currentTarget.dataset.show;
    common.common(currentStatu, that, 200, showThis);
  },

  /**
  * 生命周期函数--监听页面隐藏
  */
  onHide: function () {
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  },
  userInput: function (e) {
    var target = e.currentTarget.dataset.id;
    console.log(target)
    console.log(codeindex)
    var length = e.detail.value.length;
    if (length == 1) {
      console.log("输入")
      ++codeindex;
      this.setData({
        targetIndex: codeindex
      })
    }
  },
  verifyCode: function (e) {
    console.log(orderId, orderMoney, orderCode);
    console.log(e.detail.value);
    let value = e.detail.value;
    let psw_value = value.split("");
    console.log("psw_value")
    console.log(psw_value)
    psw_value = psw_value.map(function (v, i) {
      return parseInt(v);
    })
    console.log(psw_value)
    this.setData({
      psw: psw_value
    })

    if (value.length == 6) {
      var encryptPassword = encrypt(e.detail.value)
      console.log(encryptPassword);
      wx.request({
        url: api.orderTltPayment,
        method: "GET",
        header: {
          'content-type': 'application/json'
        },
        data: {
          openId: openId,
          accountNo: "6212261001082153443",
          payPassword: encryptPassword,
          orderId: orderId,
          totalMoney: orderMoney
        },
        success: function (res) {
          console.log(res);
          if (res.data.code == "0") {
            wx.navigateTo({
              url: '../payment_success/payment_success?id=' + orderId + '&moeny+' + orderMoney + '&code=' + orderCode,
            })
          }
        }
      })
    }
  },
  //小的input框聚焦时自动失焦
  hidden_focus: function () {
    this.setData({
      psw_focus: true
    })
  },
})