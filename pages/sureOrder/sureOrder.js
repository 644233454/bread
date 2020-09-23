// pages/sureOrder/sureOrder.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userAddress:{},
    userName:"",
    userTel:"",
    userAddressList:[],
    productListDic:{},
    productList:[],
    scrollHight:"0",
    totMoney:0,
    remark:"",
    sendMethod:"0",
    isFromCar:false,
    goAddressListPages:false,
    shareItem:{},
    parentId:"",
    showModalStatus:false,//状态
    orderId:"",//订单信息

    type:"",//类型  PERIOD周期购  NORMAL普通产品
    deliveryPeriodDes:"",//描述 频率
    deliveryPeriodTime:"",//配送时间

    deliveryPeriodTimeOld:"",//存档
    deliveryPeriodFirstTimeOld:"",//存档
    goodTimesChooseSizeArrSelectdIndexOld:"",//存档

    deliveryPeriodFirstTime:"",//配送时间
    productPeriodId:"",//配送id
    goodTimesChooseSizeArr:[],//

    deliveryDate:"",//日期数组
    deliveryDateArr:[],
    appId:"",
    nonceStr:"",
    packageStr:"",
    paySign:"",
    signType:"",
    timeStamp:"",
    userClcked:false,//用户是否已点击
    userPhoneStatus:false,//获取用户手机号码
    ORGItemCode:"",//礼品券码

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.scrollHight = wx.db.windowHeight -50-wx.db.statusBarHeight;
    console.log("确认订单");
    console.log(options);
    if(options.isFromCar){
      this.data.isFromCar = options.isFromCar;
    }
    if(options.parentId){
      this.data.parentId =options.parentId;
    }
    if(options.ORGItemCode){
      this.data.ORGItemCode = options.ORGItemCode;
    }
    if(options.type){
      this.data.type =options.type;
    }
    if(options.deliveryPeriodDes){
      this.data.deliveryPeriodDes =options.deliveryPeriodDes;
      // this.data({
      //   deliveryPeriodDes:this.data.deliveryPeriodDes
      // })
    }
    if(options.deliveryPeriodTime){
      this.data.deliveryPeriodTime =options.deliveryPeriodTime;
      this.data.deliveryPeriodTimeOld = this.data.deliveryPeriodTime;
    }
    if(options.productPeriodId){
      this.data.productPeriodId =options.productPeriodId;
    }
    if(options.deliveryDate){
      this.data.deliveryDate =options.deliveryDate;
      var dataDeliveryDateArr = this.data.deliveryDate.split(',');
      this.data.DeliveryDateArr =[];
      for(var i=0;i<dataDeliveryDateArr.length;i++){
        var titTime = dataDeliveryDateArr[i];
        if(titTime ==this.data.deliveryPeriodTime){
          var dateItem = {
            "title":dataDeliveryDateArr[i],
            "selected":true
          };
          this.data.goodTimesChooseSizeArrSelectdIndexOld = i;
          this.data.deliveryDateArr.push(dateItem);
        }else{
          var dateItem = {
            "title":dataDeliveryDateArr[i],
            "selected":false
          };
          this.data.deliveryDateArr.push(dateItem);
        }
        
      }
      console.log("日期数组");
      console.log(this.data.deliveryDate);
      console.log(this.data.deliveryDateArr);
    }
    

    var userToken = wx.RiceUserToken;
    var reqTask = wx.request({
      url: wx.db.url('product/firstDeliveryDate'),
      data: {
        "productPeriodId":this.data.productPeriodId,
        "deliveryDate":this.data.deliveryPeriodTime
      },
      header: {'content-type':'application/x-www-form-urlencoded'},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (result)=>{
        var messageCode = result.data.code;
          if(messageCode ==0){
            this.setData({
              deliveryPeriodFirstTime: result.data.data.deliveryDate // 首次配送日期。
            })
            this.data.deliveryPeriodFirstTimeOld = result.data.data.deliveryDate;
          }
      },
      fail: ()=>{},
      complete: ()=>{}
    });


    // type
    this.data.orderId ="";
    console.log('初始化用户订单列表');  
    console.log(options);


    
    this.data.totMoney = parseFloat(options.totMoney);
    // this.data.totMoney = this.data.totMoney.toPrecision(2);
    console.log(this.data.totMoney);
   this.data.productListDic = JSON.parse(options.productListStr);
   this.data.productList = this.data.productListDic.list;
   for(var i=0;i<this.data.productList.length;i++){
    var item  =this.data.productList[i];
    // item.name ="我是信道信道信道阿萨看得见哈设计费啊，涉及到，马舍不得，明年办事处怎么弄宣传部"
    if(i==0){
      this.data.shareItem = item;
    }
    console.log("分享的数据");
    console.log(item);
   }
   
    this.setData(this.data);


   if(wx.isAuth ==false){
    wx.login({
      timeout:10000,
      success: (result)=>{
        console.log("微信拿code");
        console.log(result);
        console.log("用户token");
        console.log(wx.RiceUserToken);
        wx.code = result.code;
      },
      fail: ()=>{},
      complete: ()=>{}
    });
   }


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



    if(this.data.goAddressListPages ==true)
    {
      // RiceUserReSetAddressInfo
     var reSetAddressInfo = wx.getStorageSync('RiceUserReSetAddressInfo');

     if(reSetAddressInfo =='true'){

      console.log("重新获取默认地址")
      var userToken =wx.RiceUserToken;
      var reqTask = wx.request({
        url: wx.db.url('addr/default'),
        data: {},
        header: {'content-type':'application/json',
        Authorization:`Bearer ${userToken}`},
        method: 'GET',
        dataType: 'json',
        responseType: 'text',
        success: (result)=>{
          console.log('获取默认地址');
          console.log(result);
          var messageCode = result.data.code;
          if(messageCode ==0){
           // 将movies数组缓存到本地
  
           if(result.data.data){
            // wx.setStorage({
            //   key: "RiceUserDefaultAddressInfo",
            //   data: result.data.data
            // });
            console.log('获取用户默认地址')
            console.log(result.data.data)
            this.data.userAddress = result.data.data;
            // this.data({
            //   userAddress:this.data.userAddress
            // })
            wx.setStorageSync(
              "RiceUserReSetAddressInfo","false"
           );
            this.setData(this.data);
            
           }
          }
        },
        fail: ()=>{},
        complete: ()=>{}
      });
     }else{
      this.data.userAddress = wx.getStorageSync('RiceUserSelectedAddressInfo');
      console.log("获取本地地址")
      console.log(this.data.userAddress)
      this.setData(this.data);
     }
     
    }else{

      var userToken = wx.RiceUserToken;
      var reqTask = wx.request({
        url: wx.db.url('addr/default'),
        data: {},
        header: {'content-type':'application/json',
        Authorization:`Bearer ${userToken}`},
        method: 'GET',
        dataType: 'json',
        responseType: 'text',
        success: (result)=>{
          console.log('获取默认地址');
          console.log(result);
          var messageCode = result.data.code;
          if(messageCode ==0){
           // 将movies数组缓存到本地
  
           if(result.data.data){

            console.log('获取用户默认地址')
            console.log(result.data.data)
            this.data.userAddress = result.data.data;
            
            this.setData(this.data);
           }
          }
        },
        fail: ()=>{},
        complete: ()=>{}
      });
    }
  },

  /**
   * 首次配送日期
   */
  httpItemFistTime:function(e){
    var userToken = wx.RiceUserToken;
    var reqTask = wx.request({
      url: wx.db.url('product/firstDeliveryDate'),
      data: {
        "productPeriodId":this.data.productPeriodId,
        "deliveryDate":this.data.deliveryPeriodTime
      },
      header: {'content-type':'application/x-www-form-urlencoded'},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (result)=>{
        var messageCode = result.data.code;
          if(messageCode ==0){
            this.setData({
              deliveryPeriodFirstTime: result.data.data.deliveryDate // 首次配送日期。
            })
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
   * 用户点击选择收货地址
   */
  chooseAdressClick:function(){
    console.log('选择收货地址');
    console.log(this.data.userAddress);
    this.data.goAddressListPages = true;
    if(this.data.userAddress.addrId){
      wx.navigateTo({
        url: `/pages/addAddress/addAddress?userAddId=${this.data.userAddress.addrId}&fromType=shop`
      });
    }else{
      wx.navigateTo({
        url: `/pages/addAddress/addAddress?fromType=shop`
      });
     
    }

    
  },
  /**
   * 
   * 点击下单按钮
   */
  sureBtnClick:function(){

    if(!this.data.userAddress.addrId){
      wx.db.toastError('请选择收货地址');
      return;
    }

    console.log('用户认证信息');
    console.log(wx.isAuth);
    if(wx.isAuth ==false){

       // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "ease",
      delay: 0
  })
  this.animation = animation
  animation.translateY(300).step()
  this.setData({
      animationData: animation.export(), // export 方法每次调用后会清掉之前的动画操作。
      showModalStatus: true
  })
  setTimeout(() => {
      animation.translateY(0).step()
      this.setData({
          animationData: animation.export()  // export 方法每次调用后会清掉之前的动画操作。
      })
      console.log(this)
  }, 200)



    }else{

      if(!wx.phone){

        wx.login({
          timeout:10000,
          success: (result)=>{
            
            wx.code = result.code;
            // wx.login
            console.log(" hidedClick wx.login");
            console.log("wx.code");
            console.log(wx.code);
          },
          fail: ()=>{},
          complete: ()=>{}
        });
        this.setData({
          userPhoneStatus:true
        })
        return;
      }

      if(this.data.userClcked ==true){
        console.log("拦截住了点击事件");

        return;
      }
      console.log("点击事件");
      this.data.userClcked =true;
     wx.showLoading({
        title: "提交中",
        mask: true,
        success: (result)=>{
          
        },
        fail: ()=>{},
        complete: ()=>{}
      });

      var userToken = wx.RiceUserToken;
      var itemList = [];
      if(this.data.type =="PERIOD"){
        
        for(var i=0;i<this.data.productListDic.list.length;i++){
          var itemDic = this.data.productListDic.list[i];
          itemDic.deliveryDate = this.data.deliveryPeriodTime;
          itemList.push(itemDic);
        }
      }else{
        itemList = this.data.productListDic.list;
      }

      if(this.data.type =="ORG"){

        var reqTask = wx.request({
          url:wx.db.url('giftCard/redeem'),
          data: {
            "addrId":this.data.userAddress.addrId,
            "code":this.data.ORGItemCode,
            "remark":this.data.remark,
          },
          header: {'content-type':'application/json',
          Authorization:`Bearer ${userToken}`},
          method: 'GET',
          dataType: 'json',
          responseType: 'text',
          success: (result)=>{
            console.log("兑换成功");
            console.log(result);
            var messageCode = result.data.code;
            wx.hideLoading();

            if(messageCode ==0){
              this.data.shareItem.orderAmount =0;
             this.data.shareItem.freightAmount =0;
             this.data.shareItem.freightAmount =0;
             this.data.shareItem.orderNum =2020051506009;
             this.data.shareItem.createTime ="2020051506009";
            
            //不需要支付
            var  shareItemStr = JSON.stringify(this.data.shareItem);
            wx.navigateTo({
             url: `/pages/orderInfoDetail/orderInfoDetail?orderDetail=${shareItemStr}&type=${this.data.type}&orderId=${result.data.data}`
           });

            }else{
              wx.db.toastError(result.data.msg);
            }
          },
          fail: ()=>{},
          complete: ()=>{}
        });


        return;
      }



      var reqTask = wx.request({
        url: wx.db.url('order/submit'),
        data: {
          "addrId":this.data.userAddress.addrId,
          "orderAmount":this.data.totMoney.toFixed(2),
          "remark":this.data.remark,
          "sendMethod":this.data.sendMethod,
          "productInfos":itemList,
          "isFromCar":this.data.isFromCar,
          "deliveryDate":this.data.deliveryPeriodTime
        },
        header: {'content-type':'application/json',
                  Authorization:`Bearer ${userToken}`},
        method: 'POST',
        dataType: 'json',
        responseType: 'text',
        success: (orderResult)=>{
          
          console.log('提交订单服务器返回数据');
          // wx.hideLoading();
          console.log(orderResult);
          // console.log(wx.RiceUserToken);
          // console.log(wx.iCode);

          var messageCode = orderResult.data.code;
          wx.hideLoading();

          // if(this.data.type =="ORG"){
          //   this.data.shareItem.orderAmount =0;
          //   this.data.shareItem.freightAmount =0;
          //   this.data.shareItem.freightAmount =0;
          //   this.data.shareItem.orderNum =2020051506009;
          //   this.data.shareItem.createTime ="2020051506009";
            
          //   //不需要支付
          //   var  shareItemStr = JSON.stringify(this.data.shareItem);
          //   wx.navigateTo({
          //    url: `/pages/orderInfoDetail/orderInfoDetail?orderDetail=${shareItemStr}&type=${this.data.type}`
          //  });
          //  return;
          // }







          if(messageCode ==0){
            console.log('提交支付上传的数据');
            console.log(orderResult.data.data);
            this.data.orderId = orderResult.data.data;

            if(this.data.type =="ORG "){

            //   //不需要支付
            //   var  shareItemStr = JSON.stringify(this.data.shareItem);
            //   wx.navigateTo({
            //    url: `/pages/payInfo/payInfo?orderId=${this.data.orderId}&shareItem=${shareItemStr}&parentId=${this.data.parentId}&type=${this.data.type}`
            //  });

            }else{
              //需要支付
              var reqTask = wx.request({
                url: wx.db.url('order/payOrder'),
                data: {
                  "orderId":this.data.orderId
                },
                header: {'content-type':'application/x-www-form-urlencoded',
                    Authorization:`Bearer ${userToken}`},
                method: 'POST',
                dataType: 'json',
                responseType: 'text',
                success: (payResult)=>{
                  console.log('提交支付服务器返回数据');
                  console.log(payResult);
                    var messageCode = payResult.data.code;
                    if(messageCode ==0){
                      this.data.appId = payResult.data.data.appId;
                      this.data.nonceStr = payResult.data.data.nonceStr;
                      this.data.packageStr = payResult.data.data.packageStr;
                      this.data.paySign = payResult.data.data.paySign;
                      this.data.signType = payResult.data.data.signType;
                      this.data.timeStamp = payResult.data.data.timeStamp;
                      this.WXPayOrder();
                       
                    }else{
                      wx.db.toastError(payResult.data.msg);
                    }
                },
                fail: (result)=>{
                  wx.db.toastError(result.errMsg);
                },
                complete: ()=>{}
              });
            }

            
          }else{
            wx.db.toastError(orderResult.data.msg);
          }
        },
        fail: (result)=>{
          wx.db.toastError(result.errMsg);
        },
        complete: ()=>{
          this.data.userClcked =false;
        }
      });
    }
  },
  /**
   * 去支付
   */
  goToPay:function(){
    this.WXPayOrder();
  },
  /**
   * 支付
   */
  WXPayOrder:function(){
    wx.requestPayment({
      timeStamp:this.data.timeStamp,
      nonceStr: this.data.nonceStr,
      package: this.data.packageStr,
      signType: this.data.signType,
      paySign: this.data.paySign,
      success: (result)=>{
        
        console.log("微信支付返回成功数数据");
        console.log(result);
        var  shareItemStr = JSON.stringify(this.data.shareItem);
         wx.navigateTo({
          url: `/pages/payInfo/payInfo?orderId=${this.data.orderId}&shareItem=${shareItemStr}&parentId=${this.data.parentId}&type=${this.data.type}`
        });
      },
      fail: ()=>{
        console.log("fail");
        this.setData(this.data);
        // wx.db.toastError(result.data.msg);
      },
      complete: ()=>{
        console.log("complete");
      }
    });
  },

   /**
   * 买家留言
   */
  searchText:function(e){
    this.data.remark =e.detail.value;
  },
  /**
   * 隐藏授权昵称信息弹框
   */
  hideClick(){

    console.log('父类 hideClick');
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "ease",
      delay: 0
  })
  this.animation = animation
  animation.translateY(300).step()
  this.setData({
      animationData: animation.export(),
  })
  setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
          animationData: animation.export(),
          showModalStatus: false
      })
      console.log(this)
  }.bind(this), 200)
},
/**
   * 选择日期弹框
   */
  chooseDataClick(){
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      
      timingFunction: "ease",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(), // export 方法每次调用后会清掉之前的动画操作。
      showRuleStatus: true,
      showBackView:true
    })
    setTimeout(() => {
      animation.translateY(0).step()
      this.setData({
          animationData: animation.export()  // export 方法每次调用后会清掉之前的动画操作。
      })
      console.log(this)
    }, 200)
      },
    
    /**
       * 隐藏选取时间面板
       */
    hideBuyModal(){

      this.data.deliveryPeriodTime = this.data.deliveryPeriodTimeOld;
      this.data.deliveryPeriodFirstTime = this.data.deliveryPeriodFirstTimeOld;

      for(var i=0;i<this.data.deliveryDateArr.length;i++){
        var itemDic = this.data.deliveryDateArr[i];
        if(itemDic.title == this.data.deliveryPeriodTime){
          itemDic.selected = true;
        }else{
          itemDic.selected = false;
        }
      }
       // 隐藏遮罩层
          var animation = wx.createAnimation({
            duration: 200,
            timingFunction: "ease",
            delay: 0
        })
        this.animation = animation
        animation.translateY(300).step()
        this.setData({
            animationData: animation.export(),
        })
        setTimeout(function () {
            animation.translateY(0).step()
            this.setData({
                animationData: animation.export(),
                showBackView:false,
                showModalStatus: false,
                showRuleStatus:false,
                deliveryPeriodTime:this.data.deliveryPeriodTime,
                deliveryPeriodFirstTime:this.data.deliveryPeriodFirstTime,
                deliveryDateArr:this.data.deliveryDateArr
            })
            console.log(this)
        }.bind(this), 200)
    },
   /**
    * 点击保存修改
   */
    sureBtn:function(e){

      // this.data.goodTimesChooseSizeArrSelectdIndexOld
      this.data.deliveryPeriodTimeOld = this.data.deliveryPeriodTime;
      this.data.deliveryPeriodFirstTimeOld = this.data.deliveryPeriodFirstTime;
      // 隐藏遮罩层
      var animation = wx.createAnimation({
        duration: 200,
        timingFunction: "ease",
        delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
        animationData: animation.export(),
    })
    setTimeout(function () {
        animation.translateY(0).step()
        this.setData({
            animationData: animation.export(),
            showBackView:false,
            showModalStatus: false,
            showRuleStatus:false,
            deliveryPeriodTime:this.data.deliveryPeriodTime,
            deliveryPeriodFirstTime:this.data.deliveryPeriodFirstTime
        })
        console.log(this)
    }.bind(this), 200)

    },
    //选择周期
chooseTimes:function(event){
  
  var itemTimes= event.currentTarget.dataset.item;

  console.log('选中的产品');
  console.log(event);
  console.log(itemTimes);

  for(let i=0;i<this.data.deliveryDateArr.length;i++){
    let itemDic=  this.data.deliveryDateArr[i];
    itemDic.selected = false;
  }

  this.data.deliveryDateArr[event.currentTarget.dataset.itemindex].selected = !this.data.deliveryDateArr[event.currentTarget.dataset.itemindex].selected;
  this.data.deliveryPeriodTime = itemTimes.title;
  this.httpItemFistTime();
  this.setData({
    deliveryDateArr: this.data.deliveryDateArr, // 首次配送日期。
    deliveryPeriodTime:this.data.deliveryPeriodTime
  })
  },
  /**
   * 授权用户信息成功后回调
   */
  hidedClick:function(){
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "ease",
      delay: 0
  })
  this.animation = animation
  animation.translateY(300).step()
  this.setData({
      animationData: animation.export(),
  })
  setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
          animationData: animation.export(),
          showModalStatus: false
      })
      console.log(this)
  }.bind(this), 200)
  if(!wx.phone){
    this.setData({
      userPhoneStatus:true
    })
  }
  wx.login({
    timeout:10000,
    success: (result)=>{
      
      wx.code = result.code;
      // wx.login
      console.log(" hidedClick wx.login");
      console.log("wx.code");
      console.log(wx.code);
    },
    fail: ()=>{},
    complete: ()=>{}
  });
  },
  /**
   * 
   * 关闭获取电话号码弹框
   */
  phoneHideClick: function(e) {
    console.log("sureOrder  phoneHideClick");
    console.log(e);

    this.setData({
      // animationData: animation.export(),
      userPhoneStatus: false
    })

    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 0,
      timingFunction: "ease",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        // userPhoneStatus: false
      })
      console.log(this)
    }.bind(this), 0)
  },

})