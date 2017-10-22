var app = getApp();
Page({
  data: {
    pics: []
  },
  
  onLoad: function (options) {

  },
  uploadDIY(filePaths, successUp, failUp, i, length) {
    var that = this;
    // app.toastShow(0, "图片上传中...", 20000000, 1);
    wx.uploadFile({
      url: '/uploadurl/',
      filePath: filePaths[i],
      name: 'file',
      formData: {
        'user': 'test'
      },
      success: (res) => {
        successUp++;
        var srcArr = that.data.src;
        srcArr.push(filePaths[i]),
          that.setData({
            src: srcArr
          });

        var data = JSON.parse(res.data);
        var newpicKeys = that.data.picKeys;
        newpicKeys.push(data.data['pic_key']);
        that.setData({
          picKeys: newpicKeys
        });
      },
      fail: (res) => {
        that.setData({
          isuploaderror: 1
        });
        failUp++;
      },
      complete: () => {
        i++;
        if (i == length) {
          wx.hideToast();
          var txt = '总共' + successUp + '张上传成功,' + failUp + '张上传失败！';
         // app.toastShow(0, txt, 2000, 1);
        } else {  //递归调用uploadDIY函数
          if (that.data.isuploaderror) {
           // app.toastShow(0, '图片上传失败，请重新选择上传', 2000, 1);
          } else {
            this.uploadDIY(filePaths, successUp, failUp, i, length);
          }
        }
      }
    });
  },
  uploadImage: function (e) {
    var that = this;
    that.setData({
      isuploaderror: 0
    });
    // var nowLen = that.data.src.length;
    // var remain = 9 - nowLen;
    wx.chooseImage({
      count: 4,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        console.log(res)
        var successUp = 0; //成功个数
        var failUp = 0; //失败个数
        var length = res.tempFilePaths.length; //总共个数
        var i = 0; //第几个
        this.uploadDIY(res.tempFilePaths, successUp, failUp, i, length);
      },
    });
  },

})