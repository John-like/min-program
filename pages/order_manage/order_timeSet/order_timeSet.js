var app = getApp()
var openId;
var customerStatus;
var unionId;
var shareMessageArg = {};
var systemVersion;
var datalist =[{
  id:"1",
  name:"第一批"
},
  {
    id: "2",
    name: "第二批",
  },
  {
    id: "3",
    name: "+设置剩余发货",
  }
]


var page = 1;
var lists = [
  {
    id:"1",
    title:"餐厅",
    content:[
      {
        id:"1",
        check:true,
        name:"瓷砖",
        brand:"斯米克",
        type:"M324KPPO",
        unit:"平方",
        num:"50",
      },
      {
        id: "2",
        check: false,
        name: "菲尔普斯",
        brand: "斯米克",
        type: "M324KPPO",
        unit: "平方",
        num: "50",
      },
    ]
  },
  {
    id: "2",
    title: "卧室",
    content: [
      {
        id: "1",
        check: true,
        name: "窗帘",
        brand: "沃尔沃",
        type: "PLKND",
        unit: "平方",
        num: "50",
      },
      {
        id: "2",
        check: false,
        name: "书桌",
        brand: "斯米克",
        type: "HKAA2233",
        unit: "平方",
        num: "50",
      },
    ]
  }
]
Page({
  data: {
    navLeftItems: [],
    navRightItems: [],
    curNav: 1,//右边tab选择
    curIndex: 0,
    data: datalist,
    items: [
      { name: 'USA', value: '美国' },
      { name: 'CHN', value: '中国', checked: 'true' },
      { name: 'BRA', value: '巴西' },
      { name: 'JPN', value: '日本' },
      { name: 'ENG', value: '英国' },
      { name: 'TUR', value: '法国' },
    ],
    checked:true,
    lists:lists,
    date: '2016-09-01',
  },
  onLoad: function (options) {
    var that = this
    shareMessageArg = options;
    systemVersion = getApp().globalData.systemVersion
    openId = wx.getStorageSync('openId');
    //unionId = wx.getStorageSync('unionId');
    customerStatus = wx.getStorageSync('customerstatusStr');
    if(openId) {
      
    }
    console.log(that.data.lists)
    that.setData({
      navLeftItems: that.data.data,
      navRightItems: that.data.data,
  
    })
    console.log(that.data.data)
    console.log(that.data.itemstyle)
    // wx.request({
    //   url: 'http://huanqiuxiaozhen.com/wemall/goodstype/typebrandList',
    //   method: 'GET',
    //   data: {},
    //   header: {
    //     'Accept': 'application/json'
    //   },
    //   success: function (res) {
    //     console.log(res)
    //     that.setData({
    //       navLeftItems: res.data,
    //       navRightItems: res.data
    //     })
    //   }
    // })
  },
  onShow: function() {
    systemVersion = getApp().globalData.systemVersion
  },
  scroll: function (event) {
    // console.log(event)
  },
  lower: function () {
    var that = this;

    that.setData({
      lists: that.data.lists.concat(that.data.lists),
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
  formSubmit:function(res){
    console.log(res)
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  //转发
  onShareAppMessage: function (e) {
    getApp().shareMessage(e, shareMessageArg)
  },
 
})