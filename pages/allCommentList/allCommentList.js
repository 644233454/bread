// pages/allCommentList/allCommentList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parentId:"",
    commentList:[],
    scrollHight:"0",
    scrollBottom:false,
    page:1,//页码
    pageSize:20,//每页数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.parentId = options.parentId;
    console.log(wx.db.safeAreaHight);
    console.log(wx.db.navBarHeight);
    console.log(wx.db.statusBarHeight);
    this.data.scrollHight = wx.db.screenHeight -wx.db.navBarHeight-wx.db.statusBarHeight;
    console.log(this.data.scrollHight);
    var reqTask = wx.request({
      url: wx.db.url('comment/list'),
      data: {
        "parentId":this.data.parentId,
        "commentType":"0",
        "page":this.data.page,
        "pageSize":this.data.pageSize
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

  searchScrollLower:function(e){
    console.log('滑动到底部');
    if(this.data.scrollBottom ==true){
      return;
    }
    this.data.scrollBottom = true;
    this.data.page +=1;
    var userToken = wx.RiceUserToken;

    // console.log("滑动到底部传参 queryStr= "+this.data.inputValue+"page ="+this.data.page+"pageSize="+this.data.pageSize);

    var reqTask = wx.request({
      url: wx.db.url('comment/list'),
      data: {
        "parentId":this.data.parentId,
        "commentType":"0",
        "page":this.data.page,
        "pageSize":this.data.pageSize
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
          
          this.data.commentList =this.data.commentList.concat(result.data.data);
          
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
})