Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData:{},
  },


  onLoad: function (options) {
    this.getInfo(options.orderId);
  },



  /**
   * item点击事件
   * 获取item数据
   */
  v_item_itemOnClick: function (e) {
    /*var bean = e.currentTarget.dataset.index;
    console.log(JSON.stringify(bean));
    var jsonDate = JSON.stringify(bean); //传递object数据给下一页面
    wx.navigateTo({
      url: "../zqg_detail/zqg_detail?date=" + jsonDate,
    })*/
  },


  getInfo: function (orderId) {
    var reqTask = wx.request({
      url: wx.db.url('stat/periodOrderList'),
      data: {
        "orderId": orderId,
      },
      header: {
        'content-type': 'application/json',
        Authorization: `Bearer ${wx.RiceUserToken}`
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (result) => {
        console.log(JSON.stringify(result));
        var statusCode = result.statusCode; //statusCode为200表示接口请求成功
        var code = result.data.code; //code为0表示获取数据成功
        if (statusCode == 200) {
          if (code == 0) {
            this.setData({
              listData: result.data.data,
            })
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
        wx.showToast({
          title: result.errMsg,
          icon: "none"
        });
      },
      complete: () => {
        console.log("complete");
      }
    });
  },

})