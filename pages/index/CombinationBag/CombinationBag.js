// var app = getApp()
const common = require('../../../utils/common.js');
const api = require('../../../utils/api');
const tip = require('../../../utils/tip');
var openId;
var customerStatus;
var unionId;
// var productCategoryId = 1;
var pageIndex = 1;
var shopingCartPageIndex;
var shareMessageArg = {};
var allPage;
var ServenoneNum;
var heightnoneNum;
var overtime = true;
var updataNumTimer = null;
var reduceNumTimer = null;
var shoppingGoodsNum = 0;
var shoppingGoodsNumReduce = 0;
var lastshoppingGoodsNum = 0;
var systemVersion;
Page({
  data: {
    navLeftItems: {}, //左侧tab
    lists: {},   //右侧商品列表
    curNav: 1,//左侧tab 控制显示 隐藏

    colorIndex: 0, //控制 颜色显示隐藏
    typeNav: 1,//商品型号选择
    showModalStatus: false, //遮层控制显示隐藏

    addShopModal: false,//添加商品 控制

    shopCarModal: false, //购物车弹窗 控制

    shopCarnum: 1,

    totalNum: 20,

    listNum: 10,
    scrollHeightLeft: '',

    scrollHeightRight: '',

    showNomore: false,

    mask_show: false, //弹层显示

    heightnone: "", //属性显示隐藏
    Servenone: "", //服务显示隐藏

    productCategoryId: 1,
    shopCarTotalPrice:"0.00",//初始值
    shoppingcartLists: [], //购物车列表
    imgUrls: [
      "/images/tob_zh_logo1.png",
      "/images/tob_zh_logo2.png",
      "/images/tob_zh_logo3.png"
    ], //头部logo img

  },

  onLoad: function (options) {
    shareMessageArg = options;
    var optionsnum = parseInt(options.id);
    console.log(optionsnum)
    overtime = true;
    var that = this
    openId = wx.getStorageSync('openId');
    customerStatus = wx.getStorageSync('customerstatusStr');
    unionId = wx.getStorageSync('unionId');
    systemVersion = getApp().globalData.systemVersion
    //console.log(openId)
    wx.showLoading({
      title: '加载中...',
    })
    let timer = setTimeout(function () {
      console.log("2s后执行")
      console.log(overtime)
      if (overtime) {
        tip.tip_msg(that, "连接超时")
        wx.hideLoading()
       return;
      }
    }, 2000)
   if(openId) {
     pageIndex = 1;
     // 左侧 品类列表
     wx.request({
       url: api.getAllCategory,
       method: 'GET',
       data: {
         openId: openId,
         systemVersion: systemVersion
         //unionId: unionId
       },
       header: {
         'Accept': 'application/json'
       },
       success: function (res) {
         // for (var i = 0; i < res.data.data.results.length; i++) {

         //   if (res.data.data.results[i].id == optionsnum) {
         //     var righttitle = res.data.data.results[i].name;

         //   }
         // }

         that.setData({
           // curNav: options.id,
           curNav: that.data.curNav,
           // navLeftItems: res.data.data.results,
           navLeftItems: [{ id: 1, name: "超值组合" }],
           // rightTitle: righttitle

         })
       }
     })

     //右侧 商品列表
     wx.request({
       url: api.queryCombinationCommodity,
       method: 'GET',
       data: {
         openId: openId,
         //unionId: unionId,
         productCategoryId: that.data.productCategoryId,
          pageIndex: pageIndex,
          systemVersion: systemVersion
       },
       header: {
         'Accept': 'application/json'
       },
       success: function (res) {
         if (timer) {
           overtime = false;
           clearTimeout(timer)
         } else {
           return;
         }
        //  overtime = false;
         console.log(res)
         wx.hideLoading()
         that.setData({
           lists: res.data.data.results,
         })
         allPage = res.data.data.pagination.allPage

       },
       fail: function(res){
         overtime = true;
         wx.hideLoading()
         that.setData({
           overtime: true
         })
       }
     })
     //查询购物车商品数量
     wx.request({
       url: api.queryCommodityNumFromShoppingCart,
       data: {
         openId: openId,
         systemVersion: systemVersion
       },
       success: function (res) {
         console.log(res)
       }
     })
   }
   //解决华为手机底部遮挡的问题
   wx.getSystemInfo({
     success: function (res) {
       console.log(parseInt(res.windowHeight * 2))
       that.setData({
         scrollHeightLeft: parseInt(res.windowHeight) + 380,
         scrollHeightRight: parseInt(res.windowHeight) + 340
       })
     }
   });

  },
  onShow: function () {
    var that = this;
    systemVersion = getApp().globalData.systemVersion
    //查询购物车商品数量
    wx.request({
      url: api.queryCommodityNumFromShoppingCart,
      data: {
        openId: openId,
        systemVersion: systemVersion
      },
      success: function (res) {
        console.log(res)
        if (res.data.code == "0") {
          that.setData({
            shopCarnum: res.data.data.commodityNum,
            shopCarTotalPrice: res.data.data.commonShoppingCartMoney,
            shopCarVipTotalPrice: res.data.data.vipShoppingCartMoney,
            categoryNum: res.data.data.commodityCount,
            shopCarServePrice: res.data.data.shoppingCartServeMoney
          })
        } else {
          tip.tip_msg(that, res.errMsg)
        }
      }
    })
  },
  scroll: function (event) {
    // console.log(event)
  },
  lower: function () {
    var that = this;
    ++pageIndex;
    console.log(pageIndex)
    if (pageIndex > allPage) {
      that.setData({
        showNomore: true
      })
      return;
    } else {
      wx.request({
        url: api.queryCombinationCommodity,
        method: 'GET',
        data: {
          openId: openId,
          productCategoryId: that.data.productCategoryId,
          pageIndex: pageIndex,
          systemVersion: systemVersion
        },
        header: {
          'Accept': 'application/json'
        },
        success: function (res) {
          
          that.setData({
            lists: that.data.lists.concat(res.data.data.results),
            pagination: res.data.data.pagination,

          })

        }
      })
    }
  },

  //商品选择 颜色处理函数
  switchColor: function (e) {
    var that = this;
    var color = e.target.dataset.color;
    // console.log(color);
    that.setData({
      colorNav: color, //嘴中选择的颜色
    })
  },

  //商品选择 型号处理函数
  switchType: function (e) {
    var attriBute = that.data.attriBute;


    var that = this;
    let id = e.target.dataset.id;
    that.setData({
      typeNav: id,
    })

  },

  //点击购物车显示购物车列表
  addBtn: function (e) {
    var that = this;
    shopingCartPageIndex = 1;
    var currentStatu = e.currentTarget.dataset.statu;
    var showThis = e.currentTarget.dataset.show;
    var dataId = e.currentTarget.dataset.id;
    console.log(showThis)
    if (!showThis) {
      that.setData({
        mask_show: false
      })
    }
    common.common(currentStatu, that, 200, showThis);
    if (showThis == "shopCarModal") {
      shopingCartPageIndex = 1;
      console.log(openId)
      console.log(shopingCartPageIndex)
      that.getShoppingList(that);
      that.setData({
        mask_show: true
      })
    }

  },



  //弹出 商品 型号，颜色，规格选择框
  showGoodchose: function (e) {
    var that = this;
    that.checkboxChange(e)
    console.log(e.currentTarget.dataset)
    var currentStatu = e.currentTarget.dataset.statu;
    var showThis = e.currentTarget.dataset.show;
    var dataId = e.currentTarget.dataset.id;

    console.log(showThis)

    if (showThis) {
      that.setData({
        chooseNum: 1
      })
    }
    that.setData({
      mask_show: true
    })
    wx.request({
      url: api.commotifyPropertyById,
      method: 'GET',
      data: {
        openId: openId,
        //unionId: unionId,
        id: dataId,
        systemVersion: systemVersion
      },
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        console.log(res.data.data)
        //判断是否有颜色
        if (res.data.data.color.length != 0) {

          var colorId = res.data.data.color[0].id
        } else {

          colorId = "";
        }
        //判断是否有材料材质
        if (res.data.data.material.length != 0) {

          var materialId = res.data.data.material[0].id
        } else {

          materialId = "";
        }
        //判断是否 有类型
        if (res.data.data.attribute.length != 0) {
          var attriBute = res.data.data.attribute;
          var length = attriBute.length;
          var NavNum = [];
          var NavId = [];
          for (let i = 0; i < length; i++) {
            NavNum.push(0);
            NavId.push(0);
          };
          that.setData({
            NavNum: NavNum,
            NavId: NavId,
          })

        } else {
          attriBute = "";
        }
        console.log(NavId)
        that.setData({
          goodsChose: res.data.data,
          attriBute: res.data.data.attribute,
          paidService: res.data.data.paidService,
          NavNum: NavNum,
          shopId: dataId,
          NavId: NavId,//属性id
          colorId: colorId,//颜色id 颜色 初始化
          materialId: materialId //材料材质id
        })
        common.common(currentStatu, that, 200, showThis);
      }
    })



  },
  //添加到购物车
  formSubmit: function (e) {
    var that = this;

    var formRes = {
      commodityId: that.data.goodsChose.commodityId,
      "number": that.data.chooseNum,
      attribute: [],
      serve: [],
      productColorId: "",
      materialId: "",
    }
    console.log(formRes)
    console.log(that.data.goodsChose)
    console.log(that.data.NavNum);

    console.log(that.data.attriBute)

    //如果有颜色属性
    if (that.data.colorId) {
      formRes.productColorId = that.data.colorId
    }
    //如果有材料材质
    if (that.data.materialId) {
      formRes.materialId = that.data.materialId
    }
    //如果有其它属性
    var attrArr = that.data.NavNum

    if (!!attrArr) {
      attrArr.forEach((item, index) => {
        let attrItem = that.data.attriBute[index];
        formRes.attribute.push({
          // attributeName: attrItem.name,
          // attributeValueName: attrItem.AttributeValue[item].name
          attributeValueId: attrItem.AttributeValue[item].id
        })
      })
    }
    //如果有付费服务
    if (that.data.paidService.length > 0) {
      //如果有选择付费服务
      let shopCheck = that.data.shopCheck
      if (shopCheck) {
        shopCheck.forEach((item, index) => {
          formRes.serve.push({
            serveId: item
          })
        })
      }
    }
    formRes.openId = openId;
    formRes.attribute = JSON.stringify(formRes.attribute);
    formRes.serve = JSON.stringify(formRes.serve);
    formRes.systemVersion=systemVersion
    wx.request({
      url: api.addCommodityToShoppingCart,
      method: 'POST',
      data: formRes,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res)
        console.log(openId)
        var resCode = res.data.code
        if (resCode != 0) {
          tip.tip_msg(that, res.data.message)
        }
        // that.setData({
        //   shopCarnum: 1
        // })
        //查询购物车商品数量
        wx.request({
          url: api.queryCommodityNumFromShoppingCart,
          data: {
            openId: openId,
            systemVersion: systemVersion
          },
          success: function (res) {
            if (res.data.code == "0") {
              that.setData({
                shopCarnum: res.data.data.commodityNum,
                shopCarTotalPrice: res.data.data.commonShoppingCartMoney,
                shopCarVipTotalPrice: res.data.data.vipShoppingCartMoney,
                categoryNum: res.data.data.commodityCount,
                shopCarServePrice: res.data.data.shoppingCartServeMoney
              })
            } else {
              tip.tip_msg(that, res.data.message)
            }
          }
        })
      }
    })

  },

  // checkbox
  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    var that = this;
    that.setData({
      shopCheck: e.detail.value
    })

  },


  // 购物车页面数量控制 增加
  shopCarnumAdd: function (e) {
    var that = this;
    let shoppingcartLists = that.data.shoppingcartLists; //购物车列表

    let currentIndex = e.currentTarget.dataset.index //购物车当前商品index

    let changeNumId = e.currentTarget.dataset.id//购物车当前商品id
    //如果正在--,返回
    if (reduceNumTimer) {
      return;
    }
    //如果定时器不存在,首次点击加号
    if (!updataNumTimer) {

      shoppingGoodsNum = that.data.shoppingcartLists[currentIndex].number;
      lastshoppingGoodsNum = shoppingGoodsNum
      console.log("请求前的商品数量++" + lastshoppingGoodsNum)
    }
    // if (shoppingcartLists[currentIndex].number >= 999) {
    //   tip.tip_msg(that, "单个添加数量已达上限")
    //   return;
    // }
    shoppingGoodsNum++;
    if (shoppingGoodsNum > 999) {
      shoppingGoodsNum = 999;
      tip.tip_msg(that, "单个添加数量已达上限")
      return;
    }
    that.data.shoppingcartLists[currentIndex].number = shoppingGoodsNum;
    that.setData({
      shoppingcartLists: that.data.shoppingcartLists
    })
    console.log(shoppingGoodsNum)
    let currentNum = shoppingcartLists[currentIndex].number++;
    if (updataNumTimer) {
      console.log("定时器存在,取消修改请求")
      return;
    }
    //修改购物车商品数量
    updataNumTimer = setTimeout(function () {
      console.log("1s后执行")

      wx.request({
        url: api.updateNumFromShoppingCart,
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          openId: openId,
          shoppingCartItemId: changeNumId,
          unionId: unionId,
          num: shoppingGoodsNum,
          systemVersion: systemVersion
        },
        success: function (res) {
          clearTimeout(updataNumTimer);
          updataNumTimer = null;
          console.log(res)
          //that.getShoppingList(that)
          shoppingcartLists[currentIndex].number = shoppingGoodsNum;
          that.setData({
            shoppingcartLists: shoppingcartLists
          })
          //查询购物车商品数量
          wx.request({
            url: api.queryCommodityNumFromShoppingCart,
            data: {
              openId: openId,
              systemVersion: systemVersion
            },
            success: function (res) {
              if (res.data.code == "0") {
                that.setData({
                  shopCarnum: res.data.data.commodityNum,
                  shopCarTotalPrice: res.data.data.commonShoppingCartMoney,
                  shopCarVipTotalPrice: res.data.data.vipShoppingCartMoney,
                  categoryNum: res.data.data.commodityCount,
                  shopCarServePrice: res.data.data.shoppingCartServeMoney
                })
              } else {
                tip.tip_msg(that, res.data.message)
              }
            }
          })
        },
        fail: function () {
          clearTimeout(updataNumTimer);
          updataNumTimer = null;
          tip.tip_msg(that, "网络异常,请重试")
          shoppingcartLists[currentIndex].number = lastshoppingGoodsNum;
          that.setData({
            shoppingcartLists: shoppingcartLists
          })
        }
      })
    }, 500)

  },
  // 购物车页面数量控制 减少
  shopCarnumReduce: function (e) {
    var that = this;

    let shoppingcartLists = that.data.shoppingcartLists; //购物车列表
    let currentIndex = e.currentTarget.dataset.index //购物车当前商品index
    let changeNumId = e.currentTarget.dataset.id//购物车当前商品id
    let currentNum = shoppingcartLists[currentIndex].number - 1;
    // console.log(currentNum)
    console.log(that.data.shoppingcartLists[currentIndex].number)
    //如果正在++,返回
    if (updataNumTimer) {
      return;
    }
    if (!reduceNumTimer) {
      shoppingGoodsNumReduce = that.data.shoppingcartLists[currentIndex].number;
      lastshoppingGoodsNum = shoppingGoodsNumReduce
      console.log("请求前的商品数量--" + lastshoppingGoodsNum)
    }
    shoppingGoodsNumReduce--;

    console.log(shoppingGoodsNumReduce)
    if (shoppingGoodsNumReduce <= 0) {
      shoppingGoodsNumReduce = 1;
      tip.tip_msg(that, "不能再减了")
      return;
    }
    that.data.shoppingcartLists[currentIndex].number = shoppingGoodsNumReduce;
    that.setData({
      shoppingcartLists: that.data.shoppingcartLists
    })
    if (reduceNumTimer) {
      console.log("定时器存在,取消修改请求")
      return;
    }
    reduceNumTimer = setTimeout(function () {

      console.log(shoppingGoodsNumReduce)
      console.log("1s后执行--")
      wx.request({
        url: api.updateNumFromShoppingCart,
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          openId: openId,
          shoppingCartItemId: changeNumId,
          unionId: unionId,
          num: shoppingGoodsNumReduce,
          systemVersion: systemVersion
        },
        success: function (res) {
          console.log("修改成功")
          clearTimeout(reduceNumTimer);
          reduceNumTimer = null;
          // that.getShoppingList(that)
          shoppingcartLists[currentIndex].number = shoppingGoodsNumReduce;
          that.setData({
            shoppingcartLists: shoppingcartLists
          })

          //查询购物车商品数量
          wx.request({
            url: api.queryCommodityNumFromShoppingCart,
            data: {
              openId: openId,
              systemVersion: systemVersion
            },
            success: function (res) {
              if (res.data.code == "0") {
                that.setData({
                  shopCarnum: res.data.data.commodityNum,
                  shopCarTotalPrice: res.data.data.commonShoppingCartMoney,
                  shopCarVipTotalPrice: res.data.data.vipShoppingCartMoney,
                  categoryNum: res.data.data.commodityCount,
                  shopCarServePrice: res.data.data.shoppingCartServeMoney
                })
              } else {
                tip.tip_msg(that, res.data.message)
              }
            }
          })
        },
        fail: function (res) {
          clearTimeout(updataNumTimer);
          reduceNumTimer = null;
          tip.tip_msg(that, "网络异常,请重试")
          shoppingcartLists[currentIndex].number = lastshoppingGoodsNum;
          that.setData({
            shoppingcartLists: shoppingcartLists
          })
        }
      })
    }, 500)


  },
  //购物车页面数量  直接输入文字改变
  shopCarwritenum: function (e) {
    var that = this;
    let shoppingcartLists = that.data.shoppingcartLists; //购物车列表

    let currentIndex = e.currentTarget.dataset.index //购物车当前商品index

    let changeNumId = e.currentTarget.dataset.id//购物车当前商品id

    let currentNum = e.detail.value;
    if (currentNum <= 0) {
      console.log(e)
      tip.tip_msg(that, "数量不能小于1哦！！");
      console.log(that.data.currentNum)
      currentNum = 1
    }
    wx.request({
      url: api.updateNumFromShoppingCart,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        openId: openId,
        shoppingCartItemId: changeNumId,
        unionId: unionId,
        num: currentNum,
        systemVersion: systemVersion
      },
      success: function (res) {
        console.log(res)
        that.getShoppingList(that)

        //查询购物车商品数量
        wx.request({
          url: api.queryCommodityNumFromShoppingCart,
          data: {
            openId: openId,
            systemVersion: systemVersion
          },
          success: function (res) {
            if (res.data.code == "0") {
              that.setData({
                shopCarnum: res.data.data.commodityNum,
                shopCarTotalPrice: res.data.data.commonShoppingCartMoney,
                shopCarVipTotalPrice: res.data.data.vipShoppingCartMoney,
                categoryNum: res.data.data.commodityCount,
                shopCarServePrice: res.data.data.shoppingCartServeMoney
              })
            } else {
              tip.tip_msg(that, res.data.message)
            }
          }
        })
      }
    })


  },
  //商品列表数量--
  goodsCarnumReduce: function () {
    var that = this;
    if (that.data.chooseNum == 1) {
      tip.tip_msg(that, "不能再减了");
      return;
    }
    if (that.data.shopCarnum > 0) {
      that.setData({
        chooseNum: that.data.chooseNum - 1
      })
    }
  },
  //商品数量++
  goodsCarnumAdd: function () {
    var that = this;
    if (this.data.chooseNum >= 999) {
      tip.tip_msg(that, "单个商品数量添加已达上限")
      return;
    }
    that.setData({
      chooseNum: that.data.chooseNum + 1
    })
  },
  //清空购物车
  clearShoppingCart: function () {
    var that = this;


    if (that.data.shoppingcartLists.length == 0) {
      tip.tip_msg(this, "已经没有商品了！！");
    } else {
      wx.showModal({

        content: '清空购物车?',
        success: function (res) {
          if (res.confirm) {
            wx.request({
              url: api.clearShoppingCart,
              method: 'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              data: {
                openId: openId,
                systemVersion: systemVersion
              },
              success: function (res) {
                console.log(res)
                that.setData({
                  shoppingcartLists: ""
                })

                //查询购物车商品数量
                wx.request({
                  url: api.queryCommodityNumFromShoppingCart,
                  data: {
                    openId: openId,
                    systemVersion: systemVersion
                  },
                  success: function (res) {
                    console.log(res)
                    if (res.data.code == "0") {
                      that.setData({
                        shopCarnum: res.data.data.commodityNum,
                        shopCarTotalPrice: res.data.data.commonShoppingCartMoney,
                        shopCarVipTotalPrice: res.data.data.vipShoppingCartMoney,
                        categoryNum: res.data.data.commodityCount,
                        shopCarServePrice: res.data.data.shoppingCartServeMoney
                      })
                    } else {
                      tip.tip_msg(that, res.errMsg)
                    }
                  }
                })
              }
            })

          } else if (res.cancel) {

          }
        }
      })

    }

  },
  //购物车删除单一商品
  shopCarRemove: function (e) {
    var that = this;
    let removeId = e.currentTarget.dataset.id
    wx.request({
      url: api.removeCommodityFromShoppingCart,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        openId: openId,
        shoppingCartItemIds: removeId,
        unionId: unionId,
        systemVersion: systemVersion
      },
      success: function (res) {
        that.getShoppingList(that)

        //查询购物车商品数量
        wx.request({
          url: api.queryCommodityNumFromShoppingCart,
          data: {
            openId: openId,
            systemVersion: systemVersion
          },
          success: function (res) {
            console.log(res)
            if (res.data.code == "0") {
              that.setData({
                shopCarnum: res.data.data.commodityNum,
                shopCarTotalPrice: res.data.data.commonShoppingCartMoney,
                shopCarVipTotalPrice: res.data.data.vipShoppingCartMoney,
                categoryNum: res.data.data.commodityCount,
                shopCarServePrice: res.data.data.shoppingCartServeMoney
              })
            } else {
              tip.tip_msg(that, res.errMsg)
            }
          }
        })
      }
    })
  },
  //购物车下拉刷新事件
  shoppingCartPullDown: function () {
    console.log("到底啦")
    //this.getShoppingList();
  },
  //购物车请求列表事件
  getShoppingList: function (that) {
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
  },
  //失去焦点时自主选择商品数量
  chooseCommodityNum: function (e) {
    var that = this;
    that.data.chooseNum = e.detail.value;
    let blurValue = e.detail.value;
    if (blurValue == 0) {
      blurValue = 1;
      tip.tip_msg(that, "不能小于1哦")
    }
    that.setData({
      chooseNum: parseInt(e.detail.value),
      shopCarnum: parseInt(e.detail.value)
    })
  },
  getMeaun: function () {
    var that = this;
    console.log(that.data.shoppingcartLists.length)

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
          showShopCarready: true,
        })
        if (that.data.shoppingcartLists.length > 0) {
          wx.navigateTo({
            url: '../../order_manage/firm_order/firm_order'
          })
        } else {
          tip.tip_msg(that, "请先添加商品到购物车哦···");
        }
      }
    })
   
  },
  //转发
  onShareAppMessage: function (e) {
    getApp().shareMessage(e, shareMessageArg)
  },
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
  //搜索聚焦跳转至搜索页面
  focus_search: function () {
    wx.navigateTo({
      url: '../search/search',
    })
  }

})