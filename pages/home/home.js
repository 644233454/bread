// pages/list/list.js
var log = require('../../cmps/log.js') // 引用上面的log.js文件
Page({
  data: {
    topNum: 0,
    step:[
      {
        title:"买家付款",
        selected:"1"
      },
      {
        title:"商家发货",
        selected:"1"
      },
      {title:"交易完成",
      selected:"0"

      },
    ],
    isShowSearch:false,
    userHeadImage:"",
    userNickName:"",
    searchDefault:"",
    productsInfo: [],
    activityImgUrl:"",
    activeArr:[
    ],
    btnArr:[
      {
        title:"111",
        picUrl:"",
        clickUrl:""
      },
      {
        title:"222",
        picture:"",
        clickUrl:""
      },
      {
        title:"333",
        picture:"",
        clickUrl:""
      },
      {
        title:"444",
        picture:"",
        clickUrl:""
      },
      // {
      //   title:"444",
      //   picture:"",
      //   clickUrl:""
      // },
      // {
      //   title:"444",
      //   picture:"",
      //   clickUrl:""
      // },
      // TODO ceshi
    ],
    activityArr:[],
    PeriodicArr:[],
    GroupArr:[],
    scrollHight: "0",
    // topHeight:"0",
    showModalStatus: false, //状态
    showGetUserPhone: false, //是否显示获取手机号码
    roleId: "", //用户角色
    sheetDialogHidden: "", //分享界面

    //==============================================底部弹框
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
    DialogxcxmUrl: "",
    DialogData: {},
    DialogInviteCode: "",

    DialogxcxmUrlBase64Path: "",
    DialogxcxmUrlBase64:"",
    rpx: 1,

    showTestView: false,
    iCode: "",
    iT: "",
    orgOrderId:"",
    scene:"",//二维码信息
    pId:"",
    bannerUrls:[],//滚动图片
    
    indicatorDots: true,

    alreayLoginHttp:false,//

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
  onLoad: function(options) {
    console.log('初始化首页options')

    // var test ='aaa=111&bbb=222&ccc=333'
    // var testArr = test.split("&");
    // var dic = new Array();
    // for(var i=0;i<testArr.length;i++){
    //    var itemStr= testArr[i];
    //    var itemArr = itemStr.split("=");
    //    dic[itemArr[0]] = itemArr[1];
    // }
    // console.log("dic");
    // console.log(dic);
    // console.log(dic.aaa);









    
    
    
    console.log(wx.db.windowHeight)
    console.log(wx.db.navBarHeight)
    console.log(wx.db.statusBarHeight)
    
    this.data.scrollHight = wx.db.windowHeight -wx.db.navBarHeight-wx.db.statusBarHeight;
    
    console.log(this.data.scrollHight)

    

    this.data.scene = decodeURIComponent(options.scene);

    
    this.data.scene = unescape(this.data.scene);

    if(options.scene){
//二维码分享进来

      log.info('二维码分享进来')
      log.info("传入参数");
      log.info(options);

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
 
      log.info("分享链接");
      log.info("传入参数");
      log.info(options);

      console.log("分享链接进来");
      console.log("传入参数");
      console.log(options);

      this.data.iCode = options.iCode?options.iCode:"";

      this.data.iT  = options.iT?options.iT:"";
      
     
      this.data.orgOrderId = options.orgOrderId?options.orgOrderId:"";
      this.data.pId = options.pId?options.pId:"";
      
    }
    
    wx.iCode = this.data.iCode;
    wx.iT =  this.data.iT;
    wx.orgOrderId = this.data.orgOrderId;
    wx.login({
      timeout: 10000,
      success: (result) => {
        

        wx.setStorageSync('RiceUserCode', result.code);

        
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
              log.info("this.data.pId");
              log.info(this.data.pId);
                console.log('this.data.pId');
                console.log(this.data.pId);
                console.log('跳转到goodDetail');
                log.info("跳转到goodDetail");
                wx.navigateTo({
                  url: `/pages/fxs/lipinjuan_get/lipinjuan_get`
                });
              }else{
                
                if(this.data.iT==1){
                   
                   //邀请好友
                   console.log('this.data.iT');
                   console.log(this.data.iT);
                   console.log('跳转到tab_mine');
                   log.info("跳转到tab_mine");
                     wx.switchTab({
                       url: '/pages/fxs/tab_mine/tab_mine'
                     });
                  }else{
                    if(this.data.pId>0){
                      //分享单个产品
                      log.info("this.data.pId");
                       log.info(this.data.pId);
                       console.log('this.data.pId');
                       console.log(this.data.pId);
                       console.log('跳转到goodDetail');
                       log.info("跳转到goodDetail");
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

    // 动态的获取状态栏+导航栏的高度
    this.data.topHeight = wx.db.statusBarHeight + wx.db.navBarHeight;
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#42BD55'
    });
    console.log("首页加载完毕");

    this.setData(this.data);

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
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.data.roleId=  wx.roleId;
    this.data.scrollHight = wx.db.windowHeight -wx.db.navBarHeight-wx.db.statusBarHeight;
    if(wx.headImgUrl){
      this.data.userHeadImage = wx.headImgUrl;
      this.data.userNickName = wx.nickName;
    }
   
    if(this.data.alreayLoginHttp == true){
      // if(!wx.phone){
        wx.login({
          timeout:10000,
          success: (result)=>{
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
              success: (result)=>{
                wx.isAuth = result.data.data.isAuth;
                wx.headImgUrl = result.data.data.headImgUrl;
               wx.nickName = result.data.data.nickName;
               wx.RiceUserToken = result.data.data.token;
               wx.userToken = result.data.data.token;
               wx.iCode = result.data.data.inviteCode;
               wx.roleId = result.data.data.roleId;
               this.data.roleId = result.data.data.roleId;
               wx.phone = result.data.data.phone;


               console.log(" onShow result");
               console.log(result);

                console.log("wx.phone");
                console.log(wx.phone);
              },
              fail: ()=>{},
              complete: ()=>{}
            });
          },
          fail: ()=>{},
          complete: ()=>{}
        });
      // }
    }
   
    
    var reqTask = wx.request({
      url: wx.db.url('product/index'),
      data: {},
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (result) => {
        console.log("首页数据");
        console.log(result);
        var messageCode = result.data.code;
        if (messageCode == 0) {
          this.data.productsInfo = result.data.data.productsInfo;
          this.data.bannerUrls = result.data.data.indexHeaderInfo;
          this.data.activityImgUrl = result.data.data.activityImgUrl;
          this.data.isShowSearch = result.data.data.isShowSearch;
          this.data.searchDefault = result.data.data.searchDefault;
          wx.customerPhone = result.data.data.customerPhone;
          // this.data.searchDefault  ="12";
          this.data.activeArr = result.data.data.activityProductsInfo;
          // console.log(this.data.productsInfo[0].imgUrl);
          this.setData(this.data);
        } else {
          wx.db.toastError(result.data.msg);
        }

      },
      fail: (result) => {
        // console.log(result);
        wx.db.toastError(result.errMsg);
      },
      complete: () => {}
    });
  },
  searchGoods: function() {

    

    wx.navigateTo({
      url: `/pages/searchGoods/searchGoods?searchDefault=${this.data.searchDefault}`
    });
  },
  searchGoods: function() {



    wx.navigateTo({
      url: `/pages/searchGoods/searchGoods?searchDefault=${this.data.searchDefault}`
    });
  },
  // 
  bannerClick:function(event){
    console.log("点击banner");
    console.log(event);


    wx.orgOrderId = 35;
    wx.navigateTo({
      url: `/pages/fxs/lipinjuan_get/lipinjuan_get`
    });

    // var item = event.currentTarget.dataset.item;
    // if(item.parentId>0){
    //   wx.navigateTo({
    //     url: `/pages/cycleShopDetail/cycleShopDetail?parentId=${item.parentId}`
    //   });
    // }
  },

  goodDetail: function(event) {
    let itemIndex = event.currentTarget.dataset.itemindex;
    var item = this.data.productsInfo[itemIndex];
    console.log('点击了');
    console.log(event);
    if(item.parentId>0)
    wx.navigateTo({
      url: `/pages/cycleShopDetail/cycleShopDetail?parentId=${item.parentId}`
    });
  },
  activeItemClick:function(event){
    console.log(event);
    let item = event.currentTarget.dataset.item;
    if(item.parentId>0)
    wx.navigateTo({
      // url: `/pages/cycleShopDetail/cycleShopDetail?parentId=${item.parentId}`
      url: `/pages/cycleShopDetail/cycleShopDetail?parentId=${item.parentId}`
    });

  },
  showBuyModal() {
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
        animationData: animation.export() // export 方法每次调用后会清掉之前的动画操作。
      })
      console.log(this)
    }, 200)
  },
  hideClick: function(e) {
    console.log("我是父类 删除");
    console.log(e);

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
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
      console.log(this)
    }.bind(this), 200)
  },

  getUserInfo: function() {
    console.log("getUserInfo")

  },
  shareApp: function() {
    console.log("分享app")
    this.setData({
      sheetDialogHidden: false
    })
  },

  //========================================================底部弹框

  /**
   * 弹出分享框
   */
  v_share: function(e) {
    console.log("弹出分享框");
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
    console.log("阴影点击事件");
    this.setData({
      sheetDialogHidden: true,
    })
  },


  /**
   * 底部弹框
   * 取消按钮
   */
  v_sheetDialogContent_cancel_click: function() {
    console.log("取消按钮");
    this.setData({
      sheetDialogHidden: true,
    })
  },

  /**
   * 底部弹框
   * 小程序码 点击事件
   */
  v_sheetDialogContentOneOne_click: function() {
    console.log("小程序码");
    this.xcxm(1);


  },

  /**
   * 底部弹框
   * 生成商品海报 点击事件
   */
  v_sheetDialogContentOneTwo_click: function() {
    console.log("生成商品海报");
    console.log("v_sheetDialogContentOneTwo_click");
    this.xcxm(2);
    // wx.navigateTo({
    //   // url: wx.db.url('homeInvite/homeInvite')
    //   url: '/pages/homeInvite/homeInvite'
    // });
    // this.setData({
    //   sheetDialogHidden: true,
    // })
  },

  /**
   * 底部弹框
   * 复制链接 点击事件
   */
  v_sheetDialogContentOneThree_click: function() {
    console.log("复制链接");
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
    console.log("小程序码 长按事件");
    this.savePicToAlbum();
  },


  /**
   * 生成海报商品弹框
   * 非内容部分  阴影点击事件
   */
  v_DialogTwo_click: function() {
    console.log("生成海报商品弹框 阴影点击事件");
    this.setData({
      DialogTwoHidden: true,
      DialogxcxmUrl: "",
      DialogxcxmUrlBase64: "",
      DialogxcxmUrlBase64Path: "",
    })
    // const ctx = wx.createCanvasContext("picture");
    // ctx.clearRect(0, 0, 264*rpx, 420*rpx);
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
    DialogxcxmUrlBase64: "",
    DialogxcxmUrlBase64Path: "",
  })
  // const ctx = wx.createCanvasContext("picture");
  // ctx.clearRect(0, 0, 264*rpx, 420*rpx);
},
  /**
   * 生成海报商品弹框
   * 内容部分 长按事件
   */
  v_DialogTwoContent_lonePress: function() {
    console.log("生成海报商品 长按图片保存至相册");
    // this.savePicToAlbum();
    console.log("生成海报商品 长按图片保存至相册");
    //把当前画布指定区域的内容导出生成指定大小的图片。在 draw() 回调里调用该方法才能保证图片导出成功。
    //指定的画布区域的左上角横坐标，指定的画布区域的左上角纵坐标，指定的画布区域的宽度,指定的画布区域的高度，输出的图片的宽度，输出的图片的高度
    let rpx = this.data.rpx;
    let that = this;
    //console.log(rpx);
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 264 * rpx,
      height: 420 * rpx,
      destWidth: 264 * rpx * 3,
      destHeight: 420 * rpx * 3,
      canvasId: 'picture',
      success(res) {
        //临时路径
        //console.log(res.tempFilePath);
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            wx.showToast({
              title: '保存成功',
            })
            that.deleteImage();
            that.setData({
              DialogTwoHidden: true,
              DialogxcxmUrl: "",
              DialogxcxmUrlBase64: "",
              DialogxcxmUrlBase64Path: "",
            });
            // const ctx = wx.createCanvasContext("picture");
            // ctx.clearRect(0, 0, 264*rpx, 420*rpx);
          },
          fail(res) {
            wx.showToast({
              title: '保存失败',
            })
            that.deleteImage();
            that.setData({
              DialogTwoHidden: true,
              DialogxcxmUrl: "",
              DialogxcxmUrlBase64: "",
              DialogxcxmUrlBase64Path: "",
            });
            // const ctx = wx.createCanvasContext("picture");
            // ctx.clearRect(0, 0, 264*rpx, 420*rpx);
          }
        },that);
      },
      fail(res) {
        console.log(res);
        wx.showToast({
          title: '保存失败',
        });
        that.deleteImage();
        that.setData({
          DialogTwoHidden: true,
          DialogxcxmUrl: "",
          DialogxcxmUrlBase64: "",
          DialogxcxmUrlBase64Path: "",
        });
        // const ctx = wx.createCanvasContext("picture");
        // ctx.clearRect(0, 0, 264*rpx, 420*rpx);
      }
    });
  },

//删除本地图片
deleteImage: function () {
  let saveFilePath = this.data.DialogxcxmUrlBase64Path;
  /// 删除写入的数据
  wx.getFileSystemManager().unlink({
    filePath: saveFilePath,
    success: res => {
      console.log('删除成功, 路径: ', saveFilePath);
      // resolve(saveFilePath);
    },
    fail: err => {
      //reject('删除失败：', err);
    }
  })
},
  /**
   * 获取小程序码  base64
   */
  xcxm: function(type) {
    var userToken = wx.RiceUserToken;
    // var pageUrl = "1";
    console.log(userToken)


    wx.showLoading({
      title: "",
      mask: true,
      success: (result) => {

      },
      fail: () => {},
      complete: () => {}
    });
    var reqTask = wx.request({
      url: wx.db.url('promote/product'),
      data: {
        "page": "pages/list/list", //小程序码全部跳转至首页
        "pId": "",
      },
      header: {
        'content-type': 'application/json',
        Authorization: `Bearer ${wx.RiceUserToken}`
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (result) => {
        wx.hideLoading();
        console.log(JSON.stringify(result));
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
                DialogData: this.data.DialogData,
                DialogxcxmUrlBase64: result.data.data,
              })
            } else if (type == 2) {
              //生成商品海报
              this.setData({
                DialogTwoHidden: false,
                DialogxcxmUrl: this.getBase64ImageUrl(result.data.data),
                DialogData: this.data.DialogData,
                DialogxcxmUrlBase64: result.data.data,
              })
              this.drawBg();
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
  //绘制海报
drawBg: function () {
  let that = this;
  wx.getSystemInfo({
    success: function (res) {
      let rpx = res.windowWidth / 375;
      that.setData({
        rpx: rpx,
      });
      const ctx = wx.createCanvasContext("picture");
      //绘制背景
      ctx.setFillStyle('#ffffff');
      ctx.fillRect(0, 0, 264 * rpx, 420 * rpx)
      ctx.draw(true);

      console.log("that.data.userHeadImage");
      console.log(that.data.userHeadImage);
      //绘制产品图片
      wx.getImageInfo({
        src: that.data.userHeadImage,
        success(res) {
          
          ctx.save();
          ctx.beginPath();
          ctx.arc(132 * rpx, 85 * rpx, 45 * rpx, 0, 2 * Math.PI);
          ctx.clip();
          ctx.drawImage(res.path, 87 * rpx, 40 * rpx, 90 * rpx, 90 * rpx);
          ctx.restore();
          ctx.draw(true);
          that.setData({
            showLoading: false,
          });
        },
        fail(res) {
          console.log(res)
          that.setData({
            showLoading: false,
          });
        }
      });

      //绘制产品文字
      //文本，绘制文本的左上角 x 坐标位置，绘制文本的左上角 y 坐标位置
      ctx.setFontSize(15);
      ctx.setFillStyle("#666666");
      ctx.setTextAlign('center');
      let text = that.data.userNickName;

      ctx.fillText(text,132*rpx,170*rpx);

      let text2 =  "快来和我一起加入，推广赢奖励!";

      ctx.fillText(text2,132*rpx,200*rpx,264*rpx);
      
      // let textLength = that.getTextLength(text, ctx);
      // if (264 * rpx > textLength + 20 * rpx) {
      //   ctx.fillText(text, (264 * rpx - ctx.measureText(text).width) / 2, 200 * rpx);
      // } else {
      //   that.drawText(ctx, text, 10 * rpx, 30 * rpx, 148* rpx, 40 * rpx);
      // }

      // let text1 = "快来和我一起加入，推广赢奖励";
      // let textLength1 = that.getTextLength(text1, ctx);
      // if (264 * rpx > textLength1 + 20 * rpx) {
      //   ctx.fillText(text1, (264 * rpx - ctx.measureText(text).width) / 2, 250 * rpx);
      // } else {
      //   that.drawText(ctx, text1, 10 * rpx, 275 * rpx, 148, 250 * rpx);
      // }
    

      //绘制二维码图片
      let promise = new Promise((resolve, reject) => {
        let filePath = `${wx.env.USER_DATA_PATH}/02020202020202`;
        console.log("filePath");
        console.log(filePath);
        that.setData({
          DialogxcxmUrlBase64Path: filePath,
        });
        
        wx.getFileSystemManager().writeFile({
          filePath: filePath,
          data: wx.base64ToArrayBuffer(that.data.DialogxcxmUrlBase64),
          encoding: 'binary',
          success: () => {
            console.log('写入成功, 路径: ', filePath);
            ctx.drawImage(filePath, 82 * rpx, 260 * rpx, 100 * rpx, 100 * rpx);
            ctx.draw(true);
          },
          fail: err => {
            reject('写入失败：', err);
            that.setData({
              showLoading: false,
            });
          },
        });
      })



      //绘制长按识别二维码文字
      ctx.setFontSize(11);
      ctx.setFillStyle("#666666");
      // ctx.fillText("长按识别二维码", (264 * rpx - ctx.measureText("长按识别二维码").width) / 2, 400 * rpx);
      ctx.draw(true);
    },
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
          that.savePhoto()
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
            // const ctx = wx.createCanvasContext("picture");
            // ctx.clearRect(0, 0, 264*rpx, 420*rpx);
          }
        })

      },
      fail: err => {}
    })
  },


  getInveteCode: function() {
    var userToken = wx.RiceUserToken;
    console.log(userToken)
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
    return {
      title: `好货推荐，快来和我一起围观~`,
      path: `/pages/list/list?iCode=${wx.iCode}&iT=0`,
      imageUrl: `` //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径。支持PNG及JPG。显示图片长宽比是 5:4。
    }
  },
  //把base64转换成图片
  getBase64ImageUrl: function(data) {
    /// 获取到base64Data
    var base64Data = data;
    /// 通过微信小程序自带方法将base64转为二进制去除特殊符号，再转回base64
    base64Data = wx.arrayBufferToBase64(wx.base64ToArrayBuffer(base64Data));
    /// 拼接请求头，data格式可以为image/png或者image/jpeg等，看需求
    const base64ImgUrl = "data:image/png;base64," + base64Data;
    console.log("转换后的图片地址" + base64ImgUrl);
    return base64ImgUrl;
  },
  //获取文本长度
  getTextLength: function (str, ctx) {
    var lineWidth = 0;
    console.log("str");
    console.log(str);
    var lastSubStrIndex = 0; //每次开始截取的字符串的索引
    for (let i = 0; i < str.length; i++) {
      lineWidth += ctx.measureText(str[i]).width;
    }
    return lineWidth;
  },
  /**
   * 去购物车
   * 
   */
  goToShop: function() {
    console.log('去购物车');
    wx.switchTab({
      url: '/pages/shoping/shoping'
    });
  },
  //回到顶部
  toTopClick:function(){

    // if (wx.pageScrollTo) {   

    //   wx.pageScrollTo({
    //     scrollTop:0
    //   })
    // }else{
      console.log('topNum');
      this.setData({  
        topNum: this.data.topNum = 0
      });
    // }
  },
  homeScroll: function (e) { 
    // console.log("e.detail.scrollTop");
    // console.log(e.detail.scrollTop);
    this.data.topNum = e.detail.scrollTop;
  },
  //文本换行 参数：1、canvas对象，2、文本 3、距离左侧的距离 4、距离顶部的距离 5、6、文本的宽度
  drawText: function (ctx, str, leftWidth, initHeight, titleHeight, canvasWidth) {
    var lineWidth = 0;
    var lastSubStrIndex = 0; //每次开始截取的字符串的索引
    for (let i = 0; i < str.length; i++) {
      lineWidth += ctx.measureText(str[i]).width;
      if (lineWidth > canvasWidth) {
        ctx.fillText(str.substring(lastSubStrIndex, i), leftWidth, initHeight); //绘制截取部分
        initHeight += 16; //16为字体的高度
        lineWidth = 0;
        lastSubStrIndex = i;
        titleHeight += 30;
      }
      if (i == str.length - 1) { //绘制剩余部分
        ctx.fillText(str.substring(lastSubStrIndex, i + 1), leftWidth, initHeight);
      }
    }
    // 标题border-bottom 线距顶部距离
    titleHeight = titleHeight + 10;
    return titleHeight
  },

})