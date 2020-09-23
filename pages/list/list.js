// pages/list/list.js
Page({
  data: {
    title: '',
    goodsList:[],
    productId:"",//子id
    parentId:"",//父id
    showModalStatus: false,//弹框
    userBuyGoodNum:1,//购买数量
    chooseItemDic:{},//选择的规格
    name:"",//产品名称
    topImage:"",//顶部图片介绍
    lowPrice:"",//最低价
    highPrice:"",//最高价
    expressFee:"",//运费
    sellCount:"",//销量
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
    sendMethod:"",//配送方式
    description:"",//产品详情图片,
    lowPerHightPrice:false,//最高最低价是否相等
    scrollerVieHight:"",
    remainCount:"",//库存

    scrollBottom:false,
    page:1,//页码
    pageSize:20,//每页数据
    type:"",
    goodTimesChooseSizeArr:[],
    // tst:"1213123123"
  },
  onLoad: function (options) {


    console.log(wx.db.windowHeight);
    console.log(wx.db.safeAreaHight);
    this.data.scrollerVieHight =wx.db.windowHeight  - wx.db.navBarHeight-40- wx.db.statusBarHeight;
    console.log(this.data.scrollerVieHight);
    




    this.data.scene = decodeURIComponent(options.scene);

    
    this.data.scene = unescape(this.data.scene);

    if(options.scene){
//二维码分享进来

      // log.info('二维码分享进来')
      // log.info("传入参数");
      // log.info(options);

      console.log("二维码分享进来");
      console.log("传入参数");
      console.log(options);

      let sceneArr = this.data.scene.split("&");

      
      var dic = new Array();
      for(var i=0;i<sceneArr.length;i++){
        var itemStr= sceneArr[i];
        var itemArr = itemStr.split("=");
        dic[itemArr[0]] = itemArr[1];
      }

    this.data.iCode = dic.iC?dic.iC:"";
    this.data.iT = dic.iT?dic.iT:"";
    this.data.pId = dic.pId?dic.pId:"";
    this.data.pId = dic.pId?dic.pId:"";
    this.data.orgOrderId = dic.orgOrderId?dic.orgOrderId:"";

      // let iC=sceneArr[0].split("=")[1];

     
      // this.data.iCode = iC?iC:"";
      
      

      // let iT=sceneArr[1].split("=")[1];
      

      // this.data.iT =iT?iT:"";


      // if(sceneArr.length>2){

      //   this.data.pId =sceneArr[2].split("=")[1];
       
      // }
    }else{
//分享链接进来的 
 
      // log.info("分享链接");
      // log.info("传入参数");
      // log.info(options);

      // console.log("分享链接进来");
      // console.log("传入参数");
      // console.log(options);

      this.data.iCode = options.iCode?options.iCode:"";

      this.data.iT  = options.iT?options.iT:"";
      
     
      this.data.orgOrderId = options.orgOrderId?options.orgOrderId:"";
      this.data.pId = options.pId?options.pId:"";
      
    }
    

    console.log("11111111111111");

    wx.iCode = this.data.iCode;
    wx.iT =  this.data.iT;
    wx.orgOrderId = this.data.orgOrderId;
    wx.login({
      timeout: 10000,
      success: (result) => {
        

        wx.setStorageSync('RiceUserCode', result.code);

        console.log("222222222222");
        var reqTask = wx.request({
          url: wx.db.url('auth/login'),
          data: {
            "code": result.code,
            "iCode": this.data.iCode,
            "iT": this.data.iT
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          method: 'POST',
          dataType: 'json',
          responseType: 'text',
          success: (result) => {
            console.log("3333333333");
            console.log("服务器获取用户token");
            
            console.log(result);
            var uerToken = result.data.data.token;
            wx.isAuth = result.data.data.isAuth;
            wx.headImgUrl = result.data.data.headImgUrl;
            this.data.userHeadImage = wx.headImgUrl;
            wx.nickName = result.data.data.nickName;
            this.data.userNickName = wx.nickName;
            wx.RiceUserToken = result.data.data.token;
            wx.userToken = result.data.data.token;
            wx.iCode = result.data.data.inviteCode;
            wx.roleId = result.data.data.roleId;
            this.data.roleId = result.data.data.roleId;
            wx.phone = result.data.data.phone;
            this.data.alreayLoginHttp = true;

            if(this.data.iT==2){
              //大客户团购礼品
              // log.info("this.data.pId");
              // log.info(this.data.pId);
                console.log('this.data.pId');
                console.log(this.data.pId);
                console.log('跳转到goodDetail');
                // log.info("跳转到goodDetail");
                wx.navigateTo({
                  url: `/pages/fxs/lipinjuan_get/lipinjuan_get`
                });
              }else{
                
                if(this.data.iT==1){
                   
                   //邀请好友
                   console.log('this.data.iT');
                   console.log(this.data.iT);
                   console.log('跳转到tab_mine');
                  //  log.info("跳转到tab_mine");
                     wx.switchTab({
                       url: '/pages/fxs/tab_mine/tab_mine'
                     });
                  }else{
                    if(this.data.pId>0){
                      //分享单个产品
                      // log.info("this.data.pId");
                      //  log.info(this.data.pId);
                       console.log('this.data.pId');
                       console.log(this.data.pId);
                       console.log('跳转到goodDetail');
                      //  log.info("跳转到goodDetail");
                     wx.navigateTo({
                        url: `/pages/cycleShopDetail/cycleShopDetail?parentId=${this.data.pId}`
                      });
                    }
                  }

              }
            this.setData(this.data);
          },
          fail: () => {},
          complete: () => {}
        });
      },
      fail: () => {
        wx.db.toastError("请求失败 请退出重试");
      },
      complete: () => {}
    });
  
    // tst ='<div st> </div>'
    
  },
    /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.data.page =1;
    this.getItemList();
    
  },
  getItemList:function(){
    var reqTask = wx.request({
      url: wx.db.url('product/all'),
      data: {
        "page":this.data.page,
        "pageSize":this.data.pageSize
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
       
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (result)=>{
        var messageCode = result.data.code;
        console.log('好货服务器返回数');
        console.log(result);
        if(messageCode ==0){
          if(this.data.page ==1){
            this.data.goodsList =result.data.data;
          }else{
            this.data.goodsList =this.data.goodsList.concat(result.data.data);
          }
          
          this.setData(this.data);
        }else{
          wx.db.toastError(result.data.msg);
        }
      },
      fail: ()=>{},
      complete: ()=>{}
    });

  },
  searchScrollLower:function(e){
    console.log('滑动到底部');
    if(this.data.scrollBottom ==true){
      return;
    }
    this.data.scrollBottom = true;
    this.data.page +=1;
    var userToken = wx.RiceUserToken;

    // console.log("滑动到底部传参 queryStr= "+this.data.inputValue+"page ="+this.data.page+"pageSize="+this.data.pageSize);


    var reqTask = wx.request({
      url: wx.db.url('product/all'),
      data: {
        "page":this.data.page,
        "pageSize":this.data.pageSize
      },
      header: {'content-type':'application/x-www-form-urlencoded'},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (result)=>{
        var messageCode = result.data.code;
        console.log('好货服务器返回数');
        console.log(result);
        if(messageCode ==0){
          this.data.goodsList =this.data.goodsList.concat(result.data.data);
          this.setData(this.data);
        }else{
          wx.db.toastError(result.data.msg);
        }
        this.data.scrollBottom = false;
      },
      fail: ()=>{},
      complete: ()=>{}
    });
    
  },
  back: function(evt) {
    console.log('back', evt.detail);
  },
  home: function(evt) {
    console.log('home', evt.detail);
  },
  searchGoods:function(){
    wx.navigateTo({
      url: '/pages/searchGoods/searchGoods'
    });
  },
  goodDetail:function(e){
    var selectindex = e.currentTarget.dataset.itemindex;
    var item = this.data.goodsList[selectindex];

    wx.navigateTo({
      url: `/pages/cycleShopDetail/cycleShopDetail?parentId=${item.parentId}`
    });
  },
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
          showModalStatus: false
      })
      console.log(this)
  }.bind(this), 200)
},
showBuyModal (event) {
  console.log(event);
var clickIten =this.data.goodsList[event.currentTarget.dataset.itemindex];
this.data.parentId = clickIten.parentId;
  console.log('选中的商品');
  console.log(clickIten);
  var userToken = wx.RiceUserToken;
    var reqTask = wx.request({
      url: wx.db.url('product/detail'),
      data: {
        productId:clickIten.parentId
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
          this.data.specs = result.data.data.specs;
          this.data.name = result.data.data.name;
          this.data.topImage = result.data.data.imgUrls[0];
          this.data.lowPrice = result.data.data.lowPrice;
          this.data.highPrice = result.data.data.highPrice;
          this.data.userBuyGoodNum =1;
          if(this.data.lowPrice ==this.data.highPrice){
            this.data.lowPerHightPrice = true;
          }
          this.data.type  =result.data.data.type;
          this.data.expressFee = result.data.data.expressFee;
          this.data.sellCount = result.data.data.sellCount;
          this.data.description = result.data.data.description;

          this.data.goodChooseSizeArr = result.data.data.specs;
          this.data.deliveryPeriodTime  ="";
          if(this.data.type =="PERIOD"){
            for(var i=0;i<this.data.goodChooseSizeArr.length;i++){
              var  item = this.data.goodChooseSizeArr[i];
              if(i==0){
                this.data.chooseItemDic = item;
                this.data.chooseItemDic.selected = true;
                this.data.remainCount = this.data.chooseItemDic.remainCount;
                this.data.price = item.price;
                this.data.productId = item.productId;
                this.data.totMoney = parseFloat(item.price).toFixed(2);
                var deliveryDate =  item.deliveryDate;
                item.deliveryDateArray = [];
                var deliveryDateArray = deliveryDate.split(',');
                for(var j=0;j<deliveryDateArray.length;j++){
                  var dateItem = {
                    "title":deliveryDateArray[j],
                    "selected":false
                  };
                  item.deliveryDateArray.push(dateItem);
                }
                this.data.goodTimesChooseSizeArr=item.deliveryDateArray;
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
              }
            }
          }

          }else{
            for(var i=0;i<this.data.goodChooseSizeArr.length;i++){
              var  item = this.data.goodChooseSizeArr[i];
              item.selected = false;
              if(i==0){
                this.data.chooseItemDic = item;
                this.data.chooseItemDic.selected = true;
                this.data.remainCount = this.data.chooseItemDic.remainCount;
                this.data.price = item.price;
                this.data.productId = item.productId;
                this.data.totMoney = parseFloat(item.price).toFixed(2);
                console.log("总金额");
                console.log(this.data.totMoney);
                this.data.spec = item.value;
              }
            }
          }

          this.setData(this.data);

          this.showItemDetail();
          
        }else{
          wx.db.toastError(result.data.msg);
        }
      },
      fail: ()=>{},
      complete: ()=>{}
    });








  
},
showItemDetail:function(){
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
console.log('显示');
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
  this.data.goodChooseSizeArr[event.currentTarget.dataset.itemindex].selected = !this.data.goodChooseSizeArr[event.currentTarget.dataset.itemindex].selected;
  this.data.chooseItemDic = this.data.goodChooseSizeArr[event.currentTarget.dataset.itemindex];
  this.data.remainCount = this.data.chooseItemDic.remainCount;
  this.data.productId = this.data.chooseItemDic.productId;


  this.data.price = this.data.chooseItemDic.price;
  this.data.spec = this.data.chooseItemDic.value;
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
//加入购物车
goToCar () {

  if(this.data.userBuyGoodNum>this.data.remainCount){
    wx.db.toastError("库存不足，请稍后重试");
    return;
  }
  var userToken =wx.RiceUserToken;
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
buyShoping:function(){
  if(this.data.userBuyGoodNum>this.data.remainCount){
    wx.db.toastError("库存不足，请稍后重试");
    return;
  }
  console.log("传过去的商品详情");
  var orderDic ={
    "productId":this.data.productId,
    "count":this.data.userBuyGoodNum,
    "imgUrl":this.data.chooseItemDic.imgUrl,
    "name":this.data.name,
    "price":this.data.price,
    "spec":this.data.spec
  }
  console.log(orderDic);
   var  productList =[];
   productList.push(orderDic);
  var  productListDic ={
    "list":productList
  };
  var  productListStr = JSON.stringify(productListDic);
  wx.navigateTo({
    url:  `/pages/sureOrder/sureOrder?productListStr=${productListStr}&totMoney=${this.data.totMoney}&parentId=${this.data.parentId}`
  });
},
buyBoxShoping:function(){
  if(!this.data.deliveryPeriodTime){
    wx.db.toastError("请选择发货日期");
   
    return;
  }
  if(this.data.userBuyGoodNum>this.data.remainCount){
    wx.db.toastError("库存不足，请稍后重试");
    return;
  }
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
goToShop:function(){
  console.log('去购物车');
  wx.switchTab({
    url: '/pages/shoping/shoping'
  });
}
 })