const util = require('../../../utils/util.js')
Page({

  data: {
    showPage: false,
    showLoading: true,
    info: {},
    status: "",
    title: "",
    titleImageUrl: "",
    titleSub: "",
    titleSubBottom: "",
    couponCode: "",
    progress: "",
    remark: "",
    logisticInfo: "暂无物流信息",
  },


  onLoad: function(options) {
    this.getInfo(options.orderId);
    this.setData({
      couponCode: options.couponCode,
      progress: options.progress,
      remark: options.remark,
    })
  },


  /**
   * 查看物流信息
   */
  logistic: function() {
    if (this.data.logisticInfo == '' || this.data.logisticInfo != '暂无物流信息') {
      var logisticsInfosStr = JSON.stringify(this.data.info.logisticsInfos);
      wx.navigateTo({
        url: `/pages/logisticsInfoList/logisticsInfoList?logisticsInfos=${encodeURIComponent(logisticsInfosStr)}`
      });
    }
  },

  /**
   * 拨打电话
   */
  call: function() {
    wx.makePhoneCall({
      phoneNumber: wx.customerPhone,
      success: (result) => {

      },
      fail: () => {},
      complete: () => {}
    });
  },


  /**
   * 复制
   */
  copy: function() {
    console.log("copy");
    let info = this.data.info.orderNum;
    wx.setClipboardData({
      data: info,
      success: function(res) {
        wx.getClipboardData({
          success: function(res) {
            console.log(res.data) // data
          }
        })
      }
    });
  },


  /**
   * 确认收货
   */
  takeDelivery: function() {
    console.log("用户确认收货");
    var reqTask = wx.request({
      url: wx.db.url('order/confirmReceive'),
      data: {
        "orderId": this.data.info.orderId,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${wx.RiceUserToken}`
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: (result) => {
        console.log(JSON.stringify(result));
        var statusCode = result.statusCode; //statusCode为200表示接口请求成功
        var code = result.data.code; //code为0表示获取数据成功
        if (statusCode == 200) {
          if (code == 0) {
            console.log("用户确认收货成功");
            //刷新本页面
            this.getInfo(this.data.info.orderId);
            this.setData({
              status: "",
              title: "",
              titleImageUrl: "",
              titleSub: "",
              titleSubBottom: "",
            })
            clearInterval(this.data.timer);
            wx.showToast({
              title: "收货成功",
              icon: "none",
            });
            /**
             * 用户返回上上一页
             * wx.navigateBack({
              delta: 2
            })*/
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

  getInfo: function(orderId) {
    var reqTask = wx.request({
      url: wx.db.url('order/detail'),
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
            let info = result.data.data;
            let status = info.status;
            let title = "";
            let titleImage = "";
            let titleSub = "";
            let titleSubBottom = "";
            if (status == "0") {
              title = "待付款订单";
              titleSub = "等待买家付款";
            } else if (status == "1") {
              title = "待发货订单";
              titleImage = "/assets/imgs/userWaitPayTopImage.png";
              titleSub = "等待商家发货";
              titleSubBottom = "请耐心等待卖家发货";
            } else if (status == "2") {
              title = "已发货订单";
              titleImage = "/assets/imgs/orderOverImage.png";
              titleSub = "商家已发货";
              // titleSubBottom = info.autoConfirmTime + "之前自动确认完成";
              //还剩{ { timeLeft } } 自动确认完成
              if (result.data.data.autoConfirmTime.length > 0) {
                let autoTime = result.data.data.autoConfirmTime.replace(/-/g, "/");
                this.data.timer = setInterval(() => {
                  this.setData({
                    titleSubBottom: "还剩" + util.getTimeLeft(autoTime) + "自动确认完成",
                  });
                  if (util.getTimeLeft(autoTime) == "0天0时0分0秒") {
                    clearInterval(this.data.timer);
                    this.getInfo();
                  };
                }, 1000);
              }

            } else if (status == "3") {
              titleImage = "/assets/imgs/orderDone.png";
              title = "待评价订单";
              titleSub = "等待买家评价";
              titleSubBottom = "交易完成";
            } else if (status == "4") {
              title = "交易完成订单";
              titleImage = "/assets/imgs/orderDone.png";
              titleSub = "已完成";
              titleSubBottom = "交易完成";
            } else if (status == "5") {
              title = "已关闭订单";
              titleImage = "/assets/imgs/orderCloseImage.png";
              titleSub = "已关闭";
            }

            //logisticInfo
            let logisticsTips = "暂无物流信息";
            let logisticsInfos = result.data.data.logisticsInfos;
            let logisticsInfosLength = logisticsInfos.length;
            if (!this.isObjectEmpty(logisticsInfos) && logisticsInfosLength != 0) {
              if (logisticsInfosLength == 1) {
                logisticsTips = "快递单号：" + result.data.data.logisticsInfos[0].logisticsNum;
              } else {
                logisticsTips = "该订单拆成" + logisticsInfosLength + "个包裹发出，可点击查看详情";
              }
            }
            this.setData({
              showPage: true,
              info: info,
              status: status,
              title: title,
              titleImageUrl: titleImage,
              titleSub: titleSub,
              titleSubBottom: titleSubBottom,
              logisticInfo: logisticsTips,
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
        console.log("fail");
        wx.showToast({
          title: result.errMsg,
          icon: "none"
        });
      },
      complete: () => {
        console.log("complete");
        this.setData({
          showLoading: false,
        })
      }
    });
  },

  isObjectEmpty: function(obj) {
    return obj === null || (!Object.getOwnPropertyNames(obj).length && !Object.getOwnPropertySymbols(obj).length);
  },


})