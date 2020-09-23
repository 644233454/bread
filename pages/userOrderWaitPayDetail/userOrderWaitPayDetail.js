// pages/userOrderWaitPayDetail/userOrderWaitPayDetail.js

const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    step:[
      {
        title:"买家付款",
        selected:"0"
      },
      {
        title:"商家发货",
        selected:"0"
      },
      {title:"交易完成",
      selected:"0"

      },
    ],
    orderId:"",
    orderDetail:{},
    datetimeTo: "", // 结束时间
    timeLeft: "",    // 剩下的时间（天时分秒）
    type:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.orderId =options.orderId;
    console.log(options.orderId);
    if(options.type){
      this.data.type = options.type;
    }

    // let time2 = new Date().getTime().toString();

    // wx.db.toastError(time2);

    var userToken = wx.RiceUserToken;
    var reqTask = wx.request({
      url: wx.db.url('order/detail'),
      data: {
        "orderId":this.data.orderId
      },
      header: {'content-type':'application/x-www-form-urlencoded',
                Authorization:`Bearer ${userToken}`},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (result)=>{
        console.log('项目详情')
        console.log(result)
        var messageCode = result.data.code;
        if(messageCode ==0){
          this.data.orderDetail =result.data.data;

          this.data.datetimeTo = result.data.data.toCloseTime;
          this.data.datetimeTo = this.data.datetimeTo.replace(/-/g, "/");

          

          this.data.timer = setInterval(() =>{ //注意箭头函数！！
            
            // let time2 = new Date().getTime().toString();
            // let time1 = new Date("2020-04-20 21:39:36").getTime().toString().replace(/-/g, "/");

            // var newTime= "2020-04-20 21:39:36";
            // newTime = newTime.replace(/-/g, "/")

            // wx.db.toastError(newTime);
            // wx.db.toastError(`${time2}\n${time1}`);
            


            this.setData({
              timeLeft: util.getTimeLeft(this.data.datetimeTo)//使用了util.getTimeLeft
            });
            if (this.data.timeLeft == "0天0时0分0秒") {
              clearInterval(this.data.timer);
            }
          }, 1000);
          this.setData(this.data);
        }else{
          wx.db.toastError(result.data.msg);
        }
      },
      fail: ()=>{},
      complete: ()=>{}
    });


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // },
 dateToString:function(date){
    var year = date.getFullYear();
    var month =(date.getMonth() + 1).toString();
    var day = (date.getDate()).toString();
    if (month.length == 1) {
        month = "0" + month;
    }
    if (day.length == 1) {
        day = "0" + day;
    }
    var hours = date.getHours().toString();
    if(hours.length == 1){
        hours = "0" + hours;
    }
    var mintus = date.getMinutes().toString();
    if(mintus.length == 1){
        mintus = "0" + mintus;
    }
    var second = date.getSeconds().toString();
    if(second.length == 1){
        second = "0" + second;
    }

    var dateTime = year + "-" + month + "-" + day + " " + hours + ":" +  mintus + ":" + second;
    return dateTime;
},
/**
   * 用户去支付订单按钮 
   */
  userPayOrderClick:function(event){
    console.log("去支付");
    // console.log(event);
    // var item = event.currentTarget.dataset.item;
    var type = this.data.orderDetail.productList[0].type;
    var reqTask = wx.request({
              url: wx.db.url('order/payOrder'),
              data: {
                "orderId":this.data.orderDetail.orderId
              },
              header: {'content-type':'application/x-www-form-urlencoded',
                  Authorization:`Bearer ${wx.RiceUserToken}`},
              method: 'POST',
              dataType: 'json',
              responseType: 'text',
              success: (payResult)=>{
                console.log('提交支付服务器返回数据');
                console.log(payResult);
                  var messageCode = payResult.data.code;
                  if(messageCode ==0){
                    var  appId = payResult.data.data.appId;
                    var  nonceStr = payResult.data.data.nonceStr;
                    var  packageStr = payResult.data.data.packageStr;
                    var  paySign = payResult.data.data.paySign;
                    var  signType = payResult.data.data.signType;
                    var  timeStamp = payResult.data.data.timeStamp;
                      wx.requestPayment({
                        timeStamp:timeStamp,
                        nonceStr: nonceStr,
                        package: packageStr,
                        signType: signType,
                        paySign: paySign,
                        success: (result)=>{
                          
                          console.log("微信支付返回成功数数据");
                          console.log(result);
                          var  shareItemStr = JSON.stringify(this.data.orderDetail);
                           wx.navigateTo({
                        url: `/pages/payInfo/payInfo?orderId=${this.data.orderDetail.orderId}&shareItem=${shareItemStr}&parentId=${this.data.orderDetail.parentId}&type=${type}`
                      });
                        },
                        fail: ()=>{
                          
                          // wx.db.toastError(result.data.msg);
                        },
                        complete: ()=>{
                           
                        }
                      });
                     
                  }else{
                    wx.db.toastError(payResult.data.msg);
                  }
              },
              fail: (payResult)=>{
                wx.db.toastError(payResult.data.msg);
              },
              complete: ()=>{}
            });


  },
  timeChangeStr:function(time){

  }
})