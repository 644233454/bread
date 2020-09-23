// pages/userCommentGood/userCommentGood.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId:"",
    orderDetail:{},
    contrainHight:"0",
    commentText:"",
    detailInfoList:[],
    orderStatus:"",
    urlStr:"",
    goodItem:{},//单个商品

    
   
    imags:[],//照片
    imagesShow:"",
    tempFilePaths:[]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.data.orderDetail =options.orderDetail;
    // console.log(wx.db.windowHeight);
    // console.log(wx.db.statusBarHeight);
    // console.log(wx.db.navBarHeight);
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
            this.data.goodItem = this.data.orderDetail.productList[0];
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
  // /**
  //  * 用户编辑评论
  //  */
  // detailInput:function(e){
  //   console.log("编辑detailInput");
  //   console.log(e);
  //   this.data.commentText  =e.detail.value;
  //   console.log("文本框内容");
  //   console.log(this.data.commentText);
  //   this.data.detailInfoList[e.target.dataset.index].description = e.detail.value;
  //   console.log("赋值后的数据");
  //   console.log(this.data.detailInfoList);
  // },
  /**
   * 用户发表评论
   */
  sureBtn:function(){
    var userToken =wx.RiceUserToken;
    // var listLength = this.data.detailInfoList.length;
    // console.log('数组detailInfoList');
    // console.log(this.data.detailInfoList);

    // var upDetailInfoList = [];

    // for(var i=0;i<this.data.detailInfoList.length;i++){
    //   var itemDic = this.data.detailInfoList[i];
    //   console.log('数组中的数据');
    //   console.log(itemDic);
    //   var dicText = itemDic.description;
    //   console.log('拿出的数据');
    //   console.log(dicText);
    //   if(dicText){
    //     console.log('存在描述');
    //     upDetailInfoList.push(itemDic);
    //   }else{
    //     console.log('不存在描述');
    //     // this.data.detailInfoList.splice(i,1);
    //   }
    // }
    // console.log('上传的描述');
    // console.log(upDetailInfoList);

    // if(upDetailInfoList.length<1){
    //   wx.db.toastError('请核实评价内容');
    //   return;
    // }

    var reqTask = wx.request({
      
      url: wx.db.url(this.data.urlStr),
      data: {
        "orderId":this.data.orderDetail.orderId,
        "detailInfoList":upDetailInfoList
      },
      header: {'content-type':'application/json',Authorization:`Bearer ${userToken}`},
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: (result)=>{
        console.log('提交评论返回数据');
        console.log(result);
        var codeMessage = result.data.code;
        if(codeMessage ==0){
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
            delta: 999
          });
           }, 2000) //延迟时间 这里是1秒
        }else{
            wx.db.toastError(result.data.msg);
        }
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },
  goToCommentView:function(event){
    console.log('去评价单个商品');
    console.log(event);
    
    var  goodItemStr = JSON.stringify(this.data.orderDetail.productList[event.currentTarget.dataset.itemindex]);
    wx.navigateTo({
      url: `/pages/userCommentGoodInfo/userCommentGoodInfo?goodItemStr=${goodItemStr}&orderId=${this.data.orderDetail.orderId}`
    });
  }
})