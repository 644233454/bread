// pages/goodDetail/goodDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
    isFromCar:false,
    commentList:[],//评论数据
    showCommentList:[],//显示评论数据
    roleId:"",//用户角色
    goodCommentItem:"",//好评


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

    inviteType: "", //邀请类型
    inviteCode: "", //邀请码

    bannerUrls:[],//滚动图片

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



    this.data.parentId = options.parentId;
    this.data.roleId = wx.roleId;
    if(options.productId){
      this.data.productId = options.productId;
    }
    if(options.isFromCar){
      this.data.isFromCar = options.isFromCar;
    }

    
    // this.data.scrollHight = wx.db.windowHeight -50-wx.db.statusBarHeight;


    // if( wx.db.platform =='android'){
    //  console.log("android");
    //  this.data.scrollHight = wx.db.safeAreaHight -wx.db.navBarHeight-50;
    // }else{
    //   console.log("ios");
      this.data.scrollHight = wx.db.safeAreaHight -wx.db.navBarHeight-50;
    // }
    

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
        productId:options.parentId
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
          this.data.bannerUrls = result.data.data.imgUrls;
          this.data.lowPrice = result.data.data.lowPrice;
          this.data.highPrice = result.data.data.highPrice;

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

            if(this.data.productId){
              if(this.data.productId ==item.productId){
                this.data.chooseItemDic = item;
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
                this.data.chooseItemDic = item;
                this.data.chooseItemDic.selected = true;
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
        }else{
          wx.db.toastError(result.data.msg);
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
  showBuyModal () {
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
//加入购物车
goToCar () {

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
  }
  this.data.goodChooseSizeArr[event.currentTarget.dataset.itemindex].selected = !this.data.goodChooseSizeArr[event.currentTarget.dataset.itemindex].selected;
  this.data.chooseItemDic = this.data.goodChooseSizeArr[event.currentTarget.dataset.itemindex];
  this.data.productId = this.data.chooseItemDic.productId;
  console.log('选中的产品');
  console.log(this.data.chooseItemDic);
  this.data.price = this.data.chooseItemDic.price;
  this.data.totMoney = this.data.userBuyGoodNum*this.data.price;
  this.data.spec = this.data.chooseItemDic.value;
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
  console.log("传过去的商品详情");
  var orderDic ={
    "productId":this.data.productId,
    "count":this.data.userBuyGoodNum,
    "imgUrl":this.data.chooseItemDic.imgUrl,
    "name":this.data.name,
    "price":this.data.price,
    "spec":this.data.spec,
    "isFromCar":this.data.isFromCar
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
  /**
   * 全部评价
   */
allCommentClick:function(){
  wx.navigateTo({
    url: `/pages/allCommentList/allCommentList?parentId=${this.data.parentId}`
    
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
    })
  },

  /**
   * 生成海报商品弹框
   * 内容部分 长按事件
   */
  v_DialogTwoContent_lonePress: function() {
    console.log("生成海报商品 长按图片保存至相册");
    this.savePicToAlbum();
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
                DialogData: this.data.DialogData
              })
            } else if (type == 2) {
              //生成商品海报
              this.setData({
                // sheetDialogHidden: true,
                DialogTwoHidden: false,
                DialogxcxmUrl: this.getBase64ImageUrl(result.data.data),
                DialogData: this.data.DialogData
              })
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
  // testClick:function(){
  //   console.log("ceshi");
  // }
})