// pages/logisticsInfoDetail/logisticsInfoDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logisticsInfo:{

    },
    index:"",
    logisticsInfoDetail:[],
    newLogisticsInfoDetail:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.logisticsInfo){
      console.log("options.logisticsInfo");
      console.log(options.logisticsInfo);
      var newData = decodeURIComponent(options.logisticsInfo);
      this.data.logisticsInfo = JSON.parse(newData);
      this.data.index = options.index;
      this.data.logisticsInfoDetail = this.data.logisticsInfo.logisticsDetails;
      for(var i=0;i<this.data.logisticsInfoDetail.length;i++){
        var item  = this.data.logisticsInfoDetail[i];
        if(item.traceStatus ==0){
          item.title = '暂无轨迹信息'
        }
        if(item.traceStatus ==1){
          item.title = '已揽收'
        }
        if(item.traceStatus ==2){
          item.title = '在途中'
        }
        if(item.traceStatus ==201){
          item.title = '到达派件城市'
        }
        if(item.traceStatus ==202){
          item.title = '派件中'
        }
        if(item.traceStatus ==211){
          item.title = '已放入快递柜或驿站'
        }
        if(item.traceStatus ==3){
          item.title = '签收'
        }
        if(item.traceStatus ==301){
          item.title = '正常签收'
        }
        if(item.traceStatus ==302){
          item.title = '派件异常后最终签收'
        }
        if(item.traceStatus ==304){
          item.title = '代收签收'
        }
        if(item.traceStatus ==311){
          item.title = '快递柜或驿站签收'
        }
        if(item.traceStatus ==4){
          item.title = '问题件'
        }
        if(item.traceStatus ==401){
          item.title = '发货无信息'
        }
        if(item.traceStatus ==402){
          item.title = '超时未签收'
        }
        if(item.traceStatus ==403){
          item.title = '超时未更新'
        }
        if(item.traceStatus ==404){
          item.title = '拒收(退件)'
        }
        if(item.traceStatus ==405){
          item.title = '派件异常'
        }
        if(item.traceStatus ==406){
          item.title = '退货签收'
        }
        if(item.traceStatus ==407){
          item.title = '退货未签收'
        }
        if(item.traceStatus ==412){
          item.title = '快递柜或驿站超时未取'
        }
        this.data.newLogisticsInfoDetail.push(item);

      }
      console.log(this.data.logisticsInfo);
      this.setData(this.data);
    }
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
  copyClick:function(e){
    console.log(e);
    console.log("复制");
    var numberStr = e.currentTarget.dataset.item;

    wx.setClipboardData({
      data: numberStr,
      success: function (res) {
      }
      })
  },
})