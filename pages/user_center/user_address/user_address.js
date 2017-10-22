// pages/user_center/user_address/user_address.js
const api = require('../../../utils/api');
const tip = require("../../../utils/tip.js");
var pageIndex = 1;
var allPage;
var openId;
var shareMessageArg = {};
var customerStatus;
var unionId;
var first;
var systemVersion;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // lists: [{
    //   name: "皮皮虾",
    //   mobile: "18888888888",
    //   address: '上海市宜山路450号家饰佳1楼G1033-G1035展厅上海市宜山路450号家饰佳1楼G1033-G1035展厅',
    //   isDefault: false
    // }],
    choose: false
  },

  /** 生命周期函数--监听页面加载 */
  onLoad: function (options) {
    shareMessageArg = options;
    systemVersion = getApp().globalData.systemVersion
    openId = wx.getStorageSync('openId');
    customerStatus = wx.getStorageSync('customerstatusStr');
    unionId = wx.getStorageSync('unionId');
    if(openId) {
      first = true
      pageIndex = 1
      var that = this;
      if (options.choose) {
        that.setData({
          choose: true
        })
      }

      console.log(options)
      that.getList();
    }
  },

  /*  生命周期函数--监听页面显示  */
  onShow: function () {
    systemVersion = getApp().globalData.systemVersion
    // if(first) {
    //   first=false;
    //   return;
    // }
    // console.log(first)
    // pageIndex=1
    // this.getList();
  },

  /*  页面上拉触底事件的处理函数 */
  onReachBottom: function () {
    this.getList();
  },

  // 改变选项设为默认
  radioChange: function (e) {
    var that = this;
    var id = e.detail.value;
    var lists = that.data.lists;
    console.log(lists)
    console.log(id)
    wx.request({
      url: api.serAddressDefault,
      method: 'POST',
      data: {
        openId: openId,
        //unionId: unionId,
        customerAddressId: id,
        isDefault: "yes",
        systemVersion: systemVersion
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.code == 0) {
          lists.forEach((item, index) => {
            item.isDefault = "no";
          })
          lists.forEach((item) => {
            if (item.id == id) {
              item.isDefault = "yes";
            }
          })
          console.log(lists)
        } else {
          that.setData({
            lists: that.data.lists
          })
          tip.tip_msg(that, "操作失败")
        }
      }
    })


  },
  delete_address: function (e) {
    var that = this;
    var id = e.target.dataset.id;
    var lists = this.data.lists;
    var index = e.target.dataset.index;
    console.log(id)
    wx.showModal({
      title: "提示",
      content: "确定删除此地址",
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: api.removeAddress,
            method: 'POST',
            data: {
              openId: openId,
              //unionId: unionId,
              customerAddressId: id,
              systemVersion: systemVersion
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              lists.splice(index, 1);
              that.setData({
                lists: lists
              })
            }
          })




        } else if (res.cancel) {

        }
        // that.setDefault();
      }
    })
  },

  set_area: function (e) {
    if (!this.data.choose) {
      return;
    }
    var that=this;
    var index=e.currentTarget.dataset.index;
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1]; //当前页面
    var prevPage = pages[pages.length - 2]; //上一个页面
    console.log(that.data.lists[index])
    //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
    prevPage.setData({
      user:that.data.lists[index]
    })

    wx.navigateBack({
      delta: 1
    })

  },
  getList: function () {
    console.log(pageIndex)
    //console.log(allPage)
    if (pageIndex > allPage && allPage){
      //tip.tip_msg(this,"已经到底了")
      return;
    }
    console.log(openId)
    var that = this;
    //that.data.cb_back = cb;
    wx.request({
      url: api.getAddressItem,
      method: 'GET',
      data: {
        openId: openId,
        //unionId: unionId,
        pageIndex: pageIndex,
        systemVersion: systemVersion
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        pageIndex++
        console.log(pageIndex)
        var res = res.data;
        if (res.code == 0) {
          let lists=that.data.lists
          if(lists) {
            that.setData({
              lists: lists.concat(res.data.results),
              pagination: res.data.pagination
            })
          }else {
            that.setData({
              lists: res.data.results,
              pagination: res.data.pagination
            })
          }
          allPage=res.data.pagination.allPage;
          console.log(that.data.lists)
        } else {
          tip.tip_msg(that, res.message);
        }
        //typeof cb == "function" && cb(res);
      },
      fail: function (res) {

      }
    })
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
  //转发
  onShareAppMessage: function (e) {
    getApp().shareMessage(e, shareMessageArg)
  },



})