Page({

  /**
   * 页面的初始数据
   */
  data: {
    accountIcon: "/assets/imgs/fxs_withdraw_account_icon_wechart.png",
    accountName: "微信钱包",
    deleteBg: "/assets/imgs/fxs_withdraw_delete.png",
    balance: "0.00",
    tipsIcon: "/assets/imgs/fxs_tips.png",
    tipsTextOne: "1、提现到账时间: 17点之前提现2小时",
    tipsTextTwo: "2、提现手续费 2元/笔；",
    tipsTextThree: "3、请确认您的银行卡是否与实名信息一致,否则会提现失败；",
    etValue:"",
    canWidthdrawClick:true,
  },

  /**
* 网络请求
*/
  onLoad: function () {
    this.getInfo();
  },


  /**
   * 全额提现
   */
  tv_withdrawAll_click: function() {
    let a = parseFloat(this.data.balance)
    if (isNaN(a)) {
      return
    }
    if (a == 0 || a < 0) {
      wx.showToast({
        title: "可用余额为0",
        icon: "none"
      });
      return
    }
    this.setData({
      etValue: this.data.balance
    })
  },

  /**
   * 清除输入的字符
   */
  v_deleteEtValue_click: function() {
    this.setData({
      etValue :""
    })
  },

  /**
   * 提现
   */
  bt_withdraw_click: function () {
    let a = parseFloat(this.data.balance);
    let b = parseFloat(this.data.etValue)
    console.log(a);
    console.log(b);
    if (isNaN(a)) {
      wx.showToast({
        title: "异常：可用余额是非数字",
        icon: "none"
      });
      return
    }
    if (a == 0 || a < 0) {
      wx.showToast({
        title: '可用余额为0',
        icon:"none"
      });
      return
    }
   if (isNaN(b)) {
     wx.showToast({
       title: '请输入提现金额',
       icon: "none"
     });
      return
    }
    if (b == 0 || b < 0) {
      wx.showToast({
        title: "提现金额不能为0",
        icon: "none"
      });
      return
    }
    if(a<b){
      wx.showToast({
        title: "提现金额不能超过可用余额",
        icon: "none"
      });
      return
    }
    this.withdraw(b);
    
   
  },

/**
 * 自动获取input中的实时输入的值
 */
  getInputValue:function(e) {
    var money;
    if (/^(\d?)+(\.\d{0,2})?$/.test(e.detail.value)) { //正则验证，提现金额小数点后不能大于两位数字
      money = e.detail.value;
    } else {
      money = e.detail.value.substring(0, e.detail.value.length - 1);
    }
    this.setData({
      etValue: money,
    });
  },


  getInfo: function () {
    var reqTask = wx.request({
      url: wx.db.url('asset/getBalance'),
      data: {},
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
            this.data.balance = result.data.data;
            this.setData(this.data);
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

  withdraw:function(amount){
    if (!this.data.canWidthdrawClick){
      retuen;
    }
    this.setData({
      canWidthdrawClick:false
    });
    var a = new Number(amount);
    console.log(amount);
    console.log(a);
    var reqTask = wx.request({
      url: wx.db.url('asset/withdraw'),
      data: { "amount": a},
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
            this.getInfo();
            this.setData({
              etValue: "",
              canWidthdrawClick: true
            });
           
            var time = this.getDateStr(0);
            var date = { "time": time,"amount":a};
            var jsonDate = JSON.stringify(date);//传递object数据给下一页面
            wx.navigateTo({
              url: "../withdraw_resault/withdraw_resault?date=" + jsonDate,
            
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


  getDateStr: function (AddDayCount) {
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