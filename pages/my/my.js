// pages/my/my.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    roleId: "",
    userCode: "",
    userInfo: {},
    nickName: "",
    userToken: "",
    headImgUrl: "",
    selectedTitleIndex: 0,
    userPhoneStatus:"",
    customerPhone:"",
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    orderItem: [{
        title: '待付款',
        image: '/assets/imgs/waitPayImage.png'
      },
      {
        title: '待发货',
        image: '/assets/imgs/waitSendImage.png'
      },
      {
        title: '待收货',
        image: '/assets/imgs/waitAcceptImage.png'
      },
      {
        title: '待评价',
        image: '/assets/imgs/waitEvaluate.png'
      }
    ],
    tipNumberList: [

    ],
    items: [
      // {
      //   title:'分销中心',
      //   image:'/assets/imgs/myDistribution.png'
      // },
      // {
      //   title:'收货地址',
      //   image:'/assets/imgs/myAddress.png'
      // },
      // {
      //   title:'在线客服',
      //   image:'/assets/imgs/myServe.png'
      // },
      // {
      //   title:'联系商家',
      //   image:'/assets/imgs/myTel.png'
      // }
    ],
    isAuth: false //是否认证
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("我的 onLoad")
    console.log(wx.isAuth, wx.RiceUserToken, wx.userInfo, wx.nickName, wx.headImgUrl)
    console.log('邀请码 wx.iCode =')
    console.log(wx.iCode)

    
    // this.setData(this.data);
    //   // 登录ß
    // wx.login({
    //   success: res => {
    //     console.log("获取微信服务器的userCode")
    //     console.log(res);
    //     this.data.userCode = res.code;
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //   }
    // })
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





    this.data.isAuth = wx.isAuth;

    if(this.data.isAuth ==false){
      wx.login({
        success: res => {
          console.log("获取userCode")
          console.log(res);
          this.data.userCode = res.code;
        }
      })
    }
    this.data.userToken = wx.RiceUserToken;
    this.data.nickName = wx.nickName;
    this.data.headImgUrl = wx.headImgUrl;
    console.log('授权信息')
    console.log(this.data.isAuth);
    console.log(this.data.nickName);
    console.log(this.data.headImgUrl);

    this.setData({
      isAuth:this.data.isAuth,
      nickName:this.data.nickName,
      headImgUrl:this.data.headImgUrl
    })

    var userToken = wx.RiceUserToken;
    var reqTask = wx.request({
      url: wx.db.url('user/info'),
      data: {},
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${userToken}`
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (result) => {
        console.log('用户中心请求数据')
        console.log(result)
        var messageCode = result.data.code;
        if (messageCode == 0) {
          this.data.roleId = result.data.data.roleId;
          wx.roleId = result.data.data.roleId;

          console.log("全局角色id");
          console.log(wx.roleId);
          this.setData(this.data);
        }
      },
      fail: () => {},
      complete: () => {}
    });
    var reqTask = wx.request({
      url: wx.db.url('order/orderStat'),
      data: {},
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${wx.RiceUserToken}`
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (result) => {
        console.log('用户中心统计订单数量')
        console.log(result)
        var messageCode = result.data.code;
        if (messageCode == 0) {
          this.data.tipNumberList = [];
          this.data.tipNumberList.push(result.data.data.toPayCount);
          this.data.tipNumberList.push(result.data.data.toDeliverCount);
          this.data.tipNumberList.push(result.data.data.deliverCount);
          this.data.tipNumberList.push(result.data.data.toCommentCount);
          this.setData(this.data);
        }
      },
      fail: () => {},
      complete: () => {}
    });
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
  orderListClick: function() {

    // var 
    console.log('我是顶部');
    this.data.selectedTitleIndex = 0;
    wx.navigateTo({
      url: `/pages/myOrderList/myOrderList?selectedTitleIndex=${this.data.selectedTitleIndex}`
    });
  },
  getUserInfo: function(e) {


    if (e.detail.userInfo) {


      console.log("点击允许")
      console.log(e.detail.userInfo)
      app.globalData.userInfo = e.detail.userInfo


      

      var reqTask = wx.request({
        url: wx.db.url('user/auth'),
        data: {
          code: this.data.userCode,
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv,
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${wx.RiceUserToken}`
        },
        method: 'POST',
        responseType: 'text',
        success: (result) => {
          console.log('授权成功')
          console.log(result)
          console.log(result.data)
          var messageCode = result.data.code;
          if (messageCode == 0) {

            wx.isAuth = true;
            wx.nickName = e.detail.userInfo.nickName;
            wx.headImgUrl =  e.detail.userInfo.avatarUrl;

            this.data.nickName =wx.nickName;
            this.data.headImgUrl =wx.headImgUrl;
            this.data.isAuth =  wx.isAuth;

            if(!wx.phone){


              wx.login({
                timeout:10000,
                success: (result)=>{
                  
                  wx.code = result.code;
                },
                fail: ()=>{},
                complete: ()=>{}
              });

              this.data.userPhoneStatus = true;
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
                   animationData: animation.export(),  // export 方法每次调用后会清掉之前的动画操作。
                   userPhoneStatus:true
                 })
                 console.log(this)
            }, 200)
            }else{
              this.data.userPhoneStatus = false;
            }
            this.setData(this.data);
          } else {
            wx.db.toastError(result.data.msg);
          }
        },
        fail: () => {
          console.log('注册失败')
          wx.db.toastError(result.data.errMsg);
        },
        complete: () => {

        }
      });
    }
  },
  orderTypeClicl: function(event) {
    var selectedIndx = event.currentTarget.dataset.itemindex;
    this.data.selectedTitleIndex = selectedIndx + 1;
    console.log('选择的数据');
    console.log(selectedIndx);
    wx.navigateTo({
      url: `/pages/myOrderList/myOrderList?selectedTitleIndex=${this.data.selectedTitleIndex}`
    });

  },
  itemClick: function(e) {
    console.log('点击')
    var selectedIndx = e.currentTarget.dataset.itemindex;
    console.log(e)
    console.log(selectedIndx)
    if (selectedIndx == 0) {
      if (wx.roleId == 1) {
        wx.db.toastError("申请成为分销商");
      } else {
        wx.navigateTo({
          url: "../fxs/tab_mine/tab_mine"
        });
      }

    }
    if (selectedIndx == 1) {
      wx.navigateTo({
        url: `/pages/fxs/lipinjuan_list/lipinjuan_list`
        // url: `/pages/fxs/lipinjuan_get/lipinjuan_get`
      });
    }
    if (selectedIndx == 2) {
      wx.navigateTo({
        url: "/pages/fxs/zqg/zqg"
       // url: "/pages/fxs/zqg/zqg?couponCode=2020041700003"
      });
    }
    if (selectedIndx == 3) {
      wx.navigateTo({
        url: `/pages/addAddress/addAddress`
      });
    }
    if (selectedIndx == 4) {
      wx.makePhoneCall({
        phoneNumber:'18167166798',
        success: (result) => {

        },
        fail: () => {},
        complete: () => {}
      });
    }
  },
  /**
   * 
   * 关闭获取电话号码弹框
   */
  phoneHideClick: function(e) {
    console.log("我是父类 删除");
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