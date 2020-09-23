Page({

  /**
   * 页面的初始数据
   */
  data: {
    resaultIcon: "/assets/imgs/fxs_withdraw_resault_success.png",
    resaultText: "提现发起成功",
    resaultWornText: "请等待处理结果",
    account:"微信钱包",
    date:{},
  },


  onLoad: function (options){
    var queryBean = JSON.parse(options.date);
    this.setData({
      date: queryBean
    })
  }
})
