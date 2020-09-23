Page({


  data: {

    TabSelectedIndex: 0, //0代表类型，1订单状态
    TabSelectedTextColor: "#F3345C",
    TabUnSelectedTextColor: "#999999",
    TabSelectedArrowBg: "/assets/imgs/fxs_earings_statistics_custome_time_red.png",
    TabUnSelectedArrowBg: "/assets/imgs/fxs_earings_statistics_custome_time.png",
    TabOneText: ["全部", "礼品券"],
    TabTwoText: ["全部", "未使用", "已使用", "已过期"],
    TabOneSelectedIndex: 0, //类型默认第一个选中，也就是全部
    TabOneHidden: true, //类型弹框是否显示，默认不显示
    TabTwoSelectedIndex: 0, //状态默认第一个选中，也就是全部
    TabTwoHidden: true, //状态弹框是否显示，默认不显示
    TabMove: false, // 是会阻止页面滚动的
    tabBg: "/assets/imgs/fxs_orders_statistics_tab_bg.png",

    listData: [],
    sv_Height: 0, //scroll-view的高度
    loading: false, //"上拉加载"的变量，默认false，隐藏
    loadingComplete: false, //“没有数据”的变量，默认false，隐藏
    currPage: 1, //分页当前页，起始时时第一页
    pageSize: 10, //分页大小
    navigationBarHeight: 0,

  },


  onLoad: function(options) {
    this.getInfo();
  },

  onReady: function() {
    //wx.db.statusBarHeight + wx.db.navBarHeight;
    console.log(wx.db.statusBarHeight + " , " + wx.db.navBarHeight)
    this.setData({
      navigationBarHeight: (wx.db.statusBarHeight + wx.db.navBarHeight) * 1
    });

    /**let that = this;
    wx.getSystemInfo({
      success: function (res) {
        let rpx = res.windowWidth / 375;
        that.setData({
          navigationBarHeight: (wx.db.statusBarHeight + wx.db.navBarHeight) * rpx
        });
        console.log(rpx);
        console.log((wx.db.statusBarHeight + wx.db.navBarHeight) * rpx);
      },
    })**/




    let that = this;
    // 获取系统信息
    wx.getSystemInfo({
      success: function (res) {
        // 获取可使用窗口宽度
        let clientHeight = res.windowHeight;
        // 获取可使用窗口高度
        let clientWidth = res.windowWidth;
        // 算出比例
        let ratio = 750 / clientWidth;
        // 算出高度(单位rpx)
        let height = clientHeight * ratio;
        //console.log(height + "rpx");
        //创建节点选择器
        var query = wx.createSelectorQuery();
        //选择id
        query.select('#v_bodyTop').boundingClientRect()
        query.exec(function (res) {
          //res就是 所有标签为v_bodyTop的元素的信息 的数组
          //console.log(res);
          //取高度
          //console.log("height=" + res[0].height);
          //到顶部的距离
          //console.log("top=" + res[0].top);
          //console.log((res[0].top + res[0].height) * 2 + "rpx");
          //部分手机不准确，底部会留白，加一个60
          that.setData({
            sv_Height: height - 220,
          });
          //console.log(that.data.sv_Height);
        });
      }
    });

  },

  //滚动到底部触发事件
  bottomRefresh: function() {
    //console.log("滚动到底部触发事件");
    this.getInfo();
  },

  /**
   * 类型tab点击事件
   */
  showTabOne: function() {
    this.setData({
      TabSelectedIndex: 0,
      TabOneHidden: false,
      TabTwoHidden: true,
    });
  },

  /**
   * 状态tab点击事件
   */
  showTabTwo: function() {
    this.setData({
      TabSelectedIndex: 1,
      TabOneHidden: true,
      TabTwoHidden: false,
    });
  },


  /**
   * 类型tab
   * 全部点击事件
   */
  TabOneOne: function() {
    if (this.data.TabOneSelectedIndex != 0) {
      this.setData({
        TabSelectedIndex: 0,
        TabOneSelectedIndex: 0,
        TabOneHidden: true,
        TabTwoHidden: true,
        listData: [],
        loading: false,
        loadingComplete: false,
        currPage: 1,
      });
      this.getInfo();
    }
  },


  /**
   * 类型tab
   * 礼品卷点击事件
   */
  TabOneTwo: function() {
    if (this.data.TabOneSelectedIndex != 1) {
      this.setData({
        TabSelectedIndex: 0,
        TabOneSelectedIndex: 1,
        TabOneHidden: true,
        TabTwoHidden: true,
        listData: [],
        loading: false,
        loadingComplete: false,
        currPage: 1,
      });
      this.getInfo();
    }
  },

  /**
   * 状态tab
   * 全部点击事件
   */
  TabTwoOne: function() {
    if (this.data.TabTwoSelectedIndex != 0) {
      this.setData({
        TabSelectedIndex: 1,
        TabTwoSelectedIndex: 0,
        TabOneHidden: true,
        TabTwoHidden: true,
        listData: [],
        loading: false,
        loadingComplete: false,
        currPage: 1,
      });
      this.getInfo();
    }
  },

  /**
   * 状态tab
   * 未使用点击事件
   */
  TabTwoTwo: function() {
    if (this.data.TabTwoSelectedIndex != 1) {
      this.setData({
        TabSelectedIndex: 1,
        TabTwoSelectedIndex: 1,
        TabOneHidden: true,
        TabTwoHidden: true,
        listData: [],
        loading: false,
        loadingComplete: false,
        currPage: 1,
      });
      this.getInfo();
    }
  },

  /**
   * 状态tab
   * 已使用点击事件
   */
  TabTwoThree: function() {
    if (this.data.TabTwoSelectedIndex != 2) {
      this.setData({
        TabSelectedIndex: 1,
        TabTwoSelectedIndex: 2,
        TabOneHidden: true,
        TabTwoHidden: true,
        listData: [],
        loading: false,
        loadingComplete: false,
        currPage: 1,
      });
      this.getInfo();
    }
  },

  /**
   * 状态tab
   * 已过期点击事件
   */
  TabTwoFour: function() {
    if (this.data.TabTwoSelectedIndex != 3) {
      this.setData({
        TabSelectedIndex: 1,
        TabTwoSelectedIndex: 3,
        TabOneHidden: true,
        TabTwoHidden: true,
        listData: [],
        loading: false,
        loadingComplete: false,
        currPage: 1,
      });
      this.getInfo();
    }
  },

  Tab1Blank: function() {
    this.setData({
      TabOneHidden: true,
      TabTwoHidden: true,
    });
  },

  Tab2Blank: function() {
    this.setData({
      TabOneHidden: true,
      TabTwoHidden: true,
    });
  },


  itemOnClick: function(e) {
    var bean = e.currentTarget.dataset.index;
    console.log(JSON.stringify(bean));
    var jsonDate = JSON.stringify(bean); //传递object数据给下一页面
    if (bean.status == 'UNUSED') {
      wx.navigateTo({
        url: "../../cycleShopDetail/cycleShopDetail?ORGItem=" + jsonDate,
      })
    }
  },

  /**
   * 获取列表数据
   */
  getInfo: function() {
    //正在(loading或者已经把所有数据加载完毕) 就不让加载
    if (this.data.loading || this.data.loadingComplete) {
      console.log("正在加载中，阻止再次加载");
      return;
    }
    //展开相对应状态
    if (this.data.currPage == 1 && this.data.listData.length != 0) {
      this.setData({
        listData: [],
      });
    }
    this.setData({
      loading: true,
      loadingComplete: false
    });
    let type = "";
    if (this.data.TabSelectedIndex == 0) {
      //全部
      type = "";
    } else if (this.data.TabSelectedIndex == 1) {
      //类型
      type = "GIFT_CARD";
    }
    //status:UNUSED,USED,EXPIRED
    let status = "";
    if (this.data.TabTwoSelectedIndex == 0) {
      status = "";
    } else if (this.data.TabTwoSelectedIndex == 1) {
      status = "UNUSED";
    } else if (this.data.TabTwoSelectedIndex == 2) {
      status = "USED";
    } else if (this.data.TabTwoSelectedIndex == 3) {
      status = "EXPIRED";
    }
    var reqTask = wx.request({
      url: wx.db.url('giftCard/list'),
      data: {
        "page": this.data.currPage,
        "pageSize": this.data.pageSize,
        "status": status,
        "type": type,
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
              this.setData({
                loadingComplete: true,
                loading: false
              });
              console.log("没有数据，mPage不增加");
            } else if (list.length < this.data.pageSize) {
              //已经没有更多数据了，是最后一页
              var data = this.data.listData.concat(list);
              this.setData({
                listData: data,
                loadingComplete: true,
                loading: false
              });
              console.log("已经没有更多数据了，是最后一页");
            } else {
              //还可能有更多数据 
              var data = this.data.listData.concat(list);
              this.setData({
                listData: data,
                loading: false
              });
              this.data.currPage = this.data.currPage + 1;
              console.log("还可能有更多数据");

            }
            console.log("当前页：" + this.data.currPage);
            //console.log(this.data.listData);
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
        this.setData({
          loading: false
        });
      }
    });
  },

})