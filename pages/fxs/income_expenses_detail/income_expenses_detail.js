Page({

  /**
   * 页面的初始数据
   */
  data: {
    resaultIcon: "/assets/imgs/fxs_income_expenses_fxsyj.png",
    date: {},
  },

  onLoad: function (options) {
    var queryBean = JSON.parse(options.date);
    this.setData({
      date: queryBean
    })
  },


})
