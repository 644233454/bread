// pages/userOrderWaitSendDetail/userOrderWaitSendDetail.js
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
        selected:"0"
      },
      {title:"交易完成",
      selected:"0"

      },
    ],
    orderId:"",
    orderDetail:{},
    receivePhone:"",//
    type:"",
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.orderId =options.orderId;
    if(options.type){
      this.data.type = options.type;
      console.log("this.data.type");
      console.log(this.data.type);
    }
    console.log(options.orderId);

    var userToken =wx.RiceUserToken;
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
          this.data.receivePhone = this.data.orderDetail.phone;
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
  copyClick:function(){
    wx.setClipboardData({
      data: this.data.orderDetail.orderNum,
      success: function (res) {
      }
      })
  },
  appleRefundClick:function(){
    console.log('申请退款');
    var orderDetailStr =JSON.stringify(this.data.orderDetail);
    wx.navigateTo({
      url: `/pages/reFund/reFund?orderId=${this.data.orderId}&orderDetail=${orderDetailStr}&receivePhone=${this.data.receivePhone}`
    });
  }

})