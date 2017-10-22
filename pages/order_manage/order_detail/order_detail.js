// pages/order_manage/order_detail/order_detail.js
const alert = require('../../../utils/alert.js');
const api = require('../../../utils/api');
const tip = require("../../../utils/tip.js");
var openId;
var customerStatus;
var unionId;
var shareMessageArg = {};
var ServenoneNum;
var heightnoneNum;
var systemVersion;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    heightnone: "", //属性显示隐藏
    Servenone: "", //服务显示隐藏
    pay_bankInfo_show:true, //线下转账支付详情
    // showModalStatus:true, //弹窗是否显示
    // payTypeMask_show_default:"close" //弹窗显示状态
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
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
       
          let res_data = res.data.data
          let orderCommodityInfos = res_data.orderCommodityInfos
          for (let item of orderCommodityInfos) {
             item.viewMore=true
          }
          console.log(res_data)
          // res_data.status = "paid"
          that.setData({
            orderdetailLists: res_data
          })
          let orderdetailLists = that.data.orderdetailLists
          if (orderdetailLists.status == "unpaid") {
            that.setData({
              showModalStatus: true,
              payTypeMask_show_default: "close"
            })
          } else {
            that.setData({
              showModalStatus: false,
              payTypeMask_show_default: "open"
            })
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
    let that=this;
    systemVersion = getApp().globalData.systemVersion
    let orderdetailLists = that.data.orderdetailLists
    if (!orderdetailLists) {
      return;
    }
    //未付款状态,弹出付款方式弹层
    if ( orderdetailLists.status == "unpaid"){
      that.setData({
        showModalStatus:true,
        payTypeMask_show_default: "close"
      })
    }else {
      that.setData({
        showModalStatus: false,
        payTypeMask_show_default: "open"
      })
    }
    
  },

  //产看更多属性
  orderTypemore:function(res){
    let that=this;
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
  showPayType: function(res){
      let that=this;
      if (that.data.showModalStatus) {
        alert.alert("close", that, 300)
        return;
      }
      console.log(res.target.dataset.statu)
      let statu = res.target.dataset.statu;
      alert.alert(statu,that,300)
      
  },
  //点击蒙层隐藏弹窗
  addBtn: function(res){
    let statu = res.target.dataset.statu;
    alert.alert(statu, this, 300)
   
  },
  //选择支付方式
  radioChange: function(e){
    let that=this;
    console.log(e.detail.value)
    if (e.detail.value =="transfer") {
      that.setData({
        pay_bankInfo_show: true
      })
    }else {
      that.setData({
        pay_bankInfo_show: false
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
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  },
 
})