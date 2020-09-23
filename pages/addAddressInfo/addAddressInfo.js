// pages/addAddressInfo/addAddressInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

    changeAddressTip:false,
    addrId:"",
    title:"",
    detailValue:"",
    district:"",
    city:"",
    province:"",
    cityInfo:"",
    tel:"",
    name:"",
    switchChecked:"",
    switchCheckedTrueOrFalse:false,
    region: ['浙江省', '杭州市', '西湖区'],
    btnClick:false,
    platform:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('初始化 是否选中');
    console.log(options.switchChecked);
    this.data.btnClick = false;
    var info = wx.getSystemInfoSync();
    this.data.platform = info.platform;




    this.setData({
      title: options.title,
      name: options.name,
      tel: options.tel,
      city: options.city,
      province: options.province,
      district: options.district,
      detailValue: options.detailValue,
      switchCheckedTrueOrFalse: options.switchChecked == 'true',
      changeAddressTip: options.changeAddressTip,
      addrId: options.addrId,
      cityInfo: options.province + options.city + options.district,
      fromType: options.fromType,
      platform:this.data.platform,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function() {

  // },
  bindTextAreaBlur: function(e) {
    console.log('详细地址');
    console.log(e);
    this.data.detailValue = e.detail.value;
    this.setData(this.data);
  },
  bindRegionChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.data.province = e.detail.value[0];
    this.data.city = e.detail.value[1];
    this.data.district = e.detail.value[2];
    this.data.cityInfo = e.detail.value[0] + e.detail.value[1] + e.detail.value[2];
    this.setData(this.data);
  },
  sureBtn: function() {

    if(this.data.btnClick ==true){
      return;
    }
    this.data.btnClick = true;
    // wx.db.addressArr 
    if (!this.data.name) {
      wx.db.toastError('请输入姓名');
      return;
    }
    if (!this.data.tel) {
      wx.db.toastError('请输入手机号码');
      return;
    }
    if (this.data.tel.length < 11) {
      wx.db.toastError('请核实手机号码');
      return;
    }
    if (!this.data.city) {
      wx.db.toastError('请选择地区');
      return;
    }

    console.log("详细地址");
    console.log(this.data.detailValue);
    if (!this.data.detailValue) {
      wx.db.toastError('请输入详细地址');
      return;
    }

    var userToken = wx.RiceUserToken;
    if (this.data.changeAddressTip) {
      console.log('修改地址');
      var reqTask = wx.request({
        url: wx.db.url('addr/update'),
        data: {
          "userName": this.data.name,
          "phone": this.data.tel,
          "province": this.data.province,
          "city": this.data.city,
          "district": this.data.district,
          "detail": this.data.detailValue,
          "addrId": this.data.addrId,
          "isDefault": this.data.switchCheckedTrueOrFalse
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${userToken}`
        },
        method: 'POST',
        responseType: 'text',
        success: (result) => {
          this.data.btnClick = false;
          console.log('修改地址返回数据');
          console.log(result);
          var messageCode = result.data.code;
          if (messageCode == 0) {


            var userAddressDic = {
              "realName": this.data.name,
              "phone": this.data.tel,
              "province": this.data.province,
              "city": this.data.city,
              "district": this.data.district,
              "detail": this.data.detailValue,
              "addrId": this.data.addrId,
              "isDefault": this.data.switchCheckedTrueOrFalse
            }
            console.log('存入本地地址');
            console.log(userAddressDic);
            wx.setStorageSync(
              "RiceUserSelectedAddressInfo", userAddressDic

            );
            var reSetAddressInfo = wx.getStorageSync('RiceUserSelectedAddressInfo');
            console.log('读取本地地址');
            console.log(reSetAddressInfo);


            wx.setStorageSync(
              "RiceUserAddrId", this.data.addrId
            );

            if (this.data.fromType == "zqg_detail") {
              console.log("返回周期够详情");
              wx.setStorageSync(
                "AlterZQGaddressInfo", userAddressDic
              );
            }
            wx.navigateBack({
              delta: 2
            });
          }else{
            wx.db.toastError(result.data.msg);
          }

        },
        fail: (result) => {
          this.data.btnClick = false;
          // wx.db.toastError(result.msg);
        },
        complete: () => {}
      });



    } else {
      console.log('新增地址 是否默认');
      console.log(this.data.switchCheckedTrueOrFalse);

      var reqTask = wx.request({
        url: wx.db.url('addr/add'),
        data: {
          "userName": this.data.name,
          "phone": this.data.tel,
          "province": this.data.province,
          "city": this.data.city,
          "district": this.data.district,
          "detail": this.data.detailValue,
          "isDefault": this.data.switchCheckedTrueOrFalse
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${userToken}`
        },
        method: 'POST',
        responseType: 'text',
        success: (result) => {
          
          console.log('添加地址返回数据');
          console.log(result);
          var messageCode = result.data.code;
          if (messageCode == 0) {

            var userDefaultAddress = {
              "realName": this.data.name,
              "phone": this.data.tel,
              "province": this.data.province,
              "city": this.data.city,
              "district": this.data.district,
              "detail": this.data.detailValue,
              "addrId": result.data.data,
              "isDefault": this.data.switchCheckedTrueOrFalse
            };
            wx.db.toastError("地址添加成功");
            wx.setStorageSync(
              "RiceUserSelectedAddressInfo", userDefaultAddress

            );

            if (this.data.switchCheckedTrueOrFalse == true) {
              wx.setStorageSync(
                "RiceUserReSetAddressInfo", "true"
              );
            }

            wx.setStorageSync(
              "RiceUserAddrId", result.data.data
            );

            if (this.data.fromType == "zqg_detail") {
              console.log("返回周期够详情");
              wx.setStorageSync(
                "AlterZQGaddressInfo", userDefaultAddress
              );
            }
            
            wx.navigateBack({
              delta: 2,
            });
            
            
          }else{
            wx.db.toastError(result.data.msg);
          }
        },
        fail: () => {
         
        },
        complete: () => {}
      });



    }




  },
  nameInput: function(e) {
    console.log(e);
    this.data.name = e.detail.value;
  },
  telInput: function(e) {
    this.data.tel = e.detail.value;
  },
  detailInput: function(e) {
    console.log("编辑detailInput");
    console.log(e);
    this.data.detailValue = e.detail.value;
    console.log("详细地址");
    console.log(this.data.detailValue);
  },
  changeSwitch: function(index) {
    console.log('选择');
    console.log(index);
    this.data.switchCheckedTrueOrFalse = index.detail.value;
  },
  /** 
   * 删除收货地址
   */
  deteleBtn: function() {
    var userToken = wx.RiceUserToken;
    var reqTask = wx.request({
      url: wx.db.url('addr/delete'),
      data: {
        "addrId": this.data.addrId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${userToken}`
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: (result) => {
        var messageCode = result.data.code;
        if (messageCode == 0) {
          var selectedItemStr = wx.getStorageSync('RiceUserAddrId');
          if (selectedItemStr == this.data.addrId) {
            console.log('删除本地地址');
            wx.setStorage({
              key: 'RiceUserSelectedAddressInfo',
              data: ''
            });
          }
          wx.navigateBack();


        } else {
          wx.db.toastError(result.data.msg)
        }
      },
      fail: () => {},
      complete: () => {}
    });
  }

})