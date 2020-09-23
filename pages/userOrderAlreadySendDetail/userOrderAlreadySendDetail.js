// pages/userOrderAlreadySendDetail/userOrderAlreadySendDetail.js
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    step:[
      {
        title:"买家付款",
        selected:"1"
      },
      {
        title:"商家发货",
        selected:"1"
      },
      {title:"交易完成",
      selected:"0"

      },
    ],
    orderId:"",
    orderDetail:{},
    timeLeft: "",    // 剩下的时间（天时分秒）
    expressNo:"",//快递单号
    logisticsInfos:[],//快递数组
    receivePhone:"",//收货人手机号码
    type:""
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
          this.data.logisticsInfos = result.data.data.logisticsInfos;
          this.data.expressNo = this.data.orderDetail.expressNo;
          this.data.datetimeTo = result.data.data.autoConfirmTime;
          this.data.receivePhone = this.data.orderDetail.phone;
          var date2 = new Date(this.data.datetimeTo);
 
          date2.setDate(date2.getDate());
          var dateStr = util.dateToString(date2);

          this.data.timer = setInterval(() =>{ //注意箭头函数！！
            this.setData({
              timeLeft: util.getTimeLeft(dateStr)//使用了util.getTimeLeft
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
  coptText:function(even){
    wx.setClipboardData({
      data: even.currentTarget.dataset.text,
      success: (result)=>{
        wx.getClipboardData({
          success: (result)=>{
            wx.showToast({
              title: '订单号已复制'
            })
          },
        });
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },
  copyClick:function(){
    wx.setClipboardData({
      data: this.data.orderDetail.orderNum,
      success: function (res) {
      }
      })
  },
  goToLogisticsInfo:function(){


    var logisticsInfosStr =JSON.stringify(this.data.logisticsInfos);
   

    wx.navigateTo({
      url: `/pages/logisticsInfoList/logisticsInfoList?logisticsInfos=${encodeURIComponent(logisticsInfosStr)}`
    });
  },
  appleRefundClick:function(){
    console.log('申请退款');
    var orderDetailStr =JSON.stringify(this.data.orderDetail);
    wx.navigateTo({
      url: `/pages/reFund/reFund?orderId=${this.data.orderId}&orderDetail=${orderDetailStr}&receivePhone=${this.data.receivePhone}`
    });
  }
})