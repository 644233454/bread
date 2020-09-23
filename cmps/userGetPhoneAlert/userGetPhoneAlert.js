//userGetPhoneAlert
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    text:{
      type:String,
      value:''
    }
  },
  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    getPhoneNumber:function(event){
      console.log('授权');
      console.log(event);
      console.log("wx.code");
      console.log(wx.code);
      if(event.detail.encryptedData){
        var reqTask = wx.request({
          url: wx.db.url('/user/getPhone'),
          data: {
            code:wx.code,
            encryptedData:event.detail.encryptedData,
            iv:event.detail.iv,
          },
          header: {'content-type':'application/x-www-form-urlencoded',
                    Authorization:`Bearer ${wx.RiceUserToken}`},
          method: 'POST',
          responseType: 'text',
          success: (result)=>{
            
            
            var messageCode = result.data.code;
            if(messageCode ==0 ){
              console.log("授权成功");
              console.log(result);
              // this.triggerEvent('hide');
              wx.phone = result.data.data;
              // wx.db.toastSuccess("登陆成功");
              // wx.isAuth =true;
              // wx.nickName =event.detail.userInfo.nickName;
              // wx.headImgUrl = event.detail.userInfo.avatarUrl;
            }else{
              wx.db.toastError(result.data.msg);
            }
          },
          fail: ()=>{},
          complete: ()=>{
            this.triggerEvent('hide');
          }
        });
        // wx.headImgUrl = event.detail.userInfo.avatarUrl;
        // wx.nickName =event.detail.userInfo.nickName;
        // wx.login({
        //   timeout:10000,
        //   success: (result)=>{
        //     console.log("微信拿code");
        //     console.log(result);
        //     console.log("用户token");
        //     console.log(wx.RiceUserToken);
        //     var userCOde = result.code;

            
        //   },
        //   fail: ()=>{},
        //   complete: ()=>{}
        // });
      }
    },
    cancelBtn:function(){
      console.log(' userGetPhoneAlert 取消');
      this.triggerEvent('hide');
    },
    hideView:function(){
      this.triggerEvent('hide');
      console.log(" userGetPhoneAlert 隐藏");
    }
  },
  getUserInfo: function(e) {
    console.log("获取微信用户信息");
    console.log(e);
  }
})
