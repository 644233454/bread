// pages/fxs/zqg_detail/zqg_detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPage: false,
    showLoading: true,
    couponCode: "", //上个页面携带过来的数据
    info: {}, //本页面接口请求的数据
    deliveryDateTimeDes: "",
    //info.deliveryRecordInfoList.status,0=待付款,1=待发货,2=已发货,3=待评价,4=交易完成,5=已关闭
    deliveryDate: "",
    alterDeliveryTimeList: [],
    alterDeliveryTimeListSelectedIndex: 0,
    alterDeliveryTimeListSelectedRealIndex: 0,
    showDialog: false,

    firstCome: true,
    clickAlterAddress: false,
    remark: "",
  },


  onShow: function() {
    if (!this.data.firstCome) {
      //为空，跳转到addAddress页面后单击item后返回数据
      var AlterZQGaddressInfo = wx.getStorageSync('AlterZQGaddressInfo');
      console.log(AlterZQGaddressInfo);
      let isAddressEmpty = this.isObjectEmpty(AlterZQGaddressInfo);
      console.log(isAddressEmpty);
      //用户没有去点击修改地址，可是地址不为空；
      if (!isAddressEmpty && this.data.clickAlterAddress) {
        //更新收货地址接口
        this.updateDeliveryAddress(AlterZQGaddressInfo);
      } else {
        this.getInfo();
      }
    } else {
      this.setData({
        firstCome: false,
      })
    }


  },

  onLoad: function(options) {
    this.setData({
      couponCode: options.couponCode
    })
    this.getInfo();
  },

  onUnload: function() {
    wx.setStorageSync(
      "AlterZQGaddressInfo", {},
    );
  },


  /**
   * item点击事件
   * 获取item数据
   */
  v_item_itemOnClick: function(e) {
    let index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: "../zqg_deliver/zqg_deliver?orderId=" + index.orderId + "&couponCode=" + this.data.info.couponCode + "&progress=" + this.data.info.progress + "&remark=" + this.data.remark,
    })
  },


  /**
   * 弹框
   * 修改送达时间
   */
  alterDeliveryTime: function() {
    console.log("alterDeliveryTime");
    let show = this.data.showDialog;
    this.setData({
      showDialog: !show,
      alterDeliveryTimeListSelectedIndex: this.data.alterDeliveryTimeListSelectedRealIndex,
    })
  },

  /**
   * 修改送达时间弹框
   * 非内容部分  阴影点击事件
   */
  v_dialog_alterDeliveryTime: function() {
    console.log("v_dialog_alterDeliveryTime")
    this.setData({
      showDialog: false,
    })
  },

  /**
   * 修改送达时间弹框
   * 单个button点击事件
   */
  bt_alterDeliveryTim: function(event) {
    console.log("bt_alterDeliveryTim");
    let index = event.currentTarget.dataset.index;
    this.setData({
      alterDeliveryTimeListSelectedIndex: index,
    })
  },

  /**
   * 修改送达时间弹框
   * 保存修改
   */
  alterDeliveryTime_save: function() {
    let time = this.data.alterDeliveryTimeList[this.data.alterDeliveryTimeListSelectedIndex];
    console.log(time);
    this.updateDeliveryDate(time);
    this.setData({
      showLoading: true,
    })
  },

  /**
   * 修改配送信息
   */
  alterDeliverInfo: function() {
    console.log("alterDeliverInfo");
    //如果进去把地址删除怎么办
    wx.navigateTo({
      url: `/pages/addAddress/addAddress?fromType=zqg_detail`
    });
    this.setData({
      clickAlterAddress: true,
    });
    wx.setStorageSync(
      "AlterZQGaddressInfo", {},
    );
  },

  /**
   * 拨打电话
   */
  call: function() {
    console.log("call");
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


  getInfo: function() {
    var reqTask = wx.request({
      url: wx.db.url('period/periodRecord/detail'),
      data: {
        "couponCode": this.data.couponCode,
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
            let TimeList = result.data.data.optionalDeliveryDate.split(",");
            let TimeListSelectedIndex = 0
            for (var i = 0, len = TimeList.length; i < len; i++) {
              if (result.data.data.deliveryDate == TimeList[i]) {
                TimeListSelectedIndex = i;
                break
              }
            }
            let date = result.data.data.deliveryDate;
            this.setData({
              showPage: true,
              info: result.data.data,
              alterDeliveryTimeList: TimeList,
              alterDeliveryTimeListSelectedIndex: TimeListSelectedIndex,
              alterDeliveryTimeListSelectedRealIndex: TimeListSelectedIndex,
              deliveryDate: date,
              deliveryDateTimeDes: result.data.data.deliveryDateTimeDes,
              showDialog: false,
              remark: result.data.data.remark,
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
        this.setData({
          showLoading: false,
        })
      }
    });
  },



  /**
   * 修改配送日期
   */
  updateDeliveryDate: function(time) {
    var reqTask = wx.request({
      url: wx.db.url('period/updateDeliveryDate'),
      data: {
        "couponCode": this.data.couponCode,
        "deliveryDate": time,
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
            /*this.setData({
              showDialog: false,
              deliveryDate: time,
              deliveryDateTimeDes: result.data.data.deliveryDateTimeDes,
            });*/
            wx.setStorageSync(
              "updateDeliveryDate", "1",
            );
            this.getInfo();
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
        this.setData({
          showLoading: false,
        })
      }
    });
  },

  /**
   * 修改配送地址
   */
  updateDeliveryAddress: function(addressInfo) {
    var reqTask = wx.request({
      url: wx.db.url('period/updateDeliveryAddress'),
      data: {
        "couponCode": this.data.couponCode,
        "city": addressInfo.city,
        "detail": addressInfo.detail,
        "district": addressInfo.district,
        "phone": addressInfo.phone,
        "province": addressInfo.province,
        "realName": addressInfo.realName,
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
            this.getInfo();
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
      complete: () => {}
    });
  },

  isObjectEmpty: function(obj) {
    return obj === null || (!Object.getOwnPropertyNames(obj).length && !Object.getOwnPropertySymbols(obj).length);
  },



})