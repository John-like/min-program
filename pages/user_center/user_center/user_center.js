// pages/component/user_center.js

const api = require('../../../utils/api');
const tip = require('../../../utils/tip');
const alert = require('../../../utils/alert.js');
var openId;
var customerStatus;
var unionId;
var shareMessageArg = {};
var systemVersion;
var switch_on;
var payPasswordBidding;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // user: {
    //   portrait: "../../../images/user_head.png",
    //   name: "奔跑吧皮皮虾"
    // },
    // examineStatus:{
    //   examine:true,
    //   status:"正在审核中"
    // }
    showVIP: "showVIP"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var myMobile;
    shareMessageArg = options;
    systemVersion = getApp().globalData.systemVersion
    openId = wx.getStorageSync('openId');
    unionId = wx.getStorageSync('unionId');
    customerStatus = wx.getStorageSync('customerstatusStr');
    if (openId) {
      wx.getUserInfo({
        success: function (res) {
          var user = {};
          user.portrait = res.userInfo.avatarUrl;
          user.name = res.userInfo.nickName;

          that.setData({
            user: user,
          })
        }
      })
      wx.request({
        url: api.getCustomerStatus,
        data: {
          openId: openId,
          systemVersion: systemVersion
          //unionId: unionId,
        },
        success: function (res) {
          payPasswordBidding = res.data.data.payPasswordBidding;
          console.log(payPasswordBidding)
          that.setData({
            hasPassword: payPasswordBidding
          })
          myMobile = res.data.data.mobile;//保存用户手机号码
          var res = res.data;
          console.log(myMobile);
          console.log(res.data.priceVipIsShow)
          if (res.code == 0) {
            console.log(res.data.statusStr)
            wx.setStorageSync('customerstatusStr', res.data.statusStr);
            customerStatus = res.data.statusStr
            switch_on = res.data.priceVipIsShow=='yes'?true:false
            that.setData({
              customerStatus: res.data.statusStr,
              switch_on: switch_on
            })
            console.log(switch_on)
            console.log(that.data.customerStatus)
            if (res.data.priceVipIsShow == "yes") {
              console.log(123)
              var event = {
                detail: {
                  value: ["showVIP"]
                }
              }  
            } else {
              var event = {
                detail: {
                  value: []
                }
              } 
            }
            console.log(event)
            that.showVIP(event)
            
          }
          //获取个人二维码
          wx.request({
            url: api.getWechartQRCode,
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
              openId: openId,
              path: 'pages/index/index/index', 
              width: 388,
              systemVersion: systemVersion
            },
            success: function (res) {
              console.log(res);
              var codeUrl = res.data.fileUrl;
              console.log(codeUrl);
              that.setData({
                screenCode: codeUrl
              })
            }
          })
        }
      })
    }
  },

  /**生命周期函数--监听页面显示*/
  onShow: function () {
    var that = this;
     systemVersion = getApp().globalData.systemVersion; 
    if (openId) {
      console.log(openId)
      //更新客户状态
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
            console.log(res)
            payPasswordBidding = res.data.payPasswordBidding;
            console.log(payPasswordBidding)
            that.setData({
              hasPassword: payPasswordBidding
            })
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
      wx.getSystemInfo({
        success: function (res) {
          console.log(res.system)
          if (res.system.indexOf("Android")>=0) {
            that.setData({
              system:"android"
            })
          }
        }
      })
    }

  },
  //是否是审核状态 
  is_examine: function (res) {
    var that = this;
    var customerStatus = wx.getStorageSync('customerstatusStr');
    // customerStatus = "forArchives"
    var link = res.currentTarget.dataset.link
    var url;
  
    if (customerStatus == "unregister") {
      console.log("unregister")
      let content;
      if(link=="0") {
        content = '您需要先注册才能编写个人信息'
        // url = '../../user_center/user_data/user_data'        
      }else if(link=="1") {
        content = '您需要注册并认证才能查看认证信息'        
        // url = '../../index/authenticate/authenticate'
      } else if(link=="2") {
        content = '您需要注册才能查看收货地址信息' 
      } else if(link=="3") {
        content = "您需要注册才能查看银行卡管理信息"
      }
      wx.showModal({
        content: content,
        confirmText:'去注册',
        success: function (res) {
          if (res.confirm) { 
            wx.reLaunch({
              url: "../../index/index/index?arg=toRegistered",
              success: function () {
                console.log("进入注册页面")
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      // //审核通过,认证客户
      // if (link == "0") {
      //   //个人资料页面
      //   url = '../../user_center/user_data/user_data'
      // } else {
      //   //资质认证页面
      //   url = '../../user_center/user_certificate/user_certificate"'
      // }
      // url = "{{(hasPassword == 'yes')?'../../user_center/bank_card_manage/bank_card_manage':'../../user_center/set_code_first/set_code_first'}}"
     
    } else if (customerStatus == 'forArchives') {
      //已注册未认证

      //进入个人资料
      if(link=="0") {
        url = '../../user_center/user_data/user_data'
        wx.navigateTo({
          url: url,
          success: function () {
            console.log("进入注册页面")
          }
        })
      }else if(link=="1") {
        wx.showModal({
          content: '您需要先认证才能查看认证信息？',
          confirmText:'去认证',
          success: function (res) {
            if (res.confirm) {
                //资质认证页面
                url = '../../index/authenticate/authenticate'
              wx.navigateTo({
                url: url,
                success: function () {
                  console.log("进入注册页面")
                }
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      } else if (link=="2") {
        wx.navigateTo({
          url:  "../../user_center/user_address/user_address",
        })
      } else if (link=="3") {
        url = (payPasswordBidding == 'yes')?'../../user_center/bank_card_manage/bank_card_manage':'../../user_center/set_code_first/set_code_first';
        wx.navigateTo({
          url: url,
        })
      }
    }else {
      //注册并认证
      if (link == "0") {
        //个人资料页面
         url = '../../user_center/user_data/user_data'
      } else if(link == "1") {
        //资质认证页面
        url = '../../user_center/user_certificate/user_certificate'
      } else if(link == "2") {
        url = "../../user_center/user_address/user_address"
      } else if(link == "3") {
        url = (payPasswordBidding == 'yes') ? '../../user_center/bank_card_manage/bank_card_manage' : '../../user_center/set_code_first/set_code_first';
      }
      wx.navigateTo({
        url: url,
        success: function () {
          console.log("进入注册页面")
        }
      })
    }
  },
  //认证会员价格开关
  showVIP: function(e){
    let that=this;
    console.log(e.detail.value)
    let value = e.detail.value;
    var priceVip;
    that.setData({
      value:value
    })
    if(value.length==0) {
      priceVip = "no";//关闭
    }else {
      priceVip = "yes";//打开
    }
    wx.request({
      url: api.setPriceVipButton,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        openId: openId,
        systemVersion: systemVersion,
        priceVipIsShow: priceVip
      },
      success: function (res) {
        var code = res.data.code;
        if( code == '0' && priceVip == 'yes') {
          console.log("on")
          switch_on = true;
          that.setData({
            switch_on: switch_on      
          })
        } else if (code == '0' && priceVip == 'no') {
          console.log("off")
          switch_on = false;
          that.setData({
            switch_on: switch_on
          })
        }
      }
    })

  },
  // 展示我的二维码弹窗
  showMyCode: function (e) {
    var that = this;
    // var myMobile;
    that.setData({
      silderNo: true
    })
    let statu = e.currentTarget.dataset.statu;
    alert.alert(statu, that, 300)
  },
  //点击蒙层隐藏我的二维码弹窗
  addBtn: function (res) {
    var that = this;
    that.setData({
      silderNo: false
    })
    let statu = res.currentTarget.dataset.statu;
    alert.alert(statu, that, 300)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  //转发
  onShareAppMessage: function (e) {
    getApp().shareMessage(e, shareMessageArg)
  },
  //联系客服
  concat: function () {

    wx.makePhoneCall({
      phoneNumber: '4008208369'
    })
   
  }
})