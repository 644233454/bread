// pages/reFund/reFund.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId:"",
    orderNumber:"",//快递单号
    receivePhone:"",//收货人手机号码
    orderDetail:{},
    itemDetail:{},
    reFundTypeArray:[
      "退货退款",
      "仅退款"
    ],
    stateArray:[
      "未收到货",
      "已收到货"
    ],
    stateType:"",
    Reason:"",
    ReasonArr:[
      "未按约定时间发货",
      "拍错/多拍/不喜欢",
      "快递一直未送达",
      "协商一致退款",
      "其他",
    ],
    userPhone:"",
    remark:"",
    userRemark:"",
    refundAmount:"",
    refundTypeIndex:"",
    platform:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("options");
    console.log(options);
    
    this.data.orderId =options.orderId;
    if(options.itemDetail){
      this.data.itemDetail  =JSON.parse(options.itemDetail);
    }
    if(options.receivePhone){
      this.data.receivePhone = options.receivePhone;
      this.data.userPhone =  this.data.receivePhone;
    }
    console.log(this.data.itemDetail);
    this.data.refundAmount = this.data.itemDetail.orderDetailAmount;
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
   /**
   * 收货状态选择器
   */
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为')
    console.log(e)
    this.data.stateType = e.detail.value;
    console.log(this.data.stateType);
    this.setData(this.data);
  },
  /**
   * 收货状态选择器
   */
  reasionBindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为')
    console.log(e)
    this.data.Reason = e.detail.value;
    this.setData(this.data);
  },
  /**
   * 退货方式选择器
   */
  reFundTypeBindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为 reFundTypeBindRegionChange')
    console.log(e)
    this.data.refundTypeIndex = e.detail.value;
    this.setData(this.data);
  },
  orderNumberInput:function(e){
    console.log('快递单号');
    console.log(e.detail.value);
    this.data.orderNumber = e.detail.value;
  },
  phoneInput:function(e){
    console.log('编辑电话号码');
    console.log(e.detail.value);
    this.data.userPhone = e.detail.value;
  },
  RemarkInput:function(e){
    console.log('编辑备注');
    console.log(e.detail.value);
    this.data.userRemark = e.detail.value;
    
  },
  sureBtnClicl:function(){

    if(this.data.itemDetail.refundInfo.refundStatus==1){
      wx.db.toastError('该商品已申请，请勿重复提交');
      return;
    }
    if(this.data.itemDetail.refundInfo.refundStatus==2){
      wx.db.toastError('该商品已处理完毕');
      return;
    }

    
    if(this.data.refundTypeIndex==0){
      if(!this.data.orderNumber){
        wx.db.toastError('请填写订单号');
        return;
      }
    }
    // if(this.data.userPhone.length<11){
    //   wx.db.toastError('请核实手机号码');
    //   return;
    // }
    if(!this.data.refundTypeIndex){
      wx.db.toastError('请选择退款方式');
      return;
    }
    // type="number"
    if(!this.data.Reason){
      wx.db.toastError('请选择退款原因');
      return;
    }
    // refundTypeIndex

    
    console.log('提交')
    console.log(this.data.ReasonArr[this.data.Reason]);
    console.log("备注");
    console.log(this.data.userRemark);
    var userToken = wx.RiceUserToken;
    var reqTask = wx.request({
      url: wx.db.url('order/refundOrderProduct'),
      data: {
        'refundAmount':this.data.refundAmount,
        'productId':this.data.itemDetail.productId,
        'orderId':this.data.orderId,
        'refundMethod':this.data.reFundTypeArray[this.data.refundTypeIndex],
        'refundPhone':this.data.userPhone,
        'refundReason':this.data.ReasonArr[this.data.Reason],
        'refundRemark':this.data.userRemark
      },
      header: {'content-type':'application/json',
                  Authorization:`Bearer ${userToken}`},
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: (result)=>{
          console.log('提交退款返回数据');
          console.log(result);
          var messageCode = result.data.code;
          if(messageCode ==0){

            wx.showToast({
              title: '已提交成功',
              icon: 'success',
              image: '',
              duration: 2000,
              mask: false,
            });


            setTimeout(function () {
              console.log('延迟');
              wx.navigateBack({
                delta: 1
              });
            // wx.navigateBack({
            //   delta: 999
            // });
             }, 2000) //延迟时间 这里是1秒
         
            
          }else{
            wx.db.toastError(result.data.msg);
          }
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  }
  // reasionBindRegionChange
})