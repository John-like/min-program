//显示遮层函数



const common = function (currentStatu, that, time, showThis) {
  /* 动画部分 */
  // 第1步：创建动画实例 
  // var that = this;
  var showThis = showThis;
  var showTime = time;
  console.log(showTime)
  //console.log(showThis)
  var animation = wx.createAnimation({
    duration: time, //动画时长 
    timingFunction: "linear", //线性 
    delay: 0 //0则不延迟 
  });

  // 第2步：这个动画实例赋给当前的动画实例 
  that.animation = animation;


  // 第3步：执行第一组动画 
  //判断是否侧面滑动 如果有，执行侧面动画
  if (showThis == 'screeningShop' || showThis == 'right'){
    animation.opacity(0).translateX(100).step();
  }else{
    animation.opacity(0).translateY(200).step();
  }
  

  // 第4步：导出动画对象赋给数据对象储存 
  that.setData({
    showSignRemarks: animation.export()
  })

  // 第5步：设置定时器到指定时候后，执行第二组动画 
  setTimeout(function () {
    // 执行第二组动画 
    if (showThis == 'screeningShop' || showThis == 'right') {
      animation.opacity(1).translateX(0).step();
    }else{
      animation.opacity(1).translateY(0).step();
    }
   
    // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象 
    that.setData({
      showSignRemarks: animation
    })

    //关闭 
    if (currentStatu == "close") {
      
      that.setData(
        {
          showModalStatus: false,
        }
      );
      // 点击类型的判断
      if (showThis == "shopCarModal") {
        that.setData(
          {
            shopCarModal: false,
          }
        );
      } else if (showThis == "addShopModal") {
        that.setData(
          {

            addShopModal: false
          }
        );
      } else if (showThis == "messageModal") {
        that.setData(
          {
            messageModal: false,
          }
        );
      } else if (showThis == "screeningShop"){
        that.setData(
          {
            screeningShop: false,
          }
        );
      } else if (showThis == "paymentModal") {
        that.setData({
          paymentModal: false,
          bankModal: false
        })
      } else if (showThis == "colorModal") {
        that.setData({
          colorModal: false
        })
      } else if (showThis == "bankModal") {
        that.setData({
          bankModal: false
        })
      } else{
        that.setData(
          {
            messageModal: false,
            addShopModal: false,
            shopCarModal: false,
            screeningShop: false,
            paymentModal: false,
            colorModal: false,
            bankModal: false
          }
        );
      }


    }
  }.bind(that), 200)


  // 显示 
  if (currentStatu == "open") {
    that.setData(
      {
        showModalStatus: true,
      }
    );
    // 点击类型的判断
    if (showThis == "shopCarModal") {
      that.setData(
        {

          shopCarModal: true,
        }
      );
    } else if (showThis == "addShopModal") {
      that.setData(
        {

          addShopModal: true
        }
      );
    } else if (showThis == "messageModal") {
      that.setData(
        {
          messageModal: true,
        }
      );
    } else if (showThis == "screeningShop"){
      that.setData(
        {
          screeningShop: true,
        }
      );
    } else if (showThis == "paymentModal") { 
      that.setData({
        paymentModal: true
      })
    } else if (showThis == "colorModal") {
      that.setData({
        colorModal: true
      })
    } else if (showThis == "bankModal") {
      that.setData({
        bankModal: true,
        paymentModal: false
      })
    }

  }



}
//  return util
// }

module.exports = {
  common: common
}


