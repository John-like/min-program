let search_history = [];
const tip = require('../../../utils/tip.js');
var systemVersion;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    search_history: [],
    search_hot: [],
    recommendCommodity: [
      {
      img: "/images/recommend_lamp.png",
      text: "集成吊顶TKB-83AG027雅典印象集成吊顶集成吊顶",
      price: 300
    }, {
      img: "/images/recommend_lamp2.png",
      text: "集成吊顶TKB-83AG027雅典印象集成吊顶集成吊顶",
      price: 600
    },{
      img: "/images/recommend_lamp3.png",
      text: "集成吊顶TKB-83AG027雅典印象集成吊顶集成吊顶",
      price: 300
    }, {
      img: "/images/recommend_lamp4.png",
      text: "集成吊顶TKB-83AG027雅典印象集成吊顶集成吊顶",
      price: 600
    }     
    ],
    placeholderWord: "墙地砖"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    systemVersion = getApp().globalData.systemVersion
    var search_hot = ["斯米克瓷砖", '墙地砖', '实木颗粒板', '金刚板柜', '金刚板', '实木颗粒板', '墙地砖', '双饰面板橱柜'];
    search_history = wx.getStorageSync('searchHistory')
    that.setData({
      search_history: search_history,
      search_hot: search_hot
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    systemVersion = getApp().globalData.systemVersion
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },
  // 搜索按钮
  formSubmit: function (e) {
    var that = this;
    search_history = wx.getStorageSync('searchHistory');
    if(search_history == "") {
      search_history = [];
    }
    let content = e.detail.value.content;
    if (content == "") {
      content = e.currentTarget.dataset.placeholder;
    }
    // 跳转到搜索详情页
    wx.redirectTo({
      url: '../search_result/search_result?search_content=' + content
    })
    that.searchHistorySort(content);
  },
  //最近搜索跳转
  latelySearch: function(res){
    var that = this;
    console.log(res)
    let search=res.target.dataset.search;
    // 跳转到搜索详情页
    wx.redirectTo({
      url: '../search_result/search_result?search_content=' + search
    })
    that.searchHistorySort(search);
  },
  // 清除搜索历史
  latelyRecordClear: function () {
    var that = this;
    search_history = [];
    that.setData({
      search_history: search_history
    })
    wx.setStorageSync('searchHistory', search_history)
  },
  //搜索历史排序
  searchHistorySort: function (content) {
    var content = content;
    if (search_history.length > 0) {//最近搜索里已有内容
      var isAdd = search_history.every(function (item) {//判断最新搜索内容是否在最近搜索内容里
        return (content != item);
      })
      if (isAdd) {//不存在，直接添加到最前面
        if (search_history.length == 10) {
          search_history.pop(search_history);
        }
      } else {//已经存在，将之前的删除再添加到最前面
        for (var i = 0; i < search_history.length; i++) {
          if (content == search_history[i]) {
            search_history.splice(i, 1);
          }
        }
      }
      search_history.unshift(content);
    } else {//无最近搜索内容时直接添加
      search_history.unshift(content);
    }
    //添加到最近搜索
    this.setData({
      search_history: search_history
    })
    wx.setStorageSync('searchHistory', search_history);
  },
  //热门搜索跳转
  searchHot: function (e) {
    var that = this;
    var hot = e.target.dataset.hot;
    wx.redirectTo({
      url: '../search_result/search_result?search_content=' + hot
    })
    that.searchHistorySort(hot);
  }
})