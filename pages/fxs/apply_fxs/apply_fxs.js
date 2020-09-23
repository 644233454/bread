Page({


  data: {
    name: "",
    phone: "",
    city: "",
    type: "", //注册角色(2: 销售员,3: 分销商
    data: {},
    page_bg: ""
  },

  onLoad: function (options) {
    var queryBean = JSON.parse(options.date);
    let it = queryBean.it;
    let bg = "";
    if (wx.roleId == '1' && it != '1') {
      //申请成为分销商
      bg = "/assets/imgs/apply_fxs_bg.png";
      this.data.type = '3';
    } else if (wx.roleId == '1' && it == '1') {
      //申请成为销售员
      bg = "/assets/imgs/apply_xsy_bg.png";
      this.data.type = '2';
    }
    console.log(queryBean);
    this.setData({
      date: queryBean,
      page_bg: bg,
    })

  },

  /**
   * 姓名
   */
  getNameValue: function (event) {
    console.log(event)
    this.data.name = event.detail.value;
  },

  /**
   * 电话
   */
  getPhoneValue: function (event) {
    console.log(event)
    this.data.phone = event.detail.value;
  },

  /**
   * 城市
   */
  getCityValue: function (event) {
    console.log(event)
    this.data.city = event.detail.value;
  },

  bt_apply: function () {
    if (this.data.name == "") {
      wx.showToast({
        title: '请填写姓名',
        icon: "none"
      })
      return;
    }
    if (this.data.phone == "") {
      wx.showToast({
        title: '请填写电话',
        icon: "none"
      })
      return;
    }
    if (this.data.phone.length != 11) {
      wx.showToast({
        title: '请填写正确手机电话',
        icon: "none"
      })
      return;
    }
    if (this.data.city == "") {
      wx.showToast({
        title: '请填写城市',
        icon: "none"
      })
      return;
    }
    this.apply();
  },

  apply: function () {
    var reqTask = wx.request({
      url: wx.db.url('user/apply'),
      data: {
        "city": this.data.city,
        "name": this.data.name,
        "phone": this.data.phone,
        "iCode": wx.iCode,
        "type": this.data.type,
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
            wx.showToast({
              title: "申请成功",
              icon: "none"
            });
            //关闭当前页面，返回上一页面或多级页面。接收一个参数delta，即返回的页数，默认是1，即返回上一页，所以也可以省略
            wx.navigateBack({
              delta: 1
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
