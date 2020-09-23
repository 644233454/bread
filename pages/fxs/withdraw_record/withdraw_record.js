Page({

  /**
   * 页面的初始数据
   */
  data: {
    itemBg: "/assets/imgs/fxs_withdraw_record_icon_withdraw.png",
    statusNormalColor: "#8A8A8A",
    statusIngColor: "#F0B567",
    statusFailedColor: "#F3345C",
    statusNormalText: "提现成功",
    statusFailedText: "提现失败",
    statusIngText: "处理中",
    listData: [],

    currPage: 1, //分页当前页，起始时时第一页
    pageSize: 10, //分页大小
    noMoreData: false, //分页最后一页为true,再次下拉不再请求服务器
  },

  /**
   * 网络请求
   */
  onLoad: function() {
    this.getInfo(true);
  },


  /**
   * item点击事件
   * 获取item数据
   */
  v_item_itemOnClick: function(e) {
    var bean = e.currentTarget.dataset.index;
    console.log(JSON.stringify(bean));
    var jsonDate = JSON.stringify(bean); //传递object数据给下一页面
    wx.navigateTo({
      url: "../withdraw_record_detail/withdraw_record_detail?date=" + jsonDate,
    })
  },



  /**
   * 监听下拉动作
   */
  onPullDownRefresh: function() {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    this.getInfo(true);
  },

  /**
   * 上拉触底事件
   * 如果你的页面没有充满屏幕是不会触发这个函数的！
   */
  onReachBottom: function() {
    // 显示加载图标
    wx.showLoading({
      title: '加载中',
    })
    this.getInfo(false);
  },


  /**
   * onPullDownRefresh 是否下拉刷新，首次进入页面或者用户触发下拉刷新动作都为true，否则就是上拉加载更多
   */
  getInfo: function(onPullDownRefresh) {
    //下拉刷新，重置参数
    if (onPullDownRefresh) {
      this.data.currPage = 1;
      this.data.noMoreData = false;
      this.data.listData = [];
      console.log("下拉刷新，重置参数");
    }
    if (this.data.noMoreData) {
      wx.showToast({
        title: "暂无更多数据",
        icon: "none"
      });
      console.log("暂无更多数据");
      return;
    }

    console.log(this.data.currPage)
    var reqTask = wx.request({
      url: wx.db.url('asset/getWithDrawList'),
      data: {
        "page": this.data.currPage,
        "pageSize": this.data.pageSize
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
        var statusCode = result.statusCode; //statusCode为200表示接口请求成功
        var code = result.data.code; //code为0表示获取数据成功
        if (statusCode == 200) {
          if (code == 0) {
            var list = result.data.data;
            if (list.length == 0) {
              //没有数据，mPage不增加
              if (this.data.currPage == 1) {
                //首次请求就没有数据
                wx.showToast({
                  title: "暂无数据",
                  icon: "none"
                });
              }
              this.data.noMoreData = true;
              console.log("没有数据，mPage不增加");
            } else if (list.length < this.data.pageSize) {
              //已经没有更多数据了，是最后一页
              var data = this.data.listData.concat(list);
              this.setData({
                listData: data
              });
              this.data.noMoreData = true;
              console.log("已经没有更多数据了，是最后一页");
            } else {
              //还可能有更多数据 
              var data = this.data.listData.concat(list);
              this.setData({
                listData: data
              });
              this.data.currPage = this.data.currPage + 1;
              console.log("还可能有更多数据");

            }
            console.log(this.data.currPage);
            console.log(this.data.listData);
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
        wx.showToast({
          title: result.errMsg,
          icon: "none"
        });
      },
      complete: () => {
        console.log("complete");
        if (onPullDownRefresh) {
          //下拉刷新
          wx.hideNavigationBarLoading();
          wx.stopPullDownRefresh();
        } else {
          //上拉加载更多
          wx.hideLoading();
        }
      }
    });
  },

})