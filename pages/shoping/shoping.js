// pages/shoping/shoping.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allChoose:false,
    haveUnderGood:true,
    offLineGoodNum:0,
    userHaveChoosed:false,
    isFromCar:true,
    totMoney:0,
    editText:"编辑",
    btnText:"去结算",
    marketedProductsList:[],//精选商品
    userOpenEdit:false,
    itemDetail:{},
    reduceClick:false,
    onlineProducts:[
      // {
      //   image:"/assets/imgs/shopInfo.png",
      //   title:"东北臻致大米稻花香巴拉巴里巴莱臻致大米稻花香巴拉巴里巴莱",
      //   wight:"5kg",
      //   price:"￥88.90",
      //   buyNum:"2",
      //   isClick:false
      // },
      // {
      //   image:"/assets/imgs/shopInfo.png",
      //   title:"东北臻致大米稻花香臻香",
      //   wight:"3kg",
      //   price:"￥69.99",
      //   buyNum:"2",
      //   isClick:false
      // },
      // {
      //   image:"/assets/imgs/shopInfo.png",
      //   title:"东北臻致大米稻花香莱",
      //   wight:"1kg",
      //   price:"￥19.98",
      //   buyNum:"12",
      //   isClick:false
      // },
      // {
      //   image:"/assets/imgs/shopInfo.png",
      //   title:"东北臻致大米稻花香巴拉巴里巴莱臻致大米稻花香巴拉巴里巴莱",
      //   wight:"10kg",
      //   price:"￥188.90",
      //   buyNum:"1",
      //   isClick:false
      // }
    ],
    navHight:"0",
    contrainHight:"0",
    scrollHight:"0",
    offLineProducts:[],
    boxTotMoney:0

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    

    console.log("wx.db.safeAreaHight");
    console.log(wx.db.safeAreaHight);


    this.data.contrainHight =wx.db.safeAreaHight  - wx.db.navBarHeight-50-36;
    console.log('内容高度');
    console.log(this.data.contrainHight);
    //精选商品
    var userToken =wx.RiceUserToken;
    var reqTask = wx.request({
      url: wx.db.url('product/marketedProducts'),
      data: {},
      header: {'content-type':'application/x-www-form-urlencoded',
                Authorization:`Bearer ${userToken}`},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (result)=>{
        console.log('精选商品请求成功');
        console.log(result);
        var messageCode = result.data.code;
        if(messageCode ==0){
          this.data.marketedProductsList = result.data.data;
          this.setData(this.data);
        }else{

        }
      },
      fail: ()=>{},
      complete: ()=>{}
    });
    // /product/carList
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // const topHeight = wx.db.statusBarHeight + wx.db.navBarHeight;

    // let selQuery = wx.createSelectorQuery(containerId);
    // contrainHight =calc(100vh-{{topHeight}}rpx)
    

    // console.log(this.data.contrainHight);
    // this.setData(this.data);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
    console.log("onShow生命周期函数--监听页面显示");
    this.data.reduceClick = false;
    this.getUserShoInfo();
    
   
  },
  /**
   * 请求购物车信息
   */
  getUserShoInfo:function(){
    var userToken =wx.RiceUserToken;
    var reqTask = wx.request({
      url: wx.db.url('product/carList'),
      data: {},
      header: {'content-type':'application/x-www-form-urlencoded',
                Authorization:`Bearer ${userToken}`},
      method: 'GET',
      responseType: 'text',
      success: (result)=>{
        console.log('购物车请求成功');
        console.log(result);
        var messageCode = result.data.code;
        if(messageCode ==0){
          this.data.offLineProducts = result.data.data.offLineProducts;
          this.data.offLineGoodNum =this.data.offLineProducts.length;
          console.log('购物车线上产品')
          console.log(result.data.data.onlineProducts)
        
          this.data.onlineProducts = result.data.data.onlineProducts;

          console.log('购物车线上产品')
          console.log(this.data.onlineProducts)

          this.data.totMoney =0;
          this.data.allChoose =true;
          if(this.data.onlineProducts.length>0){
            this.data.contrainHight =wx.db.safeAreaHight  - wx.db.navBarHeight-50-36;
          }else{
            this.data.contrainHight =wx.db.safeAreaHight  - wx.db.navBarHeight-36;
          }
          for(var i=0;i<this.data.onlineProducts.length;i++){
            var item  =this.data.onlineProducts[i];
            this.data.totMoney += item.price*item.count;
              item.isClick = true;
          }
          console.log('共计金额');
          console.log(this.data.totMoney);
          this.data.totMoney = this.data.totMoney.toFixed(2);
          // this.data.contrainHight = wx.db.windowHeight;

          if(this.data.onlineProducts.length>0){
            this.data.scrollHight =this.data.contrainHight -50 - 36;
            // wx.db.safeAreaHight -50 - wx.db.navBarHeight;
          }else{
            this.data.scrollHight =this.data.contrainHight - 36;
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
   * 点击选中商品
   */
  itemClicl:function(event){
   
    console.log(event);
    let clickBool = this.data.onlineProducts[event.currentTarget.dataset.itemindex].isClick;
    clickBool = !clickBool;
    console.log(clickBool);

    this.data.onlineProducts[event.currentTarget.dataset.itemindex].isClick = clickBool;

    let index =`onlineProducts[${event.currentTarget.dataset.itemindex}].isClick`;
    
    this.data.totMoney = 0;
    for ( let i = 0; i < this.data.onlineProducts.length; i++) { 
      let item = this.data.onlineProducts[i];
      if(!item.isClick){
        this.data.allChoose = false;
        break;
      }else{
        this.data.allChoose = true;
      }
   }
   this.data.totMoney = 0;
   for(var i=0;i<this.data.onlineProducts.length;i++){
     var itemObj = this.data.onlineProducts[i];
     console.log(itemObj);
     if(itemObj.isClick){
       console.log('计算');
       this.data.totMoney += itemObj.price*itemObj.count;
     }
   }
   this.data.totMoney = parseFloat(this.data.totMoney).toFixed(2);
   console.log(this.data.allChoose);
    this.setData({
      [index]:clickBool,
      "allChoose":this.data.allChoose,
      totMoney:this.data.totMoney
    })
  },
  /**
   * 商品详情
   */
  itemDetail:function(e){

    var item = this.data.onlineProducts[e.currentTarget.dataset.itemindex];

    wx.navigateTo({
      url: `/pages/cycleShopDetail/cycleShopDetail?parentId=${item.parentId}&isFromCar=${this.data.isFromCar}`
    });
  },
  //清空购物车
  clearUnderGood:function(){
    var productIdArr = [];

    for(var i=0;i<this.data.offLineProducts.length;i++){
      var item = this.data.offLineProducts[i];
      productIdArr.push(item.productId);
    }
    
    var userToken =wx.RiceUserToken;
    var reqTask = wx.request({
      url: wx.db.url('product/delCarProduct'),
      data: {
        "productIds":productIdArr
      },
      header: {'content-type':'application/x-www-form-urlencoded',Authorization:`Bearer ${userToken}`},
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: (result)=>{
        console.log('服务器返回下架数据');
        console.log(result);
        this.data.offLineProducts = [];
        this.setData(this.data);
      },
      fail: ()=>{},
      complete: ()=>{}
    });


    
  },
  /**
   * 减法
   */
reduceNum:function(event){

  console.log("reduceNum");
  console.log("this.data.reduceClick");
  console.log(this.data.reduceClick);
  var item = this.data.onlineProducts[event.currentTarget.dataset.itemindex];

  

  if(item.count<2){
    return;
  }
  if(this.data.reduceClick ==true){
    return;
  }
  this.data.reduceClick =true;

  var userToken =wx.RiceUserToken;
  var reqTask = wx.request({
    url: wx.db.url('product/addToCar'),
    data: {
      count:-1,
      productId:item.productId
    },
    header: {'content-type':'application/x-www-form-urlencoded',Authorization:`Bearer ${userToken}`},
    method: 'POST',
    responseType: 'text',
    success: (result)=>{
      console.log("减少购物车成功");
      console.log(result);
      var messageCode = result.data.code;
      if(messageCode ==0)
      {


        item.count--;
        this.data.reduceClick = false;
      console.log("success this.data.reduceClick");
      console.log(this.data.reduceClick);
        this.data.totMoney = 0;
        for(var i=0;i<this.data.onlineProducts.length;i++){
          var itemObj = this.data.onlineProducts[i];
          console.log(itemObj);
          if(itemObj.isClick ==true){
            this.data.totMoney += itemObj.price*itemObj.count;
          }
        }
        this.data.totMoney = this.data.totMoney.toFixed(2);
        this.setData(this.data);
        
        // wx.db.toastSuccess("已添加到购物车");
      }else{
        this.data.reduceClick = false;
        wx.db.toastError(result.data.msg);
      }
    },
    fail: (result)=>{
      console.log("减少购物车失败");
      console.log(result);
      this.data.reduceClick =false;
      this.data.reduceClick = false;
      console.log("fail this.data.reduceClick");
      console.log(this.data.reduceClick);
    },
    complete: ()=>{
      
    }
  });
},
/**
   * 加法
   */
addNum:function(event){


  if(this.data.reduceClick ==true){
    return;
  }
  this.data.reduceClick =true;

  var item = this.data.onlineProducts[event.currentTarget.dataset.itemindex];
  var userToken =wx.RiceUserToken;
  var reqTask = wx.request({
    url: wx.db.url('product/addToCar'),
    data: {
      count:1,
      productId:item.productId
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

        item.count++;
        this.data.reduceClick =false;
        this.data.totMoney = 0;
        for(var i=0;i<this.data.onlineProducts.length;i++){
          var itemObj = this.data.onlineProducts[i];
          console.log(itemObj);
          if(itemObj.isClick ==true){
            this.data.totMoney += itemObj.price*itemObj.count;
          }
        }
        this.data.totMoney = this.data.totMoney.toFixed(2);
        this.setData(this.data);
        
        // wx.db.toastSuccess("已添加到购物车");
      }else{
        this.data.reduceClick =false;
        wx.db.toastError(result.data.msg);
      }
    },
    fail: (result)=>{
      console.log("加入购物车失败");
      console.log(result);
      this.data.reduceClick =false;
    },
    complete: ()=>{}
  });
},
  /**
   * 全选
   */
allChoose:function(){

  this.data.allChoose = !this.data.allChoose;
  this.data.totMoney = 0;
  for ( let i = 0; i < this.data.onlineProducts.length; i++) { 
    let item = this.data.onlineProducts[i];
    item.isClick = this.data.allChoose;
    if(item.isClick){
      console.log('计算');
      this.data.totMoney += item.price*item.count;
    }
 }

 
 this.data.totMoney = this.data.totMoney.toFixed(2);
 this.setData(this.data);
},
/**
   * 编辑按钮
   */
editClicl:function(){

  console.log('购物车线上产品')
  console.log(this.data.onlineProducts)


  this.data.userOpenEdit = !this.data.userOpenEdit;
  if(this.data.userOpenEdit){
    this.data.editText ="完成";
    this.data.btnText ="删除";
  }else{
    this.data.editText ="编辑";
    this.data.btnText ="去结算";
  }
  this.setData(this.data);
},
/**
   * 确定按钮
   */
sureBtnClick:function(){

  console.log('购物车线上产品sureBtnClick')
  console.log(this.data.onlineProducts)
  this.data.userHaveChoosed = false;
    for ( var i = 0; i < this.data.onlineProducts.length; i++) { 
      var item = this.data.onlineProducts[i];
      console.log('确定按钮遍历数据');
      console.log(item);
      console.log(i);
      if(item.isClick){
        this.data.userHaveChoosed = true;
        break;
      }else{
        this.data.allChoose = false;
      }
    }
    console.log('确定按钮');
    console.log(this.data.userHaveChoosed);
    if(!this.data.userHaveChoosed){
      wx.showModal({
        title: '提示',
        content: '请选择商品',
        showCancel: false,
        confirmText: '确定',
        confirmColor: '#3CC51F',
        success: (result) => {
          if(result.confirm){
            console.log("成功");
          }
        },
        fail: ()=>{},
        complete: ()=>{}
      });
      return;
    }
    


  if(this.data.userOpenEdit){

    console.log('购物车线上产品userOpenEdit')
    console.log('删除购物车商品确定按钮')
    console.log(this.data.onlineProducts)
    
    wx.showModal({
      title: '',
      content: '确定删除勾选商品吗',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: (result) => {
        if(result.confirm){
          console.log("确定");
          console.log(this.data.onlineProducts)
          var chooseArr  =[];

          var noSelectItemArr = [];
          for(var i=0;i < this.data.onlineProducts.length; i++){
            var itemObj = this.data.onlineProducts[i];
            console.log("遍历商品");
            console.log(itemObj);
            if(itemObj.isClick){
              chooseArr.push(itemObj.productId);
              // this.data.onlineProducts.splice(i,1);
            }else{
              noSelectItemArr.push(itemObj);
            }
          }
          this.data.onlineProducts = noSelectItemArr;
        var userToken = wx.RiceUserToken;
        console.log("删除的商品id");
        console.log(chooseArr);
    var reqTask = wx.request({
      url: wx.db.url('product/delCarProduct'),
      data: {
        "productIds":chooseArr
      },
      header: {'content-type':'application/x-www-form-urlencoded',Authorization:`Bearer ${userToken}`},
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: (result)=>{
        wx.db.toastSuccess("删除成功");
        this.data.userOpenEdit =false;
        this.data.editText ="编辑";
        this.data.btnText ="去结算";
        this.data.totMoney =0;
          for(var i=0;i<this.data.onlineProducts.length;i++){
            var item  =this.data.onlineProducts[i];
            this.data.totMoney += item.price*item.count;
              item.isClick = true;
          }
          console.log('共计金额');
          console.log(this.data.totMoney);
          this.data.totMoney = this.data.totMoney.toFixed(2);


        // this.data.offLineProducts = [];
        this.setData(this.data);
      },
      fail: ()=>{},
      complete: ()=>{}
    });


        }
      },
      fail: ()=>{},
      complete: ()=>{}
    });
    }else{
      console.log('数据'+this.data.offLineProducts);
        var productList  =[];
        var parentId='';
        for(var i=0;i<this.data.onlineProducts.length;i++){

          var item = this.data.onlineProducts[i];
          if(i==0){
            parentId = item.parentId;
          }

          if(item.isClick){
            productList.push(item);
           
          }else{
            
          }
          
        }

        var  productListDic ={
          "list":productList
        };
        var  productListStr = JSON.stringify(productListDic);


      wx.navigateTo({
        url: `/pages/sureOrder/sureOrder?productListStr=${productListStr}&totMoney=${this.data.totMoney}&isFromCar=${this.data.isFromCar}&parentId=${parentId}`
      });      
    }
},
/**
   * 商品详情
   */
goodDetail:function(e){
  var selectindex = e.currentTarget.dataset.itemindex;
  var item = this.data.marketedProductsList[selectindex];
  // var parentId=item.parentId;
  wx.navigateTo({
    url: `/pages/cycleShopDetail/cycleShopDetail?parentId=${item.parentId}`
  });
},
/**
   * 隐藏购物弹框
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
        showModalStatus: false
    })
    console.log(this)
}.bind(this), 200)
},
/**
   * 弹框商品详情
   */
showBuyModal (event) {
console.log(event);
// marketedProductsList
var clickIten =this.data.marketedProductsList[event.currentTarget.dataset.itemindex];
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
        this.data.itemDetail = result.data.data;
        // this.data.itemDetail.isOnline = false;
        this.data.specs = result.data.data.specs;
        this.data.name = result.data.data.name;
        this.data.topImage = result.data.data.imgUrls[0];
        this.data.lowPrice = result.data.data.lowPrice;
        this.data.highPrice = result.data.data.highPrice;
        this.data.userBuyGoodNum =1;
        if(this.data.lowPrice ==this.data.highPrice){
          this.data.lowPerHightPrice = true;
        }

        this.data.expressFee = result.data.data.expressFee;
        this.data.sellCount = result.data.data.sellCount;
        this.data.description = result.data.data.description;
        this.data.goodChooseSizeArr = result.data.data.specs;
        for(var i=0;i<this.data.goodChooseSizeArr.length;i++){
          var  item = this.data.goodChooseSizeArr[i];
          item.selected = false;
          if(i==0){
            this.data.chooseItemDic = item;
            this.data.chooseItemDic.selected = true;
            this.data.price = item.price;
            this.data.productId = item.productId;
            this.data.boxTotMoney = parseFloat(item.price).toFixed(2);
            // console.log("总金额");
            // console.log(this.data.totMoney);
            this.data.spec = item.value;

          }
        }

        this.setData(this.data);
      }else{
        wx.db.toastError(result.data.msg);
      }
    },
    fail: ()=>{},
    complete: ()=>{}
  });








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
/**
   * 选择商品规格
   */
chooseSize:function(event){

for(let i=0;i<this.data.goodChooseSizeArr.length;i++){
  let itemDic=  this.data.goodChooseSizeArr[i];
  itemDic.selected = false;
}
this.data.goodChooseSizeArr[event.currentTarget.dataset.itemindex].selected = !this.data.goodChooseSizeArr[event.currentTarget.dataset.itemindex].selected;
this.data.chooseItemDic = this.data.goodChooseSizeArr[event.currentTarget.dataset.itemindex];
this.data.productId = this.data.chooseItemDic.productId;
console.log('选中的产品');
console.log(this.data.chooseItemDic);
this.data.price = this.data.chooseItemDic.price;
this.data.spec = this.data.chooseItemDic.value;

this.data.boxTotMoney = parseFloat(this.data.price) * parseFloat(this.data.userBuyGoodNum);
this.data.boxTotMoney = this.data.boxTotMoney.toFixed(2);
this.setData(this.data);
},
/**
   * 弹框减法
   */
buyBoxReduceNum:function(event){
  console.log('buyBoxReduceNum');
  console.log(event);
  // var itemindex = event.currentTarget.dataset.itemindex;

  // var item = this.data.onlineProducts[itemindex];
  if(this.data.userBuyGoodNum<2){
    return;
  }

  this.data.userBuyGoodNum--;
  // console.log("加法计算前金额");
  // console.log(this.data.totMoney);
  this.data.boxTotMoney =parseFloat(this.data.boxTotMoney)- parseFloat(this.data.price);
  // console.log("加法计算金额");
  // console.log(this.data.totMoney);
  // this.data.totMoney = this.data.totMoney.toFixed(2);
  this.setData(this.data);
},
/**
   * 弹框加法
   */
buyBoxAddNum:function(event){
  console.log('buyBoxAddNum');
  console.log(event);


  this.data.userBuyGoodNum++;
  this.data.boxTotMoney =parseFloat(this.data.boxTotMoney)+parseFloat(this.data.price);
  // var itemindex = event.currentTarget.dataset.itemindex;

  // var item = this.data.onlineProducts[itemindex];

  // item.count++;
  // console.log("加法计算前金额");
  // console.log(this.data.totMoney);
  // this.data.totMoney =parseFloat(this.data.totMoney)+ parseFloat(item.price);
  // console.log("加法计算金额");
  // console.log(this.data.totMoney);
  // this.data.totMoney = this.data.totMoney.toFixed(2);
  this.setData(this.data);
// this.data.userBuyGoodNum++;
// this.data.totMoney = 0;
// console.log(this.data.userBuyGoodNum);
// console.log("*");
// console.log(this.data.price);
// console.log("=");

// this.data.totMoney = parseFloat(this.data.userBuyGoodNum)*parseFloat(this.data.price);
// console.log(this.data.totMoney);
// // *
// // this.data.totMoney =this.data.totMoney.toFixed(2);
// console.log("总金额");
//             console.log(this.data.totMoney);
// // this.setData(this.data);
},
/**
   * 加入购物车
   */
goToCar () {

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
      this.getUserShoInfo();
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
/**
   * 商品立即购买
   */
buyShoping:function(){
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
this.data.boxTotMoney =  parseFloat(this.data.boxTotMoney).toFixed(2);
wx.navigateTo({
  url:  `/pages/sureOrder/sureOrder?productListStr=${productListStr}&totMoney=${this.data.boxTotMoney}`
});
},
/**
   * 回首页
   */
goHomeClick:function(){
  wx.switchTab({
    url: '/pages/list/list'
  });
},
/**
   * 回好货
   */
goGoods:function(){
  wx.switchTab({
    url: '/pages/list/list'
  });
}
})