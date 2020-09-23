// pages/reFundList/reFundList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId:"",
    orderDetail:{},
    receivePhone:"",//收货人手机号码
    contrainHight:"0",
    commentText:"",
    detailInfoList:[],
    orderStatus:"",
    urlStr:"",
    refundMethod:"",
    goodItem:{},//单个商品
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.contrainHight = wx.db.safeAreaHight - wx.db.navBarHeight;


    this.data.orderId  =options.orderId;
    this.httporderInfo();
    
  },
  httporderInfo:function(){
    console.log('项目详情');
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
        var messageCode = result.data.code;
          if(messageCode ==0){
            console.log('项目详情返回数据');
            console.log(result.data.data);
            this.data.orderDetail = result.data.data;
            this.data.receivePhone = this.data.orderDetail.phone;
            this.data.goodItem = this.data.orderDetail.productList[0];
            // this.data.refundMethod = this
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
    this.httporderInfo();
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
  goToReFund:function(event){
    console.log('去退款单个商品');
    console.log(event);

    var item = this.data.orderDetail.productList[event.currentTarget.dataset.itemindex];
    if(item.refundStatus==1){
      wx.db.toastError("该商品已在申请中");
      return;
    }
    if(item.refundStatus==2){
      wx.db.toastError("该商品已退款");
      return;
    }
    // this.data.receivePhone
    var  goodItemStr = JSON.stringify(this.data.orderDetail.productList[event.currentTarget.dataset.itemindex]);
    wx.navigateTo({
      url: `/pages/reFund/reFund?itemDetail=${goodItemStr}&orderId=${this.data.orderDetail.orderId}&receivePhone=${this.data.receivePhone}`
    });
  }
})