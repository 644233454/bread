// pages/addAddress/addAddress.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userAddress:[
      
    ],
    haveAddress:false,
    seletedIndex:0,
    seletedAddId:0,
    goEditAddress:false,
    scrollHight:"0",
    userAddId:"",
    fromType:"",//来源


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {



    if(options.userAddId){
      this.data.userAddId = options.userAddId;
    }
    if(options.fromType){
      this.data.fromType = options.fromType;
    }

    
    // this.data.userAddress = [];
    // var userAddressStr = wx.getStorageSync("key");

    // var userAddress = JSON.parse(userAddressStr);
    
    // if(userAddressStr)
    // {
    //   this.data.haveAddress =true;
    //   this.data.userAddress.push(userAddress);
    //     var buyNum =this.data.userAddress[0];
    //     buyNum.selected = true;
    // }
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

    

    if(this.data.goEditAddress){


      console.log('选中的地址ID goEditAddress =true');
      console.log(this.data.seletedAddId);
      var userToken =wx.RiceUserToken;
      var reqTask = wx.request({
      url: wx.db.url('addr/addrs'),
      data: {},
      header: {'content-type':'application/json',Authorization:`Bearer ${userToken}`},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (result)=>{
        console.log('请求用户地址');
        console.log(result);
        if(result.data.data){
          this.data.userAddress = result.data.data;
          if(this.data.userAddress.length==0){
            console.log('删除本地地址');
              wx.setStorage({
                key: 'RiceUserSelectedAddressInfo',
                data: ''
              });
          }
        } 
       


        for(var i=0;i<this.data.userAddress.length;i++){
          var item = this.data.userAddress[i];
          if(item.addrId==this.data.seletedAddId){
              item.selected = true;
              this.data.seletedAddId = i;
          }else{
            item.selected = false;
          }
        }
        this.setData(this.data);
      },
      fail: ()=>{},
      complete: ()=>{}
    });
    }else{
      var userToken =wx.RiceUserToken;
      var reqTask = wx.request({
      url: wx.db.url('addr/addrs'),
      data: {},
      header: {'content-type':'application/json',Authorization:`Bearer ${userToken}`},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (result)=>{
        console.log('请求用户地址');
        console.log(result);
        if(result.data.data){

          this.data.userAddress = result.data.data;
          var  selectedItemStr = wx.getStorageSync('RiceUserAddrId');
          console.log("获取本地存储地址ID");
          console.log(selectedItemStr);

          if(this.data.userAddress.length==0){
            console.log('删除本地地址');
              wx.setStorage({
                key: 'RiceUserSelectedAddressInfo',
                data: ''
              });
          }
        }
        
        for(var i=0;i<this.data.userAddress.length;i++){
          var item = this.data.userAddress[i];
          
          

          if(selectedItemStr){
            console.log("进入本地地址逻辑");
           
            var selectedItem = parseInt(selectedItemStr);
            if(this.data.userAddId){

              if(this.data.userAddId ==item.addrId){
                item.selected = true;
                this.data.seletedAddId = i;
              }else{
                item.selected = false;
              }
            
          }else{
            if(item.isDefault){
              item.selected = true;
              this.data.seletedAddId = i;
          }else{
            item.selected = false;
          }
          }
        }

          
        }
        this.data.scrollHight = wx.db.windowHeight -50-wx.db.statusBarHeight - wx.db.navBarHeight;
        this.setData(this.data);
      },
      fail: ()=>{},
      complete: ()=>{}
    });
    }
    console.log('选中'+this.data.seletedAddId);
    
    // var userAddressStr = wx.getStorageSync("key");

    // var userAddress = JSON.parse(userAddressStr);
   
    // if(userAddressStr)
    // {
    //   this.data.haveAddress =true;
    //   this.data.userAddress.push(userAddress);
    // }

    // this.setData(this.data);
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
  addAddressBtn:function(){
    wx.navigateTo({
      url: '/pages/addAddressInfo/addAddressInfo?title=新增收货地址&fromType='+this.data.fromType,
    });
  },
  editItemClick:function(e){

    this.data.goEditAddress = true;

    for ( let i = 0; i < this.data.userAddress.length; i++){
      var buyNum =this.data.userAddress[i];
      buyNum.selected = false;
    }
    var buyNum =this.data.userAddress[e.currentTarget.dataset.itemindex];
    buyNum.selected = true;
    
    wx.navigateTo({
      url: `/pages/addAddressInfo/addAddressInfo?name=${buyNum.realName}&changeAddressTip=true&switchChecked=${buyNum.isDefault}&tel=${buyNum.phone}&province=${buyNum.province}&city=${buyNum.city}&district=${buyNum.district}&detailValue=${buyNum.detail}&title=修改收货地址&addrId=${buyNum.addrId}&fromType=${this.data.fromType}`
    });
    // addrId
  },
  itemClick:function(e){
    for ( let i = 0; i < this.data.userAddress.length; i++){
      var buyNum =this.data.userAddress[i];
      buyNum.selected = false;
    }
    var buyNum =this.data.userAddress[e.currentTarget.dataset.itemindex];
    buyNum.selected = true;
    this.data.seletedAddId = buyNum.addrId;
    console.log('选中的地址');
    console.log(buyNum);
   
    this.setData(this.data);
    wx.setStorageSync(
      "RiceUserSelectedAddressInfo",buyNum
    );
    wx.setStorageSync(
      "RiceUserAddrId",buyNum.addrId
    );
    
    console.log("本地存储地址ID");
    console.log(buyNum.addrId);
      if(this.data.fromType =="shop"){
        console.log("返回购物");
        wx.navigateBack({
          delta: 1
        });
      } else if (this.data.fromType == "zqg_detail"){
        console.log("返回周期够详情");
        wx.setStorageSync(
          "AlterZQGaddressInfo", buyNum
        );
        wx.navigateBack({
          delta: 1
        });
      }

    // "RiceUserAddrId",buyNum.addrId
    
    // wx.setStorageSync({
    //   key:'RiceUserDefaultAddressInfo',
    //   key:'RiceUserAddrId',
    //   data:JSON.stringify(buyNum),
    //   data:String(buyNum.addrId)
    // })



   
  }
})