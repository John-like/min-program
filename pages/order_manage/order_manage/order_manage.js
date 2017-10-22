// pages/component/order_manage.js

const alert = require('../../../utils/alert.js');
const api = require('../../../utils/api');
const tip = require("../../../utils/tip.js");
var openId;
var customerStatus;
var unionId;
var shareMessageArg = {};
var status;
var pageIndex;
var systemVersion;
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
    topindex:1
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