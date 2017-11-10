// pages/component/order_manage.js

const alert = require('../../../utils/alert.js');
const api = require('../../../utils/api');
const tip = require("../../../utils/tip.js");
const common = require('../../../utils/common.js');
const encrypt = require('../../../utils/md.js');
var openId;
var customerStatus;
var unionId;
var shareMessageArg = {};
var status;
var pageIndex;
var systemVersion;
var codeindex = 0;
var orderId;
var orderMoney;
var orderCode;
var payPasswordBidding;  //是否设置密码
var title = [{
  id: '1',
  name: "全部",
  num: "20",
},
]
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: title,
    curNav: 1,
    curIndex: 0,
    showModalStatus: false, //选择商品型号的时候，显示的遮层
    showSignRemarks: false,//未签收条件
    btmhidden: true,
    mask_show: false,  //弹层显示
    topindex:1,
    paymentModal: false,
    bankModal: false,
    focus_flag: false,
    cardMsg:{
      cardKind: "中国建设银行",
      cardType: "储蓄卡",
      cardNum: 6212271001082153556
    },
    arr: [0, 1, 2, 3, 4, 5],
    psw: [],
    psw_focus: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    shareMessageArg = options;
    var that = this;
    pageIndex = 1
    systemVersion = getApp().globalData.systemVersion
    openId = wx.getStorageSync('openId');
    //unionId = wx.getStorageSync('unionId');
    customerStatus = wx.getStorageSync('customerstatusStr');
    if (openId) {
      that.order_request(null, function (res) {
        console.log(res)
        that.setData({
          orderLists: res.data.data.results,
          orderPagination: res.data.data.pagination
        })
        if (res.code == 0) {

        } else {
          //tip.tip_msg(that, res.message)
        }
      })
      //监控客户状态
      wx.request({
        url: api.getCustomerStatus,
        data: {
          openId: openId,
          systemVersion: systemVersion
          //unionId: unionId,
        },
        success: function (res) {
          console.log(res)
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
    //解决华为手机底部遮挡的问题
    wx.getSystemInfo({
      success: function (res) {
      console.log(res)
        that.setData({
          scrollHeight: parseInt(res.windowHeight) -44
        })
      }
    });
  },

  order_request: function (status, cb) {
    var res_data = {};
    res_data.openId = openId;
    if (status) {
      console.log(23897582)
      res_data.status = status
    }
    wx.request({
      url: api.queryCommodityListFromOrder,
      data: {
        openId: openId,
        //unionId: unionId,
        status: "",
        pageIndex: pageIndex,
        systemVersion: systemVersion
      },
      success: function (res) {
        typeof cb == "function" && cb(res);
      }

    })

  },
  goIndex: function () {
    wx.switchTab({
      url: '../../index/index/index',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**生命周期函数--监听页面显示*/
  onShow: function (options) {
    console.log(options)
    var that = this;
    systemVersion = getApp().globalData.systemVersion;   
    pageIndex = 1;
    if (openId) {

      //刷新订单页面
      if (that.data.topindexControl){
        that.setData({
          topindexControl:false
        })
      }else{
        that.setData({
          topindex: 0
        })
        wx.showLoading({
          title: '加载中...',
        })
        that.order_request(null, function (res) {
          wx.hideLoading()
          console.log(res)
          that.setData({
            orderLists: res.data.data.results,
            orderPagination: res.data.data.pagination,
            btmhidden: true,
          })
          if (res.code == 0) {

          } else {
            //tip.tip_msg(that, res.message)
          }
        })
      }
     
      //监控客户状态
      wx.request({
        url: api.getCustomerStatus,
        data: {
          openId: openId,
          systemVersion : systemVersion
          
          //unionId: unionId,
        },
        success: function (res) {
          var res = res.data;
          if (res.code == 0) {
            console.log(res.data)
            console.log(res.data.statusStr)
            wx.setStorageSync('customerstatusStr', res.data.statusStr);
            customerStatus = res.data.statusStr
            payPasswordBidding = res.data.payPasswordBidding
            that.setData({
              customerStatus: res.data.statusStr
            })
            console.log(that.data.customerStatus)
          }
        }
      })
      
    }

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
    setTimeout(function () {
      wx.stopPullDownRefresh()
    }, 1500)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  lower:function(){
    var that = this;
    ++pageIndex;
    //订单 接口
    var Pagination = that.data.orderPagination
    if (pageIndex > Pagination.allPage) {
      that.setData({
        btmhidden: false
      })
    } else {

      that.order_request(null, function (res) {
        that.setData({
          orderLists: that.data.orderLists.concat(res.data.data.results),
          orderPagination: res.data.data.pagination
        })
      })
    }
  },


  // 提交
  formSubmit: function (e) {

    var that = this;
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    var remarksWord = e.detail.value.remarksWord
    console.log(remarksWord)
    wx.showModal({
      title: '拒绝签收',
      content: '你确定要拒绝签收么？',
      success: function (res) {
        var state = close;
        that.setData({
          showModalStatus: false
        })
        if (res.confirm) {

          // that.setData({
          //   showModalStatus: false
          // })

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      },
    })

  },
  // 签收
  Sign: function () {
    var that = this;
    wx.showModal({
      title: '确认签收',
      content: '你确定要签收订单么？',
      success: function (res) {
        that.setData({
          showModalStatus: false
        })
        var state = close;
        if (res.confirm) {

          // that.setData({
          //   showModalStatus:false
          // })

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      },
    })

    that.setData({
      showSignRemarks: false
    })
  },
  // 未签收
  rufuseSign: function () {
    var that = this;
    that.setData({
      showSignRemarks: true
    })
  },
  // 取消订单
  cancelItem: function () {
    wx.showModal({
      title: '取消订单',
      content: '你确定要取消订单么',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')

          wx.request({
            url: api.cancelOrder,
            data: {
              orderId: orderId,
              openId: openId,
              systemVersion: systemVersion
              //unionId: unionId
            },
            success: function (res) {
              var res = res.data
              console.log(res)
              if (res.code == 0) {

              } else {
                // tip.tip_msg(that, res.message)
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      },
    })
  },
  addBtn: function (e) {
    var that = this;
    var currentStatu = e.currentTarget.dataset.statu;

    alert.alert(currentStatu, that, 400);


    that.setData({
      showSignRemarks: false
    })


  },
  //弹出支付方式
  goPay: function (e) {
    var that = this;
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
  closeBtn: function (e) {
    var that = this;
    var currentStatu = e.currentTarget.dataset.statu;
    var showThis = e.currentTarget.dataset.show;
    common.common(currentStatu, that, 200, showThis);
  },
  paymentClose: function (e) {
    var that = this;
    var currentStatu = e.currentTarget.dataset.statu;
    var showThis = e.currentTarget.dataset.show;
    common.common(currentStatu, that, 200, showThis);
  },
  // 选择支付方式
  choosePayWay: function (e) {
    console.log(orderId, orderMoney);
    let that = this;
    let pay_way = e.currentTarget.dataset.payway;
    console.log(pay_way);
    if (pay_way == "wechat") {
      console.log("pay_wechat");
      console.log(orderMoney)
      if (orderMoney > 300000) {
        wx.showModal({
          title: '温馨提示',
          content: '由于支付金额超过30万元，请使用线下转账，或联系客服。',
          success: function (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '../order_detail/order_detail?id=' + orderId,
              })
            } else if (res.cancel) {
              wx.navigateTo({
                url: '../order_detail/order_detail?id=' + orderId,
              })
            }
            common.common("close", that, 200, "paymentModal");
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
      if (payPasswordBidding=="yes") { //设置了密码
      console.log("设置了密码")
        wx.request({
          url: api.queryCustomerBankCardList,
          data: {
              openId:openId,
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            let res_bank=res.data
            if (res_bank.code=="0"){
              console.log(res_bank.data)
              console.log(res_bank.data instanceof Array)
              if (res_bank.data.length>0) {
                let res_bank_first = res_bank.data[0]
                let cardMsg={
                  logo_url: res_bank_first.basisBankFileUrl,
                  cardKind: "中国建设银行",
                  cardType: "储蓄卡",
                  cardNum: res_bank_first.accountNo,
                  cardNum_ab: res_bank_first.accountNo.substring(res_bank_first.accountNo.length-4)
                }
                common.common(currentStatu, that, 200, showThis);
                that.setData({
                  cardMsg: cardMsg
                })
              }else {
                wx.navigateTo({
                  url: '../../user_center/bank_card_manage/bank_card_manage?type=payment',
                })
              }
            }
          }
        })

      }else { //没有设置密码
        wx.navigateTo({
          url: '../../../user_center/set_code_first/set_code_first',
        })
      }
      
    }
  },
  //关闭通联支付弹窗
  cardPayClose: function (e) {
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
    let that=this
    console.log(e.detail.value);
    var orderPayCode = e.detail.value;
    console.log(orderId, orderMoney, orderCode);
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
    if (orderPayCode.length == 6) {
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
          accountNo: that.data.cardMsg.cardNum,
          payPassword: encryptPassword,
          orderId: orderId,
          totalMoney: orderMoney
        },
        success: function (res) {
          console.log("支付成功")
          console.log(res);
          if(res.data.code == "0") {
            wx.navigateTo({
              url: '../payment_success/payment_success?id='+orderId+'&money='+orderMoney+'&code='+orderCode,
            })
            common.common("close", that, 200, "paymentModel");
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

  //事件处理函数
  switchRightTab: function (e) {

    let id = e.target.dataset.id,
      index = parseInt(e.target.dataset.index);
    this.setData({
      curNav: id,
      curIndex: index
    })
  },
  //转发
  onShareAppMessage: function (e) {
    getApp().shareMessage(e, shareMessageArg)
  },
})