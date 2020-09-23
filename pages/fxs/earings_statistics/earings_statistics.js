Page({

  /**
   * 页面的初始数据
   */
  data: {
    customeTimeArrow: "/assets/imgs/fxs_earings_statistics_custome_time.png",
    centerline: "/assets/imgs/fxs_earings_statistics_centerline.png",
    rightArror:"/assets/imgs/fxs_right_small.png",

    tabBgSelectedColor: "#FFE8EE",
    tabBgUnSelectedColor: "#F6F6F6",
    tabTextSelectedColor: "#F3345C",
    tabTextUnSelectedColor: "#999999",
    tabSelectedIndex: 0,

    info: {}
  },



  /**
   * 全部
   */
  v_tabAll_click: function() {
    this.setData({
      tabSelectedIndex: 0
    });
    this.getInfo();
  },

  /**
   * 今日
   */
  v_tabToday_click: function() {
    this.setData({
      tabSelectedIndex: 1
    });
    this.getInfo();
  },

  /**
   * 昨日
   */
  v_tabYesterday_click: function() {
    this.setData({
      tabSelectedIndex: 2
    });
    this.getInfo();
  },

  /**
   * 近七日
   */
  v_tab7Days_click: function() {
    this.setData({
      tabSelectedIndex: 3
    });
    this.getInfo();
  },

  /**
   * 自定义时间
   */
  v_tabCustomeTime_click: function() {
    this.setData({
      tabSelectedIndex: 4
    })
  },


  /**
   * 网络请求
   * 收益统计
   */
  onLoad: function() {
    this.getInfo();
  },

/**
 * 收益明细
 * 订单统计
 */
  v_earinsDetail_click:function(){
    wx.navigateTo({
      url: "../orders_statistics/orders_statistics"
    })
  },


  getInfo: function() {
    let startTime = "";
    let endTime = "";
    if (this.data.tabSelectedIndex == 0) {
      startTime = "1970-01-01 00:00:00";
      endTime = "2970-01-01 23:59:59";
    } else if (this.data.tabSelectedIndex == 1) {
      startTime = this.getDateStr(0)+" 00:00:00";
      endTime = this. getDateStr(0) + " 23:59:59";
    } else if (this.data.tabSelectedIndex == 2){
      startTime = this.getDateStr(-1) + " 00:00:00";
      endTime = this.getDateStr(-1) + " 23:59:59";
    } else if (this.data.tabSelectedIndex == 3) {
      startTime = this.getDateStr(-7) + " 00:00:00";
      endTime = this.getDateStr(0) + " 23:59:59";
    } else if (this.data.tabSelectedIndex == 4) {
      //自定义时间
    }
    console.log(startTime + "---" + endTime);
    var reqTask = wx.request({
      url: wx.db.url('stat/info'),
      data: { "startTime": startTime, "endTime": endTime},
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
              info: result.data.data,
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

  getDateStr:function(AddDayCount) {
    var dd = new Date();
    dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1;//获取当前月份的日期
    var d = dd.getDate();
    //console.log('前天：', getDateStr(-2)); // 前天： 2018-09-11
    //console.log('昨天：', getDateStr(-1)); // 昨天： 2018-09-12
    //console.log('今天：', getDateStr(0));  // 今天： 2018-09-13
    //console.log('明天：', getDateStr(1));  // 明天： 2018-09-14
    //console.log('后天：', getDateStr(2));  // 后天： 2018-09-15
    return y + '-' + (m < 10 ? '0' + m : m) + '-' + d;
  }


})