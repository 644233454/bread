// cmps/userLoginAlert/userLoginAlert.js
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
    getUserInfo:function(event){
      console.log('确定');
      console.log(event);

      if(event.detail.userInfo){
        wx.headImgUrl = event.detail.userInfo.avatarUrl;
        wx.nickName =event.detail.userInfo.nickName;
        // wx.login({
        //   timeout:10000,
        //   success: (result)=>{
        //     console.log("微信拿code");
        //     console.log(result);
        //     console.log("用户token");
        //     console.log(wx.RiceUserToken);
        //     var userCOde = result.code;

        //     // console.log();
            

            
            
        //   },
        //   fail: ()=>{},
        //   complete: ()=>{}
        // });

        
        
        var reqTask = wx.request({
          url: wx.db.url('user/auth'),
          data: {
            code:wx.code,
            encryptedData:event.detail.encryptedData,
            iv:event.detail.iv,
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            Authorization: `Bearer ${wx.RiceUserToken}`
          },
          method: 'POST',
          responseType: 'text',
          success: (result)=>{
            
            
            var messageCode = result.data.code;
            if(messageCode ==0 ){
              console.log("登录成功");
              this.triggerEvent('hided');
              wx.db.toastSuccess("授权成功");
              wx.isAuth =true;
              wx.nickName =event.detail.userInfo.nickName;
              wx.headImgUrl = event.detail.userInfo.avatarUrl;
            }else{
              wx.db.toastError(result.data.msg);
            }
          },
          fail: ()=>{
            wx.db.toastError(result);
          },
          complete: ()=>{}
        });

        

        





      }

     
     
    },
    cancelBtn:function(){
      console.log('取消');
      this.triggerEvent('hide');
    },
    hideView:function(){
      this.triggerEvent('hided');
      console.log("隐藏");
    }
  },
  getUserInfo: function(e) {
    console.log("获取微信用户信息");
    console.log(e);
  },
  getUserInfo:function(){
    console.log("获取微信用户信息");
   
  }
})
