//app.js
App({
  onLaunch: function(e) {
    console.log("进入App");
    console.log(e);




    wx.RiceUserCode = "";
    wx.iCode = "";
    // // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     console.log("微信获取用户信息")
    //     console.log(res);
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })











    wx.db = {};

    wx.RiceUserToken = "";
    wx.isAuth = false;
    wx.headImgUrl = "";
    wx.nickName = "";
    wx.phone = "";
    wx.db.url = (url) => {
      //  return `https://git.taogushen.com/shop/${url}`;
      // return `http://192.168.10.182:18991/${url}`;
      // return `https://shop.zzst.cn/shop/${url}`;
      return `https://jl.drykt.com/shop/${url}`;
      // jl.drykt.com
    };
    this.initToast();

    // wx.db.toastSuccess(e.path)

    const info = wx.getSystemInfoSync();
    console.log(info);

    wx.db.statusBarHeight = info.statusBarHeight;
    wx.db.shopNum = {};
    wx.db.addressArr = [];
    // wx.db.addressArr.push(1);
    // console.log('初始化'+wx.db.addressArr);
    console.log('初始化');

    wx.db.tabBarHeight = info.screenHeight - info.windowHeight;

    if (info.platform == 'android') {
      wx.db.navBarHeight = 48;
      wx.db.platform = 'android';
      wx.db.safeAreaHight = info.screenHeight - wx.db.statusBarHeight;
      wx.db.windowHeight = info.windowHeight;
    } else {
      wx.db.navBarHeight = 44;
      let safeAreaDic = info.safeArea;
      wx.db.platform = 'iOS';

      wx.db.safeAreaHight = safeAreaDic.height;
      wx.db.windowHeight = info.windowHeight;
    }
    wx.db.screenHeight = info.screenHeight;
  },
  initToast: function() {
    const toastTypeNormal = 0;
    const toastTypeSuccess = 1;
    const toastTypeError = 2;
    let commonToast = (title, type, duration = 1500) => {
      let options = {
        title: title,
        icon: 'none',
        duration: duration
      };
      if (type == toastTypeSuccess) {
        options.icon = 'success';
      } else if (type == toastTypeError) {
        options.image = '/assets/imgs/upsdk_cancel_normal.png';
      }
      wx.showToast(options);
    };

    wx.db.toast = (title, duration) => {
      commonToast(title, toastTypeNormal, duration);
    };
    wx.db.toastSuccess = (title, duration) => {
      commonToast(title, toastTypeSuccess, duration);
    };
    wx.db.toastError = (title, duration) => {
      commonToast(title, toastTypeNormal, duration);
    };
  },
  globalData: {
    userInfo: null,
    isAuth: null
  }
})