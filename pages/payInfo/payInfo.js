// pages/payInfo/payInfo.js
var log = require('../../cmps/log.js') // 引用上面的log.js文件
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId:"",
    orderDetail:{},
    shareItem:{},
    parentId:"",
    payResult:false,//支付结果
    interval:"",
    intervalTime:20,
    type:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  test:function(){
    console.log("定时器")
  },
  onLoad: function (options) {
    this.data.orderId = options.orderId;

    if(options.shareItem){
      this.data.shareItem  =JSON.parse(options.shareItem);
    }
    if(options.parentId){
      this.data.parentId = options.parentId;
    }
    if(options.type){
      this.data.type = options.type;
    }
    // type
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


    console.log("分享数据");
    console.log(this.data.shareItem.name);
    console.log(this.data.parentId);
    console.log(this.data.shareItem.imgUrl);
    // this.test();

  },
  test:function(){
    
    var time = this.data.intervalTime;
    var interval = setInterval(() => {
      time--;
      console.log('定时器');
      console.log(time);
      this.setData({
        time:time
      })
      if(time==0){
        clearInterval(interval)
      }

    }, 1000);
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
    // var that = this;
    // that.clearTimeInterval(that)
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
  orderInfoBtn:function(){
    console.log('传递过去额的数值');
    console.log(this.data.orderDetail);
    var  orderDetailStr = JSON.stringify(this.data.orderDetail);

    wx.navigateTo({
      url: `/pages/orderInfoDetail/orderInfoDetail?orderDetail=${orderDetailStr}&type=${this.data.type}`
    });
  },
  /**
   * 用户分享自定义
   */
  onShareAppMessage: function(res) {

    console.log("付款成功后的分享");
    console.log(`/pages/list/list?pId=${this.data.parentId}&iCode=${wx.iCode}&iT=0`);
    log.info('付款成功后的分享')
    log.info(`/pages/list/list?pId=${this.data.parentId}&iCode=${wx.iCode}&iT=0`)


    return {
      title: `${this.data.shareItem.name}`,
      path: `/pages/list/list?pId=${this.data.parentId}&iCode=${wx.iCode}&iT=0`,
      imageUrl: `${this.data.shareItem.imgUrl}`//自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径。支持PNG及JPG。显示图片长宽比是 5:4。
    }
  }
})