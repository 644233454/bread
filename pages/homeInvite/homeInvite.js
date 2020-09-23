Page({

  /**
   * 页面的初始数据
   */
  data: {
    bg:"/assets/imgs/fxs_invite_bg.png",
    slogan:"邀请一起加入，推广赢奖励",
    topBgDefaultName:"",
    topBgDefaultPortrait:"",
    info:"",
  },

  /**
  * 网络请求
  */
  onLoad: function () {
    this.getInfo();
  },

  getInfo: function () {
    this.data.topBgDefaultName = wx.nickName;
    this.data.topBgDefaultPortrait = wx.headImgUrl;
    //刷新上面的数据
    this.setData(this.data);
    //let pageUrl ="../../home/home";
    let pageUrl = "";
    var reqTask = wx.request({
      url: wx.db.url('promote/product'),
      data: {
        "page": "pages/list/list", //小程序码全部跳转至首页
        "pId": "",
      },
      header: {
        'content-type': 'application/json',
        Authorization: `Bearer ${wx.RiceUserToken}`
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (result) => {
        //console.log(JSON.stringify(result));
        var statusCode = result.statusCode; //statusCode为200表示接口请求成功
        var code = result.data.code; //code为0表示获取数据成功
        if (statusCode == 200) {
          if (code == 0) {
            console.log(result.data.data);
            this.setData({
              info: this.getBase64ImageUrl(result.data.data),
            });
          } else {
            console.log("statusCode == 200 && code != 0");
            wx.showToast({
              title: result.data.msg,
              icon: "none"
            });
          }
        } else {
          console.log("statusCode != 200");
          wx.showToast({
            title: result.errMsg,
            icon: "none"
          });
        }
      },

      fail: () => {
        console.log("fail");
        wx.showToast({
          title: result.data.errMsg,
          icon: "none"
        });
      },
      complete: () => {
        console.log("complete");
      }
    });
  },


  //把base64转换成图片
  getBase64ImageUrl: function (data) {
    /// 获取到base64Data
    var base64Data = data;
    /// 通过微信小程序自带方法将base64转为二进制去除特殊符号，再转回base64
    base64Data = wx.arrayBufferToBase64(wx.base64ToArrayBuffer(base64Data));
    /// 拼接请求头，data格式可以为image/png或者image/jpeg等，看需求
    const base64ImgUrl = "data:image/png;base64," + base64Data;
    console.log(base64ImgUrl);
    return base64ImgUrl;
  },

})
