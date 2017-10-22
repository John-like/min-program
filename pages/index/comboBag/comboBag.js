var app = getApp()
const common = require('../../../utils/common.js');
var openId;
var customerStatus;
var unionId;
var shareMessageArg = {};
var systemVersion;
var itemStyle = [
  {
    id: 1,
    name: "白+123456"
  },
  {
    id: 2,
    name: "灰色+123456"

  },
  {
    id: 3,
    name: "黑色+123456"

  }
]
var itemColor = [
  {
    id: 1,
    name: "M31060KPP0"
  },
  {
    id: 2,
    name: "P31060KPP0"

  },
  {
    id: 3,
    name: "L31060KPP0"

  },
  {
    id: 4,
    name: "Y31060KPP0"

  }
]
var lists = [
{
    image:"tob-list.png",
    name:"瓷砖",
    number:"1",
    id:"1"
},
{
  image: "tob-list.png",
  name: "瓷砖2",
  number: "2",
  id: "2"
},
{
  image: "tob-list.png",
  name: "瓷砖3",
  number: "3",
  id: "3"
},
{
  image: "tob-list.png",
  name: "瓷砖4",
  number: "4",
  id: "4"
},
{
  image: "tob-list.png",
  name: "瓷砖5",
  number: "5",
  id: "5"
},

]

var lists2 = [
  {
    image: "tob-list.png",
    name: "底板",
    number: "1",
    id: "1"
  },
  {
    image: "tob-list.png",
    name: "底板",
    number: "2",
    id: "2"
  },
  {
    image: "tob-list.png",
    name: "底板",
    number: "3",
    id: "3"
  },
  {
    image: "tob-list.png",
    name: "底板",
    number: "4",
    id: "4"
  },
  {
    image: "tob-list.png",
    name: "底板",
    number: "5",
    id: "5"
  },

]
var lists3 = [
  {
    image: "tob-list.png",
    name: "橱柜",
    number: "1",
    id: "1"
  },
  {
    image: "tob-list.png",
    name: "橱柜",
    number: "2",
    id: "2"
  },
  {
    image: "tob-list.png",
    name: "橱柜",
    number: "3",
    id: "3"
  },
  {
    image: "tob-list.png",
    name: "橱柜",
    number: "4",
    id: "4"
  },
  {
    image: "tob-list.png",
    name: "橱柜",
    number: "5",
    id: "5"
  },

]
var page = 1;
var navLeftItems = [{
    id:"1",
    name:"客厅"
  },
  {
    id: "2",
    name: "餐厅"
  },
  {
    id: "3",
    name: "主卧"
  },
  {
    id: "4",
    name: "次卧"
  },
  {
    id: "5",
    name: "厨房客厅"

  }
]
Page({
  data: {
    navLeftItems: navLeftItems,
    curNav: 1,//右边tab选择
    curIndex: 0,
    colorNav: 1,//商品颜色选择
    colorIndex: 0,
    typeNav: 1,//商品型号选择
    typeIndex: 0,
   
    showModalStatus: false, //遮层控制显示隐藏

    addShopModal:false,//添加商品 控制

    shopCarModal: false, //购物车弹窗 控制

    shopCarnum: 1,
    items: [ 
      { name: 'USA', value: '厂家搬楼、铺贴：15元/平米' },
      { name: 'CHN', value: '人工调色：50元/色，乳胶漆另算', checked: 'true' },

    ],
    itemstyle: itemStyle,
    itemColor:itemColor,
    lists: lists,
    showNomore:true,
    test:"kangkang",
  },
  onLoad: function (options) {
    var that = this
    shareMessageArg = options;
    openId = wx.getStorageSync('openId');
    customerStatus = wx.getStorageSync('customerstatusStr');
    systemVersion = getApp().globalData.systemVersion
    //unionId = wx.getStorageSync('unionId');
    console.log(that.data.data)
    // console.log(navLeftItems)
    // console.log(itemStyle)
    that.setData({
      itemstyle: that.data.itemstyle,
      itemColor: that.data.itemColor,
      lists: that.data.lists,
      lists2: that.data.lists2
    })
    if(openId) {

      wx.request({
        url: 'http://huanqiuxiaozhen.com/wemall/goodstype/typebrandList',
        method: 'GET',
        data: {},
        header: {
          'Accept': 'application/json'
        },
        success: function (res) {
          console.log(res)
          that.setData({
            navLeftItems: res.data,
            navRightItems: res.data
          })
        }
      })
    }
  },
  onShow: function(){
    systemVersion = getApp().globalData.systemVersion
  },
  scroll:function(event){
    // console.log(event)
  },
  lower:function(){
     var that = this;
   
       that.setData({
         lists: that.data.lists.concat(that.data.lists2),
       })
     
     
  },

  //左边tab处理函数
  switchRightTab: function (e) {

    let id = e.target.dataset.id,
      index = parseInt(e.target.dataset.index);
    this.setData({
      curNav: id,
      curIndex: index
    })
  },

  //商品选择 颜色处理函数
  switchColor: function (e) {
    var that = this;
    let id = e.target.dataset.id,
      colorindex = parseInt(e.target.dataset.index);
   
    that.setData({
      colorNav: id,
      colorIndex: colorindex
    })
   
  },
  //商品选择 型号处理函数
  switchType: function (e) {
    var that = this;
    let id = e.target.dataset.id,
      typeindex = parseInt(e.target.dataset.index);

    that.setData({
      typeNav: id,
      typeIndex: typeindex
    })
  
  },
  //add商品
  reduceBtn: function () {

  },


  //显示遮层函数
  addBtn: function (e) {
    var that = this;
    var currentStatu = e.currentTarget.dataset.statu;
    var showThis = e.currentTarget.dataset.show;  
    common.common(currentStatu, that, 350,showThis);


  },



  // checkbox
  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
  },
  //转发
  onShareAppMessage: function (e) {
    getApp().shareMessage(e, shareMessageArg)
  },


})