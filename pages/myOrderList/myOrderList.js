// pages/myOrderList/myOrderList.js
Page({

  /**
   * 页面的初始数据
   */

  properties: {
    
  },

  data: {
    titleArr:[
      {
        title:"全部",
        selected:true
      },
      {
        title:"待付款",
        selected:false
      },
      {
        title:"待发货",
        selected:false
      },
      {
        title:"已发货",
        selected:false
      },
      {
        title:"待评价",
        selected:false
      }
    ],
    selectedTitleIndex:0,
  

    userAllOrderList:[],//全部订单数组
    waitPayList:[],//待付款数组
    waitSendList:[],//待发货数组
    alreadySendList:[],//已发货数组
    waitCommentList:[],//待评价数组

    // userAllOrderPage:1,
    // waitPayPage:1,
    // waitSendPage:1,
    // alreadySendPage:1,
    // waitCommentPage:1,
    OrderPageSize:20,

    userOrderPageList:[
      1,1,1,1,1
    ],

    titTopHight:0,
    scrollHight:0,
    tipNumberList:[
     
    ],
    scrollBottom:false,//是否滑动到底部
    roleId:"",//角色

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    if(options.selectedTitleIndex){
      this.data.selectedTitleIndex = parseInt(options.selectedTitleIndex);
    }
    this.data.titTopHight = wx.db.navBarHeight;
    this.data.scrollHight = wx.db.safeAreaHight -wx.db.navBarHeight-46;

    this.data .roleId = wx.roleId;


    // this.data .roleId = 0;
    // this.data.scrollHight = 550;


    console.log('this.data.safeAreaHight ='+wx.db.safeAreaHight);
    console.log('this.data.titTopHight ='+this.data.titTopHight);
    console.log('this.data.scrollHight ='+this.data.scrollHight);
    // console.log('this.data.titTopHight ='+this.data.titTopHight);

    console.log(this.data.selectedTitleIndex);
    for(var i=0;i<this.data.titleArr.length;i++){
      var itemTitle = this.data.titleArr[i];
      if(this.data.selectedTitleIndex ==i){
        itemTitle.selected = true;
      }else{
        itemTitle.selected = false;
      }
    }
    this.getOrderListData(this.data.selectedTitleIndex);

  },
/**
   * 获取订单信息
   */
 getOrderListData:function(type){
  
  var userToken = wx.RiceUserToken;
  var pageType = this.data.userOrderPageList[type];
  var statusType = String(type-1);
  var dataDic;

  if(type ==0){

    dataDic ={
      "page":pageType,
      "pageSize":this.data.OrderPageSize
    };
  }else{
    dataDic ={
      "page":pageType,
      "pageSize":this.data.OrderPageSize,
      "status":statusType
    };
  }
  console.log("请求订单接口传参");
  console.log('pageType');
  console.log(pageType);
  console.log('statusType');
  console.log(statusType);
  console.log('type');
  console.log(type);
  // type
  var reqTask = wx.request({
    url:  wx.db.url('order/queryOrder'),
    data: dataDic,
    header: {'content-type':'application/x-www-form-urlencoded',
      Authorization:`Bearer ${userToken}`},
    method: 'GET',
    dataType: 'json',
    responseType: 'text',
    success: (result)=>{
      console.log("订单接口返回数据");
      console.log(result);
      var messageCode = result.data.code;
      if(messageCode ==0){
          if(type ==0){
            if(this.data.userOrderPageList[type] ==1){
              this.data.userAllOrderList =result.data.data;
            }else{
              this.data.userAllOrderList = this.data.userAllOrderList.concat(result.data.data);
            }
            this.setData(this.data);
          }
          if(type ==1){
            if(this.data.userOrderPageList[type] ==1){
              this.data.waitPayList =result.data.data;
            }else{
              this.data.waitPayList = this.data.waitPayList.concat(result.data.data);
            }
            this.setData(this.data);
          }
          if(type ==2){
            if(this.data.userOrderPageList[type] ==1){
              this.data.waitSendList =result.data.data;
            }else{
              this.data.waitSendList = this.data.waitSendList.concat(result.data.data);
            }
            this.setData(this.data);
          }
          if(type ==3){
            if(this.data.userOrderPageList[type] ==1){
              this.data.alreadySendList =result.data.data;
            }else{
              this.data.alreadySendList = this.data.alreadySendList.concat(result.data.data);
            }
            this.setData(this.data);
          }
          if(type ==4){
            if(this.data.userOrderPageList[type] ==1){
              this.data.waitCommentList =result.data.data;
            }else{
              this.data.waitCommentList = this.data.waitCommentList.concat(result.data.data);
            }
            this.data.scrollBottom = false;
            this.setData(this.data);
          }
      }else{
        wx.db.toastError(result.data.msg);
      }
    },
    fail: ()=>{},
    complete: ()=>{}
  });
  



  },
  /**
   * 滑动到底部
   */
  searchScrollLower:function(e){
    console.log('滑动到底部');
    if(this.data.scrollBottom ==true){
      return;
    }
    this.data.scrollBottom = true;
    this.data.userOrderPageList[this.data.selectedTitleIndex]++;
    this.getOrderListData(this.data.selectedTitleIndex);



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
    this.getUserOrderNum();
    this.getOrderListData(this.data.selectedTitleIndex);
  },
  getUserOrderNum:function(){
    var reqTask = wx.request({
      url: wx.db.url('order/orderStat'),
      data: {},
      header: {'content-type':'application/x-www-form-urlencoded',Authorization:`Bearer ${wx.RiceUserToken}`},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (result)=>{
        console.log('用户中心统计订单数量')
        console.log(result)
        var messageCode = result.data.code;
        if(messageCode ==0){
          this.data.tipNumberList =[];
          this.data.tipNumberList.push(0);
          this.data.tipNumberList.push(result.data.data.toPayCount);
          this.data.tipNumberList.push(result.data.data.toDeliverCount);
          this.data.tipNumberList.push(result.data.data.deliverCount);
          this.data.tipNumberList.push(result.data.data.toCommentCount);
          this.setData(this.data);
        }
      },
      fail: ()=>{},
      complete: ()=>{}
    });
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
   * 用户切换顶部标签选项
   */
  itemClicl:function(event){

    for(var i=0;i<this.data.titleArr.length;i++){
      var item = this.data.titleArr[i];
      item.selected = false;
    }

      var selectedIndx =  event.currentTarget.dataset.itemindex;
      this.data.selectedTitleIndex = parseInt(selectedIndx);
      this.data.userOrderPageList[this.data.selectedTitleIndex]=1;


      this.getOrderListData(this.data.selectedTitleIndex);
      var item = this.data.titleArr[selectedIndx];
      item.selected = true;
      this.setData(this.data);
  },
  /**
   * 用户取消订单按钮 
   */
  userCancelOrderClick:function(event){

    console.log("用户取消支付按钮传值");
    console.log(event);



    var selectedIndx =  event.currentTarget.dataset.itemindex;

    var item = event.currentTarget.dataset.item;

    var reqTask = wx.request({
      url: wx.db.url('order/cancelOrder'),
      data: {
        "orderId":item.orderId
      },
      header: {'content-type':'application/x-www-form-urlencoded',
                    Authorization:`Bearer ${wx.RiceUserToken}`},
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: (result)=>{
        console.log("用户取消订单请求的数据");
        console.log(result);
        var messageCode =result.data.code;
        if(messageCode ==0){
          // if(type =="waitPayView"){
          //   this.data.waitPayList.splice(selectedIndx,1);
          //   var allListIndex= this.data.userAllOrderList.findIndex(function(itemIndex){
          //     return itemIndex.orderId==item.orderId
          //   });
          //   var AllOrderListItem = this.data.userAllOrderList[allListIndex];
          //   AllOrderListItem.orderStatus = 1;
          //   // this.data.userAllOrderList.splice(allListIndex,1);
          //   // console.log();
          // }else{

          //   var allOrderListIndex= this.data.userAllOrderList.findIndex(function(itemIndex){
          //     return itemIndex.orderId==item.orderId
          //   });
          //   var allOrderListItem = this.data.userAllOrderList[allOrderListIndex];
          //   allOrderListItem.orderStatus = 1;
          //   // this.data.userAllOrderList.splice(selectedIndx,1);
            
          //   var waitPayListIndex= this.data.waitPayList.findIndex(function(itemIndex){
          //     return itemIndex.orderId==item.orderId
          //   });

          //   this.data.waitPayList.splice(waitPayListIndex,1);
          // }
          // item.orderStatus ="5"
          // this.data.alreadyReceiveList.push(item);
          wx.db.toastSuccess("取消订单成功");
          this.data.userOrderPageList[selectedIndx] =1;
          this.getOrderListData(selectedIndx);
          this.getUserOrderNum();

        }else{
          wx.db.toastError(result.data.msg);
        }
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },
  /**
   * 用户去支付订单按钮 
   */
  userPayOrderClick:function(event){
    console.log("去支付");
    console.log(event);
    var item = event.currentTarget.dataset.item;
    var type = item.type;
    var reqTask = wx.request({
              url: wx.db.url('order/payOrder'),
              data: {
                "orderId":item.orderId
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
                          var  shareItemStr = JSON.stringify(item);
                           wx.navigateTo({
                        url: `/pages/payInfo/payInfo?orderId=${item.orderId}&shareItem=${shareItemStr}&parentId=${item.parentId}&type=${type}`
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
              fail: ()=>{},
              complete: ()=>{}
            });


  },
  /**
   * 用户查看物流 
   */
  userOrderLogisticsClick:function(event){

  },
  /**
   * 用户确认收货 
   */
  useReceiveOrderClick:function(event){

    console.log("用户确认收货");
    console.log(event);

    var selectedIndx =  event.currentTarget.dataset.itemindex;

    var item = event.currentTarget.dataset.item;

    


    var reqTask = wx.request({
      url: wx.db.url('order/confirmReceive'),
      data: {
        "orderId":item.orderId
      },
      header: {'content-type':'application/x-www-form-urlencoded',
                    Authorization:`Bearer ${wx.RiceUserToken}`},
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: (result)=>{
        console.log("用户确认收货返回的数据");
        console.log(result);
        var messageCode =result.data.code;
        if(messageCode ==0){
  
          wx.db.toastSuccess("确认收货成功");
          this.data.userOrderPageList[selectedIndx] =1;
          this.getOrderListData(selectedIndx);
          this.getUserOrderNum();
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
   * 用户查看订单详情   
   */
  userOrderInfoClick:function(event){
    // orderNum
    console.log('userOrderInfoClick');
    console.log(event);
    var item = event.currentTarget.dataset.item;
    if(item.orderStatus ==0){
      wx.navigateTo({
        url: `/pages/userOrderWaitPayDetail/userOrderWaitPayDetail?orderId=${item.orderId}&type=${item.type}`
      });
      return;
    }
    if(item.orderStatus ==5){
      wx.navigateTo({
        url: `/pages/userOrderCloseDetail/userOrderCloseDetail?orderId=${item.orderId}&title=交易关闭&orderStatus=1&tipText=待付款&type=${item.type}`
      });
      return;
    } 
    if(item.type =="PERIOD"){
      wx.navigateTo({
        url: `/pages/fxs/zqg/zqg?couponCode=${item.orderNum}`
      });
    }else{
      // item
    if(item.orderStatus ==1){
      wx.navigateTo({
        url: `/pages/userOrderWaitSendDetail/userOrderWaitSendDetail?orderId=${item.orderId}&type=${item.type}`
      });
    }
    if(item.orderStatus ==2){
      wx.navigateTo({
        url: `/pages/userOrderAlreadySendDetail/userOrderAlreadySendDetail?orderId=${item.orderId}&type=${item.type}`
      });
    }
    if(item.orderStatus ==4||item.orderStatus ==5||item.orderStatus ==3){

      if(item.orderStatus ==4||item.orderStatus ==3){
        wx.navigateTo({
          url: `/pages/userOrderCloseDetail/userOrderCloseDetail?orderId=${item.orderId}&title=交易完成&orderStatus=0&tipText=实付款&type=${item.type}`
        });
      }
      if(item.orderStatus ==5){
        wx.navigateTo({
          url: `/pages/userOrderCloseDetail/userOrderCloseDetail?orderId=${item.orderId}&title=交易关闭&orderStatus=1&tipText=待付款&type=${item.type}`
        });
      } 
    }
    }
    
  },
   /**
   * 用户评论   
   */
  userCommentClick:function(event){
    console.log('用户评论');
    console.log(event);
    var item = event.currentTarget.dataset.item;
    
    if(item.productList.length>1){
      wx.navigateTo({
        url: `/pages/userCommentGood/userCommentGood?orderId=${item.orderId}`
      });
    }else{
      var  goodItemStr = JSON.stringify(item.productList[0]);
      wx.navigateTo({
        url: `/pages/userCommentGoodInfo/userCommentGoodInfo?goodItemStr=${goodItemStr}&orderId=${item.orderId}`
      });
    }



     
   
  },
  reFundClick:function(event){



    console.log('申请退款');
    console.log(event);
    var orderDetail = event.currentTarget.dataset.item;



    console.log("orderDetail");
    console.log(orderDetail);
    if(orderDetail.productList.length>1){
      wx.navigateTo({
        url: `/pages/reFundList/reFundList?orderId=${orderDetail.orderId}`
      });
    }else{
      var itemDetail = orderDetail.productList[0];
      var  refundInfo = itemDetail.refundInfo;
      if(refundInfo.refundStatus==1){
        wx.db.toastError("该商品已在申请中");
        return;
      }
      if(refundInfo.refundStatus==2){
        wx.db.toastError("该商品已退款");
        return;
      }

      var  receivePhone = orderDetail.receivePhone;
      var itemDetailStr =JSON.stringify(itemDetail);
      console.log('receivePhone');
      console.log(receivePhone);
      wx.navigateTo({
        url: `/pages/reFund/reFund?orderId=${orderDetail.orderId}&itemDetail=${itemDetailStr}&receivePhone=${receivePhone}`
      });
    }
  },
  //去发货
  goToSentItem:function(event){

    var orderDetail = event.currentTarget.dataset.item;
    var reqTask = wx.request({
      url: wx.db.url('order/deliverOrder'),
      data: {
        "orderId":orderDetail.orderId
      },
      header: {'content-type':'application/x-www-form-urlencoded',
                    Authorization:`Bearer ${wx.RiceUserToken}`},
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: (result)=>{
        console.log("去发货");
        console.log(result);
        var messageCode =result.data.code;
        if(messageCode ==0){
  
          wx.db.toastSuccess("已确认发货");


          this.data.userOrderPageList[this.data.selectedTitleIndex] =1;
          this.getOrderListData(this.data.selectedTitleIndex);
          this.getUserOrderNum();
          this.setData(this.data);
        }else{
          wx.db.toastError(result.data.msg);
        }
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  }
})