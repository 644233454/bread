// pages/searchGoods/searchGoods.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // searchDefault:"",
    inputValue:'',
    goodsList:[],
    userTiken:'',
    scrollHight:"0",
    scrollBottom:false,
    page:1,//页码
    pageSize:20,//每页数据
  },
  
  methods: {
    inputSure: function(e) {
      console.log(e);
    }
  },
  bindKeyInput: function (e) {
    console.log(e);
  this.data.inputValue = e.detail.value;
    this.setData({
      inputValue: e.detail.value,
    })
  },
  searchText: function (e) {
    console.log(e);
    this.data.inputValue =e.detail.value;
    this.data.page =1;
    var userToken = wx.RiceUserToken;
    var reqTask = wx.request({
      url: wx.db.url('product/search'),
      data: {
        "queryStr":this.data.inputValue,
        "page":this.data.page,
        "pageSize":this.data.pageSize
      },
      header: {'content-type':'application/x-www-form-urlencoded'},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (result)=>{
        var messageCode = result.data.code;
        console.log('搜索服务器返回数');
        console.log(result);
        if(messageCode ==0){
          this.data.goodsList = result.data.data;
          // var itemStr =  result.data.data[0];
          // itemStr.productName ="我是这的真的泰大大大的想喷配的带劲啊阿斯达传实打实不胜多负少上官婉儿"
          // this.data.goodsList.push(itemStr);
          this.setData(this.data);
        }else{
          wx.db.toastError(result.data.msg);
        }
      },
      fail: ()=>{},
      complete: ()=>{}
    });
    // this.setData({
    //   inputValue: e.detail.value,

    // })
  },
  // searchText:
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.scrollHight = wx.db.windowHeight -40-wx.db.statusBarHeight;
    var userToken = wx.RiceUserToken;
    if(options.searchDefault){
      // this.data.searchDefault = options.searchDefault;
      if(options.searchDefault =="请输入商品名称"){
        this.data.inputValue =""

      }else{
        this.data.inputValue  =options.searchDefault;
      }
      
      console.log("options");
      console.log(options);
      this.setData({
        inputValue:this.data.inputValue
      });
      // if(this.data.inputValue){
      //   this.getItemList();
      // }else{
      //   this.getRecommendItemList();
      // }
    }else{
      // this.getRecommendItemList();
    }
    this.data.page =1;
    this.getItemList();
  },
  getItemList:function(){
    console.log("getItemList");
    var reqTask = wx.request({
      url: wx.db.url('product/search'),
      data: {
        "queryStr":this.data.inputValue,
        "page":this.data.page,
        "pageSize":this.data.pageSize
      },
      header: {'content-type':'application/x-www-form-urlencoded'},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (result)=>{
        var messageCode = result.data.code;
        console.log('搜索服务器返回数');
        console.log(result);
        if(messageCode ==0){
          this.data.goodsList = result.data.data;
          // var itemStr =  result.data.data[0];
          // itemStr.productName ="我是这的真的泰大大大的想喷配的带劲啊阿斯达传实打实不胜多负少上官婉儿"
          // this.data.goodsList.push(itemStr);
          this.setData(this.data);
        }else{
          wx.db.toastError(result.data.msg);
        }
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },
  getRecommendItemList:function(){
    console.log("getRecommendItemList");
    var reqTask = wx.request({
      url: wx.db.url('product/recommendSearch'),
      data: {
        "queryStr":this.data.inputValue
      },
      header: {'content-type':'application/x-www-form-urlencoded',Authorization:`Bearer ${wx.RiceUserToken}`},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (result)=>{
        var messageCode = result.data.code;
        console.log('搜索服务器返回数');
        console.log(result);
        if(messageCode ==0){
          this.data.goodsList = result.data.data;
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
  cancel:function(){
    wx.navigateBack();
  },
  goodDetail:function(event){

    var item =event.currentTarget.dataset.itemindex;

    console.log(event);
    wx.navigateTo({
      url: `/pages/cycleShopDetail/cycleShopDetail?parentId=${item.parentId}&productId=${item.productId}`
    });
  },
  goshopCar:function(even){
  var item =even.currentTarget.dataset.itemindex;
  console.log(item);
    if(item.productType =="PERIOD"){
      wx.navigateTo({
        url: `/pages/cycleShopDetail/cycleShopDetail?parentId=${item.parentId}&productId=${item.productId}`
      });
      return;
    }

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
        
        wx.db.toastSuccess("已添加到购物车");
        
       
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

    console.log("滑动到底部传参 queryStr= "+this.data.inputValue+"page ="+this.data.page+"pageSize="+this.data.pageSize);

    var reqTask = wx.request({
      url: wx.db.url('product/search'),
      data: {
        "queryStr":this.data.inputValue,
        "page":this.data.page,
        "pageSize":this.data.pageSize
      },
      header: {'content-type':'application/x-www-form-urlencoded'},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (result)=>{
        var messageCode = result.data.code;
        console.log('搜索服务器返回数');
        console.log(result);
        if(messageCode ==0){
          console.log('添加前的数据');
          console.log(this.data.goodsList);
          console.log('请求的数据');
          console.log(result.data.data);

          this.data.goodsList =this.data.goodsList.concat(result.data.data);

          console.log('添加后的数据');
          console.log(this.data.goodsList);



          // var itemStr =  result.data.data[0];
          // itemStr.productName ="我是这的真的泰大大大的想喷配的带劲啊阿斯达传实打实不胜多负少上官婉儿"
          // this.data.goodsList.push(itemStr);

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
  searchToupper:function(e){
    console.log('滑动到searchToupper');
    console.log(e);

  }

})