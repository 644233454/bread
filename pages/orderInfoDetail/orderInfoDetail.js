// pages/orderInfoDetail/orderInfoDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderDetail:{},
    type:"",
    orderId:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.orderId){
      this.data.orderId = options.orderId;
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
          this.setData(this.data);
        }else{
          wx.db.toastError(result.data.msg);
        }
        
      },
      fail: ()=>{},
      complete: ()=>{}
    });
    }else{
      this.data.orderDetail = JSON.parse(options.orderDetail);
    }
    
    
    if(options.type){
      this.data.type  =options.type;
    }

    this.setData(this.data);

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
  callClick:function(){
    wx.makePhoneCall({
      phoneNumber: wx.customerPhone,
      success: (result)=>{
        
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },
  copyClick:function(e){
    console.log(e);
    console.log("复制");
    // var numberStr = e.currentTarget.dataset.item;

    wx.setClipboardData({
      data: this.data.orderDetail.orderNum,
      success: function (res) {
        wx.getClipboardData({
          success: (result)=>{
            wx.showToast({
              title: '订单号已复制'
            })
          },
        });
      }
      })
  }

})