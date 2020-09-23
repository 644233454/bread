// pages/userCommentGoodInfo/userCommentGoodInfo.js
var log = require('../../cmps/log.js') // 引用上面的log.js文件
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodIem:{},//订单中的商品
    orderId:"",//订单id
    imags:[],//照片
    commentText:"",//评论
    imagesShow:"",
    tempFilePaths:[],
    imageAdd:[],//图片地址
    upImaging:"",//
    type:"",
    // HTMLStr:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.goodIem = JSON.parse(options.goodItemStr);
    this.data.type = this.data.goodIem.type;
    this.data.orderId = options.orderId;
    log.info("评论商品");
    console.log('初始化传入数据');
    console.log(this.data.goodIem);
    console.log(this.data.orderId);
    this.setData(this.data);

    // this.data.HTMLStr ="aaaa";
    


    // this.data.orderDetail = JSON.parse(options.orderDetail);
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
  /**
   * 用户编辑评论
   */
  detailInput:function(e){
    console.log("编辑detailInput");
    console.log(e);
    this.data.commentText  =e.detail.value;
    // console.log("文本框内容");
    // console.log(this.data.commentText);
    // this.data.detailInfoList[e.target.dataset.index].description = e.detail.value;
    // console.log("赋值后的数据");
    // console.log(this.data.detailInfoList);
  },
  /**
   * 上传评论
   */
  sureBtn:function(){
    var userToken =wx.RiceUserToken;


    console.log('上传评论');
    if(this.data.upImaging==1){
      wx.db.toastError('正在上传图片,请稍等');
      return;
    }


    var reqTask = wx.request({
      
      url: wx.db.url('comment/add'),
      data: {
        "orderId":this.data.orderId,
        "description":this.data.commentText,
        "imgUrls":this.data.imageAdd,
        "productId":this.data.goodIem.productId,
        "score":3
      },

      header: {'content-type':'application/json',Authorization:`Bearer ${userToken}`},
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: (result)=>{
        console.log('提交评论返回数据');
        console.log(result);
        var codeMessage = result.data.code;
        if(codeMessage ==0){
          wx.showToast({
            title: '已提交成功',
            icon: 'success',
            image: '',
            duration: 2000,
            mask: false,
          });
          setTimeout(function () {
            console.log('延迟');
          wx.navigateBack({
            delta: 999
          });
           }, 2000) //延迟时间 这里是1秒
        }else{
            wx.db.toastError(result.data.msg);
        }
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },

  chooseImg:function(e){
    var that = this;
    wx.chooseImage({
      count: 3-this.data.tempFilePaths.length,
      sizeType: ['original','compressed'],
      sourceType: ['album','camera'],
      success: (result)=>{
        console.log("相机返回数据");
        console.log(result);

        // this.data.imageAdd = [];
        

        for(var i=0;i<result.tempFilePaths.length;i++){
          if(this.data.tempFilePaths.length>=3){
            

            this.setData(this.data);
            wx.db.toastError("最多上传三张照片");
            return false;
          }else{
            this.data.tempFilePaths.push(result.tempFilePaths[i]);

           this.upImageData(result.tempFilePaths[i]);


            
            this.setData(this.data);
          }
        }

        console.log('this.data.tempFilePaths333');
            console.log(this.data.tempFilePaths);

      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },
  // 删除图片
  deleteImg: function (e) {
    var imgs = this.data.imgs;
    var index = e.currentTarget.dataset.index;
    this.data.tempFilePaths.splice(index, 1);
    this.data.imageAdd.splice(index, 1);

    this.setData(this.data);
  },
  //上传图片
  upImageData:function(path){
  
    log.info("上传图片地址");
    log.info(path);
    
    this.data.upImaging =1;
    var upTask = wx.uploadFile({
      url: wx.db.url('product/upload'),
      filePath: path,
      name: "file",
      header: {'content-type':'multipart/form-data',Authorization:`Bearer ${wx.RiceUserToken}`},
      formData: {},
      success: (result)=>{
        this.data.upImaging =0;
        
        var dataStr = JSON.parse(result.data);

        var  imageUrl =dataStr.data;

        
        this.data.imageAdd.push(imageUrl);

        var datastr = {
          "data":this.data.imageAdd
        };
        // var str = 
        console.log(JSON.stringify(datastr));


      },
      fail: (result)=>{
        this.data.upImaging =0;
        
      },
      complete: result => {
        // wx.db.toastError(`complete: ------ ${JSON.stringify(result)}`)

        this.data.upImaging = 0;
      }
    });
  },
  // 预览图片
  previewImg: function (e) {
    //获取当前图片的下标
    var index = e.currentTarget.dataset.index;
    console.log("选中的第几个");
    console.log(e);

    //所有图片
    // var imgs = this.data.tempFilePaths;
    wx.previewImage({
      //当前显示图片
      current: this.data.tempFilePaths[index],
      //所有图片
      urls: this.data.tempFilePaths
    })
  },
 

})