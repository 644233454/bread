Page({

  /**
   * 页面的初始数据
   */
  data: {
    resaultIcon: "/assets/imgs/fxs_withdraw_record_icon_withdraw.png",
    statusNormalText: "提现成功",
    statusFailedText: "提现失败",
    statusIngText: "处理中",
    date:{},
  },


  onLoad: function (options) {
    var queryBean = JSON.parse(options.date);
    this.setData({
      date: queryBean
    })
  },

})
