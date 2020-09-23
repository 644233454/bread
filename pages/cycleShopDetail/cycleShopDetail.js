// pages/cycleShopDetail/cycleShopDetail.js
// pages/goodDetail/goodDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    productId:"",//子id
    parentId:"",//父id
    itemDetail:{},
    defalutItem:{},//默认子产品
    showBackView:false,//北京弹框
    showModalStatus: false,//规格弹框
    showRuleStatus: false,//规则弹框
    userBuyGoodNum:1,//购买数量
    chooseItemDic:{},//选择的规格
    name:"",//产品名称
    topImage:"",//顶部图片介绍
    lowPrice:"",//最低价
    highPrice:"",//最高价
    expressFee:"",//运费
    sellCount:"",//销量
    isPromote:"",//是否推广
    totMoney:0,
    scrollHight:"0",
    specs:[
      
    ],
    imgUrls:[],
    spec:"",
    count:1,
    imgUrl:"",
    price:"",
    goodChooseSizeArr:[],
    goodTimesChooseSizeArr:[],
    sendMethod:"",//配送方式
    description:"",//产品详情图片,
    lowPerHightPrice:false,//最高最低价是否相等
    isFromCar:false,
    commentList:[],//评论数据
    showCommentList:[],//显示评论数据
    roleId:"",//用户角色
    goodCommentItem:"",//好评

    type:"",//类型  PERIOD周期购  NORMAL普通产品
    typeDes:"",//
    deliveryPeriodDes:"",//描述 频率
    deliveryPeriodTime:"",//选择的配送时间
    rule:"",//选择的规则
    deliveryDate:"",//配送日期
    productPeriodId:"",//周期Id


    scrollViewCanScroll:true,


    anticipateEarnbg: "/assets/imgs/fxs_exclusive_recommend_anticipate_earn.png",
    sheetDialogHidden: true,
    sheetDialogMove: false,
    sheetDialogBgOne: "/assets/imgs/fxs_exclusive_recommend_sheetDialog_one.png",
    sheetDialogBgTwo: "/assets/imgs/fxs_exclusive_recommend_sheetDialog_two.png",
    sheetDialogBgThree: "/assets/imgs/fxs_exclusive_recommend_sheetDialog_three.png",
    DialogOneHidden: true,
    DialogOneMove: false,
    DialogOne_dismissBg: "/assets/imgs/fxs_exclusive_recommend_dismiss.png",
    DialogOne_print: "/assets/imgs/fxs_exclusive_recommend_print.png",
    DialogTwoHidden: true,
    DialogTwoMove: false,
    DialogData: {},
    DialogxcxmUrl: "",
    DialogInviteCode: "",
    DialogxcxmUrlBase64Path: "",
    DialogxcxmUrlBase64:"",
    rpx: 1,
    inviteType: "", //邀请类型
    inviteCode: "", //邀请码

    bannerUrls:[],//滚动图片
    remainCount:"",//库存数量

    ORGItemCode:"",//礼品卡代码

    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    changeIndicatorDots: function (e) {
      this.setData({
        indicatorDots: !this.data.indicatorDots
      })
    },
    changeAutoplay: function (e) {
      this.setData({
        autoplay: !this.data.autoplay
      })
    },
    intervalChange: function (e) {
      this.setData({
        interval: e.detail.value
      })
    },
    durationChange: function (e) {
      this.setData({
        duration: e.detail.value
      })
    },
  },


   //轮播结束
  //轮播高度自适应——获取图片高度
  imgHeight: function (e) {
    var winWid = wx.getSystemInfoSync().windowWidth; //获取当前屏幕的宽度
    var imgh = e.detail.height;//图片高度
    var imgw = e.detail.width;//图片宽度
    var swiperH = winWid * imgh / imgw + "px"
    this.setData({
      Height: swiperH//设置高度
    })
  },








  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // options.parentId = 58;
    if(options.ORGItem){
      var ORGItem = JSON.parse(options.ORGItem)
      console.log(" console.log(ORGItem);");
      console.log(ORGItem);
      this.data.parentId  =ORGItem.productParentId;
      this.data.ORGItemCode = ORGItem.code;
    }
    if(options.parentId){
      this.data.parentId = options.parentId;
    }
    console.log("this.data.parentId");
    console.log(this.data.parentId);
    
    this.data.roleId = wx.roleId;
    if(options.productId){
      this.data.productId = options.productId;
    }
    if(options.isFromCar){
      this.data.isFromCar = options.isFromCar;
    }
   

      this.data.scrollHight = wx.db.safeAreaHight -wx.db.navBarHeight-50;
    

    console.log("wx.db.safeAreaHight=");
    console.log(wx.db.safeAreaHight);

    console.log("wx.db.statusBarHeight=");
    console.log(wx.db.statusBarHeight);

    console.log("wx.db.navBarHeight=");
    console.log(wx.db.navBarHeight);

    console.log("wx.db.scrollHight=");
    console.log(this.data.scrollHight);

    var userToken = wx.RiceUserToken;
    var reqTask = wx.request({
      url: wx.db.url('product/detail'),
      data: {
        productId:this.data.parentId
      },
      header: {'content-type':'application/x-www-form-urlencoded'
      },
      method: 'GET',
      responseType: 'text',
      success: (result)=>{
        console.log("项目详情请求成功");
        console.log(result);
        var messageCode = result.data.code;
        if(messageCode ==0){
          this.data.itemDetail = result.data.data;
          // this.data.itemDetail.isOnline = false;
          this.data.specs = result.data.data.specs;
          this.data.name = result.data.data.name;
          this.data.topImage = result.data.data.imgUrls[0];
          this.data.bannerUrls = result.data.data.imgUrls;
          this.data.lowPrice = result.data.data.lowPrice;
          this.data.highPrice = result.data.data.highPrice;
          this.data.isPromote = result.data.data.isPromote;
          if(this.data.lowPrice ==this.data.highPrice){
            this.data.lowPerHightPrice = true;
          }

          this.data.expressFee = result.data.data.expressFee;
          this.data.sellCount = result.data.data.sellCount;
          this.data.description = result.data.data.description;
          console.log("this.data.description ");
          console.log(this.data.description);
          
          this.data.type =result.data.data.type;
          this.data.typeDes =result.data.data.typeDes;
          this.data.goodChooseSizeArr =[];


          // this.data.type ="ORG";


          if (this.data.type =="PERIOD") {
            //周期购
          console.log("result.data.data.specs.length");
          console.log(result.data.data.specs.length);
            for(var i=0;i<result.data.data.specs.length;i++){
              console.log("几次");
              var  item = result.data.data.specs[i];
              item.selected = false;
              item.deliveryDateArray = [];
              if(this.data.productId){
                if(this.data.productId ==item.productId){
                  this.data.chooseItemDic = item;
                  this.data.chooseItemDic.selected = true;
                  this.data.remainCount = this.data.chooseItemDic.remainCount;
                  this.data.deliveryPeriodDes = this.data.chooseItemDic.deliveryPeriodDes +",共"+this.data.chooseItemDic.periodsDes;

                  this.data.price = item.price;
                  this.data.itemId = item.productId;
                  this.data.totMoney = parseFloat(item.price).toFixed(2);
                  console.log("总金额");
                  console.log(this.data.totMoney);
                  this.data.spec = item.value;
                  // deliveryDate
                  var deliveryDate =  item.deliveryDate;
                  item.deliveryDateArray = [];
                  var deliveryDateArray = deliveryDate.split(',');
                  this.data.rule = this.data.chooseItemDic.rule;
                  this.data.goodTimesChooseSizeArr = [];
                  for(var j=0;j<deliveryDateArray.length;j++){
                    
                    var dateItem = {
                      "title":deliveryDateArray[j],
                      "selected":false
                    };


                    item.deliveryDateArray.push(dateItem);
                    console.log("添加后的数据 i==0");
                    console.log(item);
                   
                  }
                  this.data.goodTimesChooseSizeArr=item.deliveryDateArray;
                  console.log("this.data.goodTimesChooseSizeArr");
                  console.log(this.data.goodTimesChooseSizeArr);
                }
              }else{
                console.log("逻辑");
                console.log(i);
                if(i==0){
                  this.data.defalutItem = item;
                  
                  this.data.remainCount = this.data.defalutItem.remainCount;
                  var deliveryDate =  item.deliveryDate;
                  item.deliveryDateArray = [];
                  var deliveryDateArray = deliveryDate.split(',');

                  this.data.goodTimesChooseSizeArr = [];
                  for(var j=0;j<deliveryDateArray.length;j++){
                    var dateItem = {
                      "title":deliveryDateArray[j],
                      "selected":false
                    };

                    item.deliveryDateArray.push(dateItem);
                    console.log("添加后的数据 i==0");
                    console.log(item);
                   
                  }
                  this.data.goodTimesChooseSizeArr=item.deliveryDateArray;
                  console.log("this.data.goodTimesChooseSizeArr");
                  console.log(this.data.goodTimesChooseSizeArr);
    
                }else{
                  var deliveryDate =  item.deliveryDate;
                  item.deliveryDateArray = [];
                  var deliveryDateArray = deliveryDate.split(',');

                  for(var j=0;j<deliveryDateArray.length;j++){
                    var dateItem = {
                      "title":deliveryDateArray[j],
                      "selected":false
                    };

                    item.deliveryDateArray.push(dateItem);
                    console.log("添加后的数据 i==1");
                    console.log(item);
                   
                  }
                }
              }
              
              this.data.goodChooseSizeArr.push(item);
              console.log("数据this.data.goodChooseSizeArr");
              console.log(this.data.goodChooseSizeArr);
            }
          }else{
            //普通产品
            for(var i=0;i<result.data.data.specs.length;i++){
              var  item = result.data.data.specs[i];
              item.selected = false;
              if(this.data.productId){
                if(this.data.productId ==item.productId){
                  this.data.chooseItemDic = item;
                  this.data.remainCount = this.data.chooseItemDic.remainCount;
                  this.data.chooseItemDic.selected = true;
                  this.data.price = item.price;
                  this.data.productId = item.productId;
                  this.data.totMoney = parseFloat(item.price).toFixed(2);
                  console.log("总金额");
                  console.log(this.data.totMoney);
                  this.data.spec = item.value;
                }
              }else
              {
                if(i==0){
                  this.data.defalutItem = item;
                  this.data.remainCount = this.data.defalutItem.remainCount;
                }
              }
              this.data.goodChooseSizeArr.push(item);
            }
          }

          
          
          if(!this.data.productId){

            this.data.chooseItemDic = this.data.defalutItem;
            this.data.remainCount = this.data.chooseItemDic.remainCount;
            if(this.data.chooseItemDic.rule){
              this.data.rule = this.data.chooseItemDic.rule;
            }
            

            this.data.deliveryPeriodDes = this.data.chooseItemDic.deliveryPeriodDes +",共"+this.data.chooseItemDic.periodsDes;

            this.data.chooseItemDic.selected = true;
            this.data.price = this.data.chooseItemDic.price;
            this.data.productId = this.data.chooseItemDic.productId;
            this.data.totMoney = parseFloat(this.data.chooseItemDic.price).toFixed(2);
            console.log("总金额");
            console.log(this.data.totMoney);
            this.data.spec = this.data.chooseItemDic.value;


            console.log("this.data.chooseItemDic.imgUrl");
            console.log(this.data.chooseItemDic.imgUrl);

            // let sceneArr = this.data.chooseItemDic.imgUrl.split("/img");


            // wx.db.toastError(sceneArr[1]);

              this.data.chooseItemDic.selected = true;
              // this.data.price = item.price;
              // this.data.productId = item.productId;
              // this.data.totMoney = parseFloat(item.price).toFixed(2);
              // console.log("总金额");
              // console.log(this.data.totMoney);
              // this.data.spec = item.value;
          }
          this.setData(this.data);
        }else{
          wx.db.toastError(result.data.message);
        }
      },
      fail: ()=>{},
      complete: ()=>{}
    });
    var reqTask = wx.request({
      url: wx.db.url('comment/list'),
      data: {
        "parentId":this.data.parentId,
        "commentType":"0",
        "page":"1",
        "pageSize":20
      },
      header: {'content-type':'application/x-www-form-urlencoded',Authorization:`Bearer ${wx.RiceUserToken}`
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (result)=>{
        console.log('产品评论');
        console.log(result);
        var messageCode = result.data.code;
        if(messageCode ==0){
          this.data.commentList = result.data.data;
          if(this.data.commentList.length>0){
            this.data.goodCommentItem = this.data.commentList[0];
            if(this.data.commentList.length<3){
              this.data.showCommentList = this.data.commentList;
            }else{
              this.data.showCommentList  =[];
              for(var i=0;i<3;i++){
                  var commendModel = this.data.commentList[i];
                  this.data.showCommentList.push(commendModel);
              }
            }
          }
          this.setData(this.data);
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
  /**
   * 周期规格
   */
  showBuyPeriodModal () {
    // 显示遮罩层
    var animation = wx.createAnimation({
        duration: 200,
        /**
          * http://cubic-bezier.com/ 
          * linear 动画一直较为均匀
          * ease 从匀速到加速在到匀速
          * ease-in 缓慢到匀速
          * ease-in-out 从缓慢到匀速再到缓慢
          * 
          * http://www.tuicool.com/articles/neqMVr
          * step-start 动画一开始就跳到 100% 直到动画持续时间结束 一闪而过
          * step-end 保持 0% 的样式直到动画持续时间结束 一闪而过
          */
        timingFunction: "ease",
        delay: 0
    })
    this.animation = animation
    animation.translateY(500).step()
    this.setData({
        animationData: animation.export(), // export 方法每次调用后会清掉之前的动画操作。
        showModalStatus: true,
        showBackView:true,
        scrollViewCanScroll: false
    })

    console.log(this.data.scrollViewCanScroll);

    setTimeout(() => {
        animation.translateY(0).step()
        this.setData({
            animationData: animation.export()  // export 方法每次调用后会清掉之前的动画操作。
        })
        console.log(this)
    }, 200)
},
/**
   * 规则
   */
  showRuleView(){

    this.setData({
      scrollViewCanScroll:false
    })
    console.log("scrollViewCanScroll");
    console.log(this.data.scrollViewCanScroll);
// 显示遮罩层
var animation = wx.createAnimation({
  duration: 200,
  /**
    * http://cubic-bezier.com/ 
    * linear 动画一直较为均匀
    * ease 从匀速到加速在到匀速
    * ease-in 缓慢到匀速
    * ease-in-out 从缓慢到匀速再到缓慢
    * 
    * http://www.tuicool.com/articles/neqMVr
    * step-start 动画一开始就跳到 100% 直到动画持续时间结束 一闪而过
    * step-end 保持 0% 的样式直到动画持续时间结束 一闪而过
    */
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
   * 隐藏面板
   */
hideBuyModal(){
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
            scrollViewCanScroll:true
        })
        console.log(this)
    }.bind(this), 200)
},
//加入购物车
goToCar () {
  this.showBuyPeriodModal();
   
  return;
  if(this.data.userBuyGoodNum>this.data.remainCount){
    wx.db.toastError("库存不足，请稍后重试");
    return;
  }
  var userToken = wx.RiceUserToken;
  var reqTask = wx.request({
    url: wx.db.url('product/addToCar'),
    data: {
      count:this.data.userBuyGoodNum,
      productId:this.data.productId
    },
    header: {'content-type':'application/x-www-form-urlencoded',Authorization:`Bearer ${userToken}`},
    method: 'POST',
    responseType: 'text',
    success: (result)=>{
      console.log("加入购物车成功");
      console.log(result);
      var messageCode = result.data.code;
      if(messageCode ==0)
      {
        wx.db.toastSuccess("已添加到购物车");
      }else{
        wx.db.toastError(result.data.msg);
      }
    },
    fail: ()=>{},
    complete: ()=>{}
  });
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
//加入购物车
goToCarBox () {

  if(this.data.userBuyGoodNum>this.data.remainCount){
    wx.db.toastError("库存不足，请稍后重试");
    return;
  }
  var userToken = wx.RiceUserToken;
  var reqTask = wx.request({
    url: wx.db.url('product/addToCar'),
    data: {
      count:this.data.userBuyGoodNum,
      productId:this.data.productId
    },
    header: {'content-type':'application/x-www-form-urlencoded',Authorization:`Bearer ${userToken}`},
    method: 'POST',
    responseType: 'text',
    success: (result)=>{
      console.log("加入购物车成功");
      console.log(result);
      var messageCode = result.data.code;
      if(messageCode ==0)
      {
        wx.db.toastSuccess("已添加到购物车");
      }else{
        wx.db.toastError(result.data.msg);
      }
    },
    fail: ()=>{},
    complete: ()=>{}
  });
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
//选择规格
chooseSize:function(event){
  

  for(let i=0;i<this.data.goodChooseSizeArr.length;i++){
    let itemDic=  this.data.goodChooseSizeArr[i];
    itemDic.selected = false;
  
    for(let j=0;j<itemDic.deliveryDateArray.length;j++){
      let itemTimesDic= itemDic.deliveryDateArray[j];
      itemTimesDic.selected = false;
    }
  }
  this.data.deliveryPeriodTime  ="";



  var itemSize = event.currentTarget.dataset.item;
  
  this.data.goodChooseSizeArr[event.currentTarget.dataset.itemindex].selected = !this.data.goodChooseSizeArr[event.currentTarget.dataset.itemindex].selected;
  this.data.chooseItemDic = this.data.goodChooseSizeArr[event.currentTarget.dataset.itemindex];
  this.data.remainCount = this.data.chooseItemDic.remainCount;
  this.data.rule = this.data.chooseItemDic.rule;
  this.data.productId = this.data.chooseItemDic.productId;

  this.data.goodTimesChooseSizeArr = itemSize.deliveryDateArray;
  

  this.setData(this.data);
},
chooseNormalSize:function(event){
  for(let i=0;i<this.data.goodChooseSizeArr.length;i++){
    let itemDic=  this.data.goodChooseSizeArr[i];
    itemDic.selected = false;
  }
  this.data.goodChooseSizeArr[event.currentTarget.dataset.itemindex].selected = !this.data.goodChooseSizeArr[event.currentTarget.dataset.itemindex].selected;
  this.data.chooseItemDic = this.data.goodChooseSizeArr[event.currentTarget.dataset.itemindex];
  this.data.remainCount = this.data.chooseItemDic.remainCount;
  this.data.productId = this.data.chooseItemDic.productId;
  console.log('选中的产品');
  console.log(this.data.chooseItemDic);
  this.data.price = this.data.chooseItemDic.price;
  this.data.totMoney = this.data.userBuyGoodNum*this.data.price;
  this.data.spec = this.data.chooseItemDic.value;
  this.setData(this.data);
},
//选择周期
chooseTimes:function(event){
  
  var itemTimes= event.currentTarget.dataset.item;

  console.log('选中的产品');

  console.log(itemTimes);

  for(let i=0;i<this.data.goodTimesChooseSizeArr.length;i++){
    let itemDic=  this.data.goodTimesChooseSizeArr[i];
    itemDic.selected = false;
  }

  this.data.goodTimesChooseSizeArr[event.currentTarget.dataset.itemindex].selected = !this.data.goodTimesChooseSizeArr[event.currentTarget.dataset.itemindex].selected;
  this.data.deliveryPeriodDes = this.data.chooseItemDic.deliveryPeriodDes +",共"+this.data.chooseItemDic.periodsDes;
  this.data.deliveryPeriodTime = this.data.goodTimesChooseSizeArr[event.currentTarget.dataset.itemindex].title;
  this.data.productPeriodId = this.data.chooseItemDic.productPeriodId;
  
  this.data.price =this.data.chooseItemDic.price;
  this.data.totMoney = this.data.userBuyGoodNum*this.data.price;
  this.data.spec = this.data.chooseItemDic.price;
  this.setData(this.data);
},
// chooseTimes:
//减法
reduceNum:function(){
  if(this.data.userBuyGoodNum<2){
    return;
  }
  this.data.userBuyGoodNum --;

  this.data.totMoney = 0;
  this.data.totMoney = this.data.userBuyGoodNum*this.data.price;
  this.data.totMoney =this.data.totMoney.toFixed(2);
  console.log("总金额");
  console.log(this.data.totMoney);

  this.setData(this.data);
},
//加法
addNum:function(){
  this.data.userBuyGoodNum++;
  this.data.totMoney = 0;
  this.data.totMoney = this.data.userBuyGoodNum*this.data.price;
  this.data.totMoney =this.data.totMoney.toFixed(2);
  console.log("总金额"); 
              console.log(this.data.totMoney);
  this.setData(this.data);
},
//回首页
goHomeView:function(){
  wx.switchTab({
    url: '/pages/list/list'
  });
},
//回客服
goTelView:function(){
  wx.navigateTo({
    url: '/pages/goTelView/goTelView'
  });
},
//回购物车
goshopingView:function(){

  wx.switchTab({
    url: '/pages/shoping/shoping'
  });
  // wx.switchTab({
  //   url: '/pages/shoping/shoping'
  // });
},
buyShoping:function(){
  // console.log("传过去的商品详情");

  this.showBuyPeriodModal();
   
  return;

if(this.data.type =="PERIOD"){
  // productPeriodId
  if(!this.data.productPeriodId){
    this.showBuyPeriodModal();
   
    return;
  }
  if(!this.data.deliveryPeriodTime){
   
    this.showBuyPeriodModal();
    return;
  }
}
if(this.data.userBuyGoodNum>this.data.remainCount){
  wx.db.toastError("库存不足，请稍后重试");
  return;
}

// this.data.chooseItemDic
  var orderDic ={
    "productId":this.data.productId,
    "count":this.data.userBuyGoodNum,
    "imgUrl":this.data.topImage,
    "name":this.data.name,
    "price":this.data.price,
    "spec":this.data.spec,
    "isFromCar":this.data.isFromCar,
    "type":this.data.type,
    "deliveryPeriodDes":this.data.deliveryPeriodDes,
    "deliveryPeriodTime":this.data.deliveryPeriodTime,
  }
  console.log(orderDic);
   var  productList =[];
   productList.push(orderDic);
  var  productListDic ={
    "list":productList
  };
  var  productListStr = JSON.stringify(productListDic);
  wx.navigateTo({
    url:  `/pages/sureOrder/sureOrder?productListStr=${productListStr}&totMoney=${this.data.totMoney}&parentId=${this.data.parentId}&type=${this.data.type}&deliveryPeriodDes=${this.data.deliveryPeriodDes}&deliveryPeriodTime=${this.data.deliveryPeriodTime}&productPeriodId=${this.data.productPeriodId}&deliveryDate=${this.data.chooseItemDic.deliveryDate}`
  });
},
/**
   * 弹框立即买入按钮
   */
buyBoxShoping:function(){
  if( this.data.type =='PERIOD' && !this.data.deliveryPeriodTime){
    wx.db.toastError("请选择发货日期");
    // this.showBuyPeriodModal();
    return;
  }
  if(this.data.userBuyGoodNum>this.data.remainCount){
    wx.db.toastError("库存不足，请稍后重试");
    return;
  }

  console.log("this.data.chooseItemDic");
  console.log(this.data.chooseItemDic);

  var orderDic ={
    "productId":this.data.productId,
    "count":this.data.userBuyGoodNum,
    "imgUrl":this.data.chooseItemDic.imgUrl,
    "name":this.data.name,
    "price":this.data.price,
    "spec":this.data.spec,
    "isFromCar":this.data.isFromCar,
    "type":this.data.type,
    "deliveryPeriodDes":this.data.deliveryPeriodDes,
    "deliveryPeriodTime":this.data.deliveryPeriodTime,
  }
  console.log(orderDic);
   var  productList =[];
   productList.push(orderDic);
  var  productListDic ={
    "list":productList
  };
  var  productListStr = JSON.stringify(productListDic);
  wx.navigateTo({
    url:  `/pages/sureOrder/sureOrder?productListStr=${productListStr}&totMoney=${this.data.totMoney}&parentId=${this.data.parentId}&type=${this.data.type}&deliveryPeriodDes=${this.data.deliveryPeriodDes}&deliveryPeriodTime=${this.data.deliveryPeriodTime}&productPeriodId=${this.data.productPeriodId}&deliveryDate=${this.data.chooseItemDic.deliveryDate}`
  });

},
  /**
   * 全部评价
   */
allCommentClick:function(){
  wx.navigateTo({
    url: `/pages/allCommentList/allCommentList?parentId=${this.data.parentId}`
    
  });
},
 /**
   * 兑换礼品
  */
 changeBtnClick:function(){
console.log("兑换");
var orderDic ={
  "productId":this.data.productId,
  "count":this.data.userBuyGoodNum,
  "imgUrl":this.data.chooseItemDic.imgUrl,
  "name":this.data.name,
  "price":"0",
  "spec":this.data.spec,
  "isFromCar":this.data.isFromCar,
  "type":this.data.type,
  "deliveryPeriodDes":this.data.deliveryPeriodDes,
  "deliveryPeriodTime":this.data.deliveryPeriodTime,
  "code":this.data.ORGItemCode
}
console.log(orderDic);
 var  productList =[];
 productList.push(orderDic);
var  productListDic ={
  "list":productList
};
var  productListStr = JSON.stringify(productListDic);
wx.navigateTo({
  url:  `/pages/sureOrder/sureOrder?productListStr=${productListStr}&totMoney=0&parentId=${this.data.parentId}&type=${this.data.type}&deliveryPeriodDes=${this.data.deliveryPeriodDes}&deliveryPeriodTime=${this.data.deliveryPeriodTime}&productPeriodId=${this.data.productPeriodId}&deliveryDate=${this.data.chooseItemDic.deliveryDate}&ORGItemCode=${this.data.ORGItemCode}`
});
},
  /**
   * 用户分享自定义
  */
  onShareAppMessage: function(res) {
    return {
      title: `${this.data.name}`,
      path: `/pages/list/list?pId=${this.data.parentId}&iCode=${wx.iCode}&iT=0`,
      imageUrl: `${this.data.topImage}`//自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径。支持PNG及JPG。显示图片长宽比是 5:4。
    }
  },
  

  // 小程序码
  shareClick:function(){
    
  },
  shareApp:function(){
    this.setData({
      sheetDialogHidden: false
    })
  },



  /**
   * 弹出分享框
   */
  v_share: function(e) {
    console.log("v_share");
    this.data.DialogData = e.currentTarget.dataset.index;
    console.log(JSON.stringify(this.data.DialogData));
    this.setData({
      sheetDialogHidden: false
    })
  },

  /**
   * 底部弹框
   * 非内容部分  阴影点击事件
   */
  v_sheetDialog_click: function() {
    console.log("v_sheetDialog_click");
    this.setData({
      sheetDialogHidden: true,
    })
  },


  /**
   * 底部弹框
   * 取消按钮
   */
  v_sheetDialogContent_cancel_click: function() {
    console.log("v_sheetDialogContent_cancel_click");
    this.setData({
      sheetDialogHidden: true,
    })
  },

  /**
   * 底部弹框
   * 小程序码 点击事件
   */
  v_sheetDialogContentOneOne_click: function() {
    console.log("v_sheetDialogContentOneOne_click");
    this.xcxm(1);

  },

  /**
   * 底部弹框
   * 生成商品海报 点击事件
   */
  v_sheetDialogContentOneTwo_click: function() {
    console.log("v_sheetDialogContentOneTwo_click");
    this.xcxm(2);

  },

  /**
   * 底部弹框
   * 复制链接 点击事件
   */
  v_sheetDialogContentOneThree_click: function() {
    console.log("v_sheetDialogContentOneThree_click");
    this.getInveteCode();
    this.setData({
      sheetDialogHidden: true
    })
  },


  /**
   * 小程序码弹框
   * 非内容部分  阴影点击事件
   */
  v_DialogOne_click: function() {
    console.log("v_DialogOne_click");
    this.setData({
      DialogOneHidden: true,
      DialogxcxmUrl: "",
    })
  },

  /**
   * 小程序码弹框
   * 内容部分 长按事件
   */
  v_DialogOneContent_lonePress: function() {
    console.log("小程序码弹框 长按图片保存至相册");
    this.savePicToAlbum();
  },


  /**
   * 生成海报商品弹框
   * 非内容部分  阴影点击事件
   */
  v_DialogTwo_click: function() {
    console.log("v_DialogTwo_click");
    this.setData({
      DialogTwoHidden: true,
      DialogxcxmUrl: "",
      DialogxcxmUrlBase64: "",
      DialogxcxmUrlBase64Path: "",
    })
  },



/**
 * 生成海报商品弹框
 * 右上角 点击消失
 */
  v_DialogTwo_dismiss:function(){
    console.log("生成海报商品弹框 右上角 点击消失");
    this.setData({
      DialogTwoHidden: true,
      DialogxcxmUrl: "",
      DialogxcxmUrlBase64: "",
      DialogxcxmUrlBase64Path: "",
    })
  },

  /**
   * 生成海报商品弹框
   * 内容部分 长按事件
   */
  v_DialogTwoContent_lonePress: function() {
    console.log("生成海报商品 长按图片保存至相册");
    // this.savePicToAlbum();
    console.log("生成海报商品 长按图片保存至相册");
    //把当前画布指定区域的内容导出生成指定大小的图片。在 draw() 回调里调用该方法才能保证图片导出成功。
    //指定的画布区域的左上角横坐标，指定的画布区域的左上角纵坐标，指定的画布区域的宽度,指定的画布区域的高度，输出的图片的宽度，输出的图片的高度
    let rpx = this.data.rpx;
    let that = this;
    //console.log(rpx);
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 264 * rpx,
      height: 420 * rpx,
      destWidth: 264 * rpx * 3,
      destHeight: 420 * rpx * 3,
      canvasId: 'picture',
      success(res) {
        //临时路径
        //console.log(res.tempFilePath);
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            wx.showToast({
              title: '保存成功',
            })
            that.deleteImage();
            that.setData({
              DialogTwoHidden: true,
              DialogxcxmUrl: "",
              DialogxcxmUrlBase64: "",
              DialogxcxmUrlBase64Path: "",
            });
          },
          fail(res) {
            wx.showToast({
              title: '保存失败',
            })
            that.deleteImage();
            that.setData({
              DialogTwoHidden: true,
              DialogxcxmUrl: "",
              DialogxcxmUrlBase64: "",
              DialogxcxmUrlBase64Path: "",
            });
          }
        },that);
      },
      fail(res) {
        console.log(res);
        wx.showToast({
          title: '保存失败',
        });
        that.deleteImage();
        that.setData({
          DialogTwoHidden: true,
          DialogxcxmUrl: "",
          DialogxcxmUrlBase64: "",
          DialogxcxmUrlBase64Path: "",
        });
      }
    });
  },
//删除本地图片
deleteImage: function () {
  let saveFilePath = this.data.DialogxcxmUrlBase64Path;
  /// 删除写入的数据
  wx.getFileSystemManager().unlink({
    filePath: saveFilePath,
    success: res => {
      console.log('删除成功, 路径: ', saveFilePath);
      // resolve(saveFilePath);
    },
    fail: err => {
      //reject('删除失败：', err);
    }
  })
},

  /**
   * 获取小程序码  base64
   */
  xcxm: function(type) {
    // var userToken = wx.getStorageSync("RiceUerToken");
    let pageUrl = "";
    // console.log(userToken)
    console.log(this.data.DialogData.parentId)



    wx.showLoading({
      title: "",
      mask: true,
      success: (result)=>{
        
      },
      fail: ()=>{},
      complete: ()=>{}
    });

    var reqTask = wx.request({
      url: wx.db.url('promote/product'),
      data: {
        "page": "pages/list/list",
        "pId": this.data.parentId
      },
      header: {
        'content-type': 'application/json',
        Authorization: `Bearer ${wx.RiceUserToken}`
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (result) => {
        console.log(JSON.stringify(result));
        wx.hideLoading();
        var statusCode = result.statusCode; //statusCode为200表示接口请求成功
        var code = result.data.code; //code为0表示获取数据成功
        if (statusCode == 200) {
          if (code == 0) {
            //this.data.DialogxcxmUrl =this.getBase64ImageUrl(result.data.data);
            //this.setData(this.data);
            //弹框
            console.log(type);
            console.log(JSON.stringify(this.data.DialogData));
            if (type == 1) {
              //小程序码
              this.setData({
                // sheetDialogHidden: true,
                DialogOneHidden: false,
                DialogxcxmUrl: this.getBase64ImageUrl(result.data.data),
                DialogData: this.data.DialogData,
                DialogxcxmUrlBase64: result.data.data,
              })
            } else if (type == 2) {
              //生成商品海报
              this.setData({
                // sheetDialogHidden: true,
                DialogTwoHidden: false,
                DialogxcxmUrl: this.getBase64ImageUrl(result.data.data),
                DialogData: this.data.DialogData,
                DialogxcxmUrlBase64: result.data.data,
              })
               //绘制canvas
               this.drawBg();
            }

          } else {
            console.log("statusCode == 200 && code != 0");
            wx.showToast({
              title: result.data.msg,
              icon: "none"
            });
          }
        } else {
          console.log("statusCode != 200");
          wx.showToast({
            title: result.errMsg,
            icon: "none"
          });
        }
      },

      fail: () => {
        console.log("fail");
        wx.showToast({
          title: result.data.errMsg,
          icon: "none"
        });
      },
      complete: () => {
        console.log("complete");
      }
    });
  },
//绘制海报
drawBg: function () {
  let that = this;
  wx.getSystemInfo({
    success: function (res) {
      let rpx = res.windowWidth / 375;
      that.setData({
        rpx: rpx,
      });
      const ctx = wx.createCanvasContext("picture");
      //绘制背景
      ctx.setFillStyle('#ffffff');
      ctx.fillRect(0, 0, 264 * rpx, 420 * rpx)
      ctx.draw(true);

      console.log("that.data.chooseItemDic.imgUrl");
      console.log(that.data.chooseItemDic.imgUrl);
      // var  productListStr = JSON.stringify(that.data.chooseItemDic);
      // let sceneArr = that.data.chooseItemDic.imgUrl.split("/img");
      
     
      // wx.db.toastError(sceneArr[1]);
      //绘制产品图片
      wx.getImageInfo({
        src: that.data.chooseItemDic.imgUrl,
        success(res) {
          ctx.drawImage(res.path, 11 * rpx, 12 * rpx, 242 * rpx, 242 * rpx);
          ctx.draw(true);
          that.setData({
            showLoading: false,
          });
        },
        fail(res) {
          console.log(res)
          that.setData({
            showLoading: false,
          });
        }
      });

      //绘制产品文字
      //文本，绘制文本的左上角 x 坐标位置，绘制文本的左上角 y 坐标位置
      ctx.setFontSize(11);
      ctx.setFillStyle("#666666");
      let text = that.data.name;
      let textLength = that.getTextLength(text, ctx);
      if (264 * rpx > textLength + 20 * rpx) {
        ctx.fillText(text, (264 * rpx - ctx.measureText(text).width) / 2, 275 * rpx);
      } else {
        that.drawText(ctx, text, 10 * rpx, 275 * rpx, 148, 254 * rpx);
      }
      console.log(264 * rpx + "  , " + textLength);
      console.log("绘制二维码图片");

      //绘制二维码图片
      let promise = new Promise((resolve, reject) => {
        let filePath = `${wx.env.USER_DATA_PATH}/02020202020202`;
        console.log("filePath");
        console.log(filePath);
        that.setData({
          DialogxcxmUrlBase64Path: filePath,
        });
        
        wx.getFileSystemManager().writeFile({
          filePath: filePath,
          data: wx.base64ToArrayBuffer(that.data.DialogxcxmUrlBase64),
          encoding: 'binary',
          success: () => {
            console.log('写入成功, 路径: ', filePath);
            ctx.drawImage(filePath, 89 * rpx, 295 * rpx, 86 * rpx, 86 * rpx);
            ctx.draw(true);
          },
          fail: err => {
            reject('写入失败：', err);
            that.setData({
              showLoading: false,
            });
          },
        });
      })



      //绘制长按识别二维码文字
      ctx.setFontSize(11);
      ctx.setFillStyle("#666666");
      // ctx.fillText("长按识别二维码", (264 * rpx - ctx.measureText("长按识别二维码").width) / 2, 400 * rpx);
      ctx.draw(true);
    },
  });
},

  //把base64转换成图片
  getBase64ImageUrl: function(data) {
    /// 获取到base64Data
    var base64Data = data;
    /// 通过微信小程序自带方法将base64转为二进制去除特殊符号，再转回base64
    base64Data = wx.arrayBufferToBase64(wx.base64ToArrayBuffer(base64Data));
    /// 拼接请求头，data格式可以为image/png或者image/jpeg等，看需求
    const base64ImgUrl = "data:image/png;base64," + base64Data;
    console.log(base64ImgUrl);
    return base64ImgUrl;
  },


  /**
   * 保存图片到相册
   */
  savePicToAlbum: function() {
    let that = this;
    //判断用户是否授权"保存到相册"
    wx.getSetting({
      success(res) {
        //没有权限，发起授权
        if (!res.authSetting['scope.writePhotosAlbum']) {
          console.log("wx.authorize");
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() { //用户允许授权，保存图片到相册
              that.savePhoto();
            },
            fail() { //用户点击拒绝授权，跳转到设置页，引导用户授权
              wx.openSetting({
                success() {
                  wx.authorize({
                    scope: 'scope.writePhotosAlbum',
                    success() {
                      that.savePhoto();
                    }
                  })
                }
              })
            }
          })
        } else { //用户已授权，保存到相册
          console.log("that.savePhoto");
          that.savePhoto();
        }
      }
    })
  },


  //保存图片到相册，提示保存成功
  savePhoto: function(e) {
    // let src = e.currentTarget.dataset.src;
    console.log(this.data.DialogxcxmUrl);
    //console.log(src);
    var aa = wx.getFileSystemManager();
    aa.writeFile({
      filePath: wx.env.USER_DATA_PATH + '/PATRIZIA PEPE.png',
      data: this.data.DialogxcxmUrl.slice(22),
      encoding: 'base64',
      success: res => {
        wx.saveImageToPhotosAlbum({
          filePath: wx.env.USER_DATA_PATH + '/PATRIZIA PEPE.png',
          success: function(res) {
            wx.showToast({
              title: '保存成功',
              icon: "success",
              duration: 1000
            });

          },
          fail: function(err) {
            wx.showToast({
              title: '保存失败',
              icon: "none",
              duration: 1000
            })
          },
          complete: () => {
            this.setData({
              DialogOneHidden: true,
              DialogTwoHidden: true,
              sheetDialogHidden:true
            });
          }
        })

      },
      fail: err => {}
    })
  },


  getInveteCode: function() {
    // var userToken = wx.getStorageSync("RiceUerToken");
    // console.log(userToken)
    var reqTask = wx.request({
      url: wx.db.url('promote/getInviteCode'),
      data: {},
      header: {
        'content-type': 'application/json',
        Authorization: `Bearer ${wx.RiceUserToken}`
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (result) => {
        console.log(JSON.stringify(result));
        var statusCode = result.statusCode; //statusCode为200表示接口请求成功
        var code = result.data.code; //code为0表示获取数据成功
        if (statusCode == 200) {
          if (code == 0) {
            this.setData({
              DialogInviteCode: result.data.data
            });
            wx.showToast({
              title: '复制链接成功',
              icon: "none"
            })
          } else {
            console.log("statusCode == 200 && code != 0");
            wx.showToast({
              title: result.data.msg,
              icon: "none"
            });
          }
        } else {
          console.log("statusCode != 200");
          wx.showToast({
            title: result.errMsg,
            icon: "none"
          });
        }
      },

      fail: () => {
        console.log("fail");
        wx.showToast({
          title: result.data.errMsg,
          icon: "none"
        });
      },
      complete: () => {
        console.log("complete");
      }
    });
  },

  /**
   * 用户分享自定义
   */
  onShareAppMessage: function(res) {
    // console.log("iCode=" + this.data.inviteCode);
    // console.log("iT=" + this.data.inviteType);
    // return {
    //   title: `${this.data.DialogData.productName}`,
    //   path: `/pages/list/list?pId=${this.data.DialogData.parentId}&pageId=generalize&iCode=${this.data.inviteCode}&iT=${this.data.inviteType}`,
    //   imageUrl: `${this.data.DialogData.imgUrl}` //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径。支持PNG及JPG。显示图片长宽比是 5:4。
    // }
    return {
      title: `${this.data.name}`,
    path: `/pages/list/list?pId=${this.data.parentId}&iCode=${wx.iCode}&iT=0`,
    imageUrl: `${this.data.topImage}`//自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径。支持PNG及JPG。显示图片长宽比是 5:4。
    }
  },
  // 预览图片
  previewImg: function (e) {
    //获取当前图片的下标
    var index = e.currentTarget.dataset.index;
    var item = e.currentTarget.dataset.item;
    console.log("选中的第几个");
    console.log(e);

    //所有图片
    // var imgs = this.data.tempFilePaths;
    wx.previewImage({
      //当前显示图片
      current: item.imgUrls[index],
      //所有图片
      urls: item.imgUrls
    })
  },
  //获取文本长度
  getTextLength: function (str, ctx) {
    var lineWidth = 0;
    console.log("str");
    console.log(str);
    var lastSubStrIndex = 0; //每次开始截取的字符串的索引
    for (let i = 0; i < str.length; i++) {
      lineWidth += ctx.measureText(str[i]).width;
    }
    return lineWidth;
  },
  //文本换行 参数：1、canvas对象，2、文本 3、距离左侧的距离 4、距离顶部的距离 5、6、文本的宽度
  drawText: function (ctx, str, leftWidth, initHeight, titleHeight, canvasWidth) {
    var lineWidth = 0;
    var lastSubStrIndex = 0; //每次开始截取的字符串的索引
    for (let i = 0; i < str.length; i++) {
      lineWidth += ctx.measureText(str[i]).width;
      if (lineWidth > canvasWidth) {
        ctx.fillText(str.substring(lastSubStrIndex, i), leftWidth, initHeight); //绘制截取部分
        initHeight += 16; //16为字体的高度
        lineWidth = 0;
        lastSubStrIndex = i;
        titleHeight += 30;
      }
      if (i == str.length - 1) { //绘制剩余部分
        ctx.fillText(str.substring(lastSubStrIndex, i + 1), leftWidth, initHeight);
      }
    }
    // 标题border-bottom 线距顶部距离
    titleHeight = titleHeight + 10;
    return titleHeight
  },
  // testClick:function(){
  //   console.log("ceshi");
  // }
})
