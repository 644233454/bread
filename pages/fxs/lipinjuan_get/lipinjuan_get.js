// pages/fxs/lipinjuan_get/lipinjuan_get.js
Page({

  data: {
    showLoading: false,
    BG: "",
    phone: "",
    code: "",
    timer: '', //定时器名字
    countDownNum: 60, //倒计时初始值
    countDownText: "获取验证码",
    codeClick:true,
  },


  onLoad: function(options) {
    this.getBgUrl();
  },


  /**
   * 电话
   */
  getPhoneValue: function(event) {
    console.log(event)
    this.data.phone = event.detail.value;
  },


  /**
   * 验证码
   */
  getCodeValue: function(event) {
    this.data.code = event.detail.value;
  },


  /**
   * 发送验证码
   */
  getCode: function() {
    if (this.data.countDownText != '获取验证码') {
      return;
    }
    if (this.data.phone == "") {
      wx.showToast({
        title: '请填写手机号码',
        icon: "none"
      })
      return;
    }
    if (this.data.phone.length != 11) {
      wx.showToast({
        title: '手机号码不正确',
        icon: "none"
      })
      return;
    }
    if(this.data.codeClick==false){
      return;
    }
    this.setData({
      codeClick:false,
    });
    var reqTask = wx.request({
      url: wx.db.url('giftCard/sendVerificationCode'),
      data: {
        "orgOrderId": wx.orgOrderId,
        "phone": this.data.phone,
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
            wx.showToast({
              title: '成功发送验证码',
              icon: "none"
            });
            this.countDown();
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
        this.setData({
          codeClick: true,
        });
      },
      complete: () => {
        console.log("complete");
        this.setData({
          codeClick: true,
        });
      }
    });
  },

  /**
   * 确定领取礼品卷
   */
  getLiPin: function() {
    if (this.data.phone == "") {
      wx.showToast({
        title: '请填写手机号码',
        icon: "none"
      })
      return;
    }
    if (this.data.phone.length != 11) {
      wx.showToast({
        title: '手机号码不正确',
        icon: "none"
      })
      return;
    }
    if (this.data.code == "") {
      wx.showToast({
        title: '请填写验证码',
        icon: "none"
      })
      return;
    }
    this.setData({
      showLoading: true,
    })
    var reqTask = wx.request({
      url: wx.db.url('giftCard/receiveGiftCards'),
      data: {
        "orgOrderId": wx.orgOrderId,
        "phone": this.data.phone,
        "verificationCode": this.data.code,
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
            wx.showToast({
              title: "领取成功",
              icon: "none"
            });
            wx.redirectTo({
              url: `/pages/fxs/lipinjuan_list/lipinjuan_list`
             
            });
            // wx.switchTab({
            //   url: '/pages/my/my'
            // });
            // wx.navigateBack({
            //   delta: 1
            // });
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
        this.setData({
          showLoading: false,
        })
      }
    });

  },


  /**
   * 每隔一秒运行一次
   */
  countDown: function() {
    let that = this;
    let countDownNum = that.data.countDownNum;
    that.data.timer = setInterval(function() {
      if (countDownNum == 0) {
        clearInterval(that.data.timer);
        that.setData({
          countDownNum: 60,
          countDownText: "获取验证码"
        });
      } else {
        countDownNum--;
        that.setData({
          countDownNum: countDownNum,
          countDownText: countDownNum + "秒后可再次发送"
        });
      }
    }, 1000)
  },

  getBgUrl: function() {
    var reqTask = wx.request({
      url: wx.db.url('giftCard/receiveBgUrl'),
      data: {
        "orgOrderId": wx.orgOrderId,
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
              BG: result.data.data,
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



})