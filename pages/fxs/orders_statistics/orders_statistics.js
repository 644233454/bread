Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: wx.db.statusBarHeight + wx.db.navBarHeight,
    searchBg: "/assets/imgs/ic_search.png",


    TabSelectedIndex: 0, //0代表订单类型，1代表订单状态
    TabSelectedTextColor: "#F3345C",
    TabUnSelectedTextColor: "#999999",
    TabSelectedArrowBg: "/assets/imgs/fxs_earings_statistics_custome_time_red.png",
    TabUnSelectedArrowBg: "/assets/imgs/fxs_earings_statistics_custome_time.png",
    TabType: ["全部", "周期购", "拼团"],
    TabTypeSelectedIndex: 0, //订单类型默认第一个选中，也就是全部
    TabTypeHidden: true, //订单类型弹框是否显示，默认不显示
    TabStatus: ["全部", "待付款", "待发货", "待收货", "交易成功", "交易关闭"],
    TabStatusSelectedIndex: 0, //订单状态默认第一个选中，也就是全部
    TabStatusHidden: true, //订单状态弹框是否显示，默认不显示
    move: false, // 是会阻止页面滚动的

    tabBg: "/assets/imgs/fxs_orders_statistics_tab_bg.png",
    listData: [],
    rateDate: {},
    refundStatus: ["", "已发起退款", "退款成功",],//refundStatus:0,1,2
    orderStatus: ["等待买家付款", "等待商家发货", "商家已发货", "交易成功", "交易成功", "已关闭", "查看进度", ""],//orderStatus:"",0,1,2,3,4,5



    inputValue: "", //搜索框输入的值

    sv_Height: 0, //scroll-view的高度
    loading: false, //"上拉加载"的变量，默认false，隐藏
    loadingComplete: false, //“没有数据”的变量，默认false，隐藏
    currPage: 1, //分页当前页，起始时时第一页
    pageSize: 10, //分页大小
    isSearch: false, //是否搜索

    navigationBarHeight: 0,
  },


  onLoad: function() {
    this.getData();
  },


  onReady: function() {
    console.log(wx.db.statusBarHeight + " , " + wx.db.navBarHeight)
    this.setData({
      navigationBarHeight: (wx.db.statusBarHeight + wx.db.navBarHeight) * 1
    });

    let that = this;
    // 获取系统信息
    wx.getSystemInfo({
      success: function(res) {
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
        query.exec(function(res) {
          //res就是 所有标签为v_bodyTop的元素的信息 的数组
          //console.log(res);
          //取高度
          //console.log("height=" + res[0].height);
          //到顶部的距离
          //console.log("top=" + res[0].top);
          //console.log((res[0].top + res[0].height) * 2 + "rpx");
          //部分手机不准确，底部会留白，加一个60
          that.setData({
            sv_Height: height - 182,
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

  v_item_itemOnClick: function(event) {
    let orderType = event.currentTarget.dataset.index.orderType;
    if (orderType == "PERIOD_AUTO") {
      wx.navigateTo({
        url: "../zqg_schedule/zqg_schedule?orderId=" + event.currentTarget.dataset.index.orderId,
      })
    }
  },

  /**
   * 回车搜索
   */
  search_function: function(e) {
    //如果搜索值为空就不搜索
    if (typeof(this.data.inputValue) == "undefined" || this.data.inputValue == "") {
      wx.showToast({
        title: "请输入搜索关键字",
        icon: "none"
      });
      this.data.isSearch = false;
      return;
    }
    //重置数据
    this.setData({
      isSearch: true,
      listData: [],
      rateDate: {},
      loading: false,
      loadingComplete: false,
      currPage: 1,
    });
    this.getData();
    this.setData({
      move: false,
      TabStatusHidden: true,
      TabTypeHidden: true,
    })
  },

  /**
   * 点击搜索icon搜索
   */
  icon_search_function: function() {
    //如果搜索值为空就不搜索
    if (typeof(this.data.inputValue) == "undefined" || this.data.inputValue == "") {
      wx.showToast({
        title: "请输入搜索关键字",
        icon: "none"
      });
      this.data.isSearch = false;
      return;
    }
    //重置数据
    this.setData({
      isSearch: true,
      listData: [],
      rateDate: {},
      loading: false,
      loadingComplete: false,
      currPage: 1,
    });
    this.getData();
    this.setData({
      move: false,
      TabStatusHidden: true,
      TabTypeHidden: true,
    })
  },

  /**
   * 自动获取input中的实时输入的值
   */
  getInputValue: function(e) {
    this.data.inputValue = e.detail.value;
    if (this.data.inputValue === "" || this.data.inputValue === null) {
      //重置数据, 回退关键字为空时isSearch重置为false
      this.setData({
        isSearch: false,
        listData: [],
        rateDate: {},
        loading: false,
        loadingComplete: false,
        currPage: 1,
      });
      this.getData();
    }
  },


  /**
   * 订单类型点击事件
   */
  v_TabType_onclick: function() {
    this.goTop();
    this.setData({
      TabSelectedIndex: 0,
      move: true,
      TabTypeHidden: false,
      TabStatusHidden: true,
    });
  },


  /**
   * 订单状态点击事件
   */
  v_tabStatus_onclick: function() {
    this.goTop();
    this.setData({
      TabSelectedIndex: 1,
      move: true,
      TabTypeHidden: true,
      TabStatusHidden: false,
    });
  },


  /**
   * 订单状态
   * 全部
   */
  v_dialog_TabStatus0_click: function() {
    this.setData({
      TabSelectedIndex: 1,
      TabStatusSelectedIndex: 0,
      move: false,
      TabStatusHidden: true,
      TabTypeHidden: true,
      listData: [],
      rateDate: {},
      loading: false,
      loadingComplete: false,
      currPage: 1,
    });
    this.getData();
  },


  /**
   * 订单状态
   * 待付款
   */
  v_dialog_TabStatus1_click: function() {
    this.setData({
      TabSelectedIndex: 1,
      TabStatusSelectedIndex: 1,
      move: false,
      TabStatusHidden: true,
      TabTypeHidden: true,
      listData: [],
      rateDate: {},
      loading: false,
      loadingComplete: false,
      currPage: 1,
    });
    this.getData();
  },

  /**
   * 订单状态
   * 待发货
   */
  v_dialog_TabStatus2_click: function() {
    this.setData({
      TabSelectedIndex: 1,
      TabStatusSelectedIndex: 2,
      move: false,
      TabStatusHidden: true,
      TabTypeHidden: true,
      listData: [],
      rateDate: {},
      loading: false,
      loadingComplete: false,
      currPage: 1,
    });
    this.getData();
  },

  /**
   * 订单状态
   * 待收货
   */
  v_dialog_TabStatus3_click: function() {
    this.setData({
      TabSelectedIndex: 1,
      TabStatusSelectedIndex: 3,
      move: false,
      TabStatusHidden: true,
      TabTypeHidden: true,
      listData: [],
      rateDate: {},
      loading: false,
      loadingComplete: false,
      currPage: 1,
    });
    this.getData();
  },

  /**
   * 订单状态
   * 交易成功
   */
  v_dialog_TabStatus4_click: function() {
    this.setData({
      TabSelectedIndex: 1,
      TabStatusSelectedIndex: 4,
      move: false,
      TabStatusHidden: true,
      TabTypeHidden: true,
      listData: [],
      rateDate: {},
      loading: false,
      loadingComplete: false,
      currPage: 1,
    });
    this.getData();
  },


  /**
   *订单状态
   * 交易失败
   */
  v_dialog_TabStatus5_click: function() {
    this.setData({
      TabSelectedIndex: 1,
      TabStatusSelectedIndex: 5,
      move: false,
      TabStatusHidden: true,
      TabTypeHidden: true,
      listData: [],
      rateDate: {},
      loading: false,
      loadingComplete: false,
      currPage: 1,
    });
    this.getData();
  },

  /**
   * 订单状态弹框
   * 阴影部分
   */
  v_dialog_TabStatus_content_shadow_click: function() {
    this.setData({
      //TabSelectedIndex: 1,
      move: false,
      TabStatusHidden: true,
      TabTypeHidden: true,
      listData: [],
      rateDate: {},
      loading: false,
      loadingComplete: false,
      currPage: 1,
    })
    this.getData();
  },

  /**
   * 订单类型弹框
   * 阴影部分
   */
  v_dialog_TabType_content_shadow_click: function() {
    this.setData({
      //TabSelectedIndex: 0,
      move: false,
      TabStatusHidden: true,
      TabTypeHidden: true,
      listData: [],
      rateDate: {},
      loading: false,
      loadingComplete: false,
      currPage: 1,
    })
    this.getData();
  },

  /**
   * 订单类型
   * 全部
   */
  v_dialog_TabType0_click: function() {
    this.setData({
      TabSelectedIndex: 0,
      TabTypeSelectedIndex: 0,
      move: false,
      TabStatusHidden: true,
      TabTypeHidden: true,
      listData: [],
      rateDate: {},
      loading: false,
      loadingComplete: false,
      currPage: 1,
    });
    this.getData();
  },

  /**
   * 订单类型
   * 周期购
   */
  v_dialog_TabType1_click: function() {
    this.setData({
      TabSelectedIndex: 0,
      TabTypeSelectedIndex: 1,
      move: false,
      TabStatusHidden: true,
      TabTypeHidden: true,
      listData: [],
      rateDate: {},
      loading: false,
      loadingComplete: false,
      currPage: 1,
    });
    this.getData();
  },

  /**
   * 订单类型
   * 拼团
   */
  v_dialog_TabType2_click: function() {
    /* this.setData({
       TabSelectedIndex: 0,
       TabTypeSelectedIndex: 2,
       move: false,
       TabStatusHidden: true,
       TabTypeHidden: true,
       listData: [],
       rateDate: {},
       loading: false,
       loadingComplete: false,
       currPage: 1,
     });
     this.getData();*/
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

    //全部""，待付款0，待发货1，待收货2，待评价3，交易成功4，交易关闭5
    let status = "";
    if (this.data.TabStatusSelectedIndex == 0) {
      status = "";
    } else if (this.data.TabStatusSelectedIndex == 1) {
      status = "0";
    } else if (this.data.TabStatusSelectedIndex == 2) {
      status = "1";
    } else if (this.data.TabStatusSelectedIndex == 3) {
      status = "2";
    } else if (this.data.TabStatusSelectedIndex == 4) {
      status = "4";
    } else if (this.data.TabStatusSelectedIndex == 5) {
      status = "5";
    }
    let type = "";
    //全部""，周期购PERIOD
    if (this.data.TabTypeSelectedIndex == 0) {
      type = "";
    } else if (this.data.TabTypeSelectedIndex == 1) {
      type = "PERIOD";
    }

    console.log("loading:" + this.data.loading +
      ", loadingComplete:" + this.data.loadingComplete +
      " , isSearch:" + this.data.isSearch +
      " ,queryStr:" + this.data.inputValue +
      ", type:" + type +
      ", status:" + status +
      " , page:" + this.data.currPage +
      " , 第几个Tab：" + this.data.TabSelectedIndex +
      ", 订单类型第几个：" + this.data.TabTypeSelectedIndex +
      ", 订单状态第几个：" + this.data.TabStatusSelectedIndex);

    var reqTask = wx.request({
      url: wx.db.url('stat/orderList'),
      data: {
        "page": this.data.currPage,
        "pageSize": this.data.pageSize,
        "orderStatus": status,
        "queryStr": this.data.inputValue,
        "orderType": type,
        "startTime": "",
        "endTime": ""
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
              for (let i = 0; i < data.length; i++) {
                let item = data[i];
                if (item.orderType == "PERIOD") {
                  //周期够，第一次下单时的订单
                  item.statusText = this.data.orderStatus[item.orderStatus];
                } else if (item.orderType == "PERIOD_AUTO") {
                  //周期够自动生成，每一期每一期
                  item.statusText = item.progress;
                } else {
                  item.statusText = this.data.orderStatus[item.orderStatus];
                }
              }
              this.setData({
                listData: data,
                loadingComplete: true,
                loading: false
              });
              console.log("已经没有更多数据了，是最后一页");
            } else {
              //还可能有更多数据 
              var data = this.data.listData.concat(list);
              for (let i = 0; i < data.length; i++) {
                let item = data[i];
                if (item.orderType == "PERIOD") {
                  //周期够，第一次下单时的订单
                  item.statusText = this.data.orderStatus[item.orderStatus];
                } else if (item.orderType == "PERIOD_AUTO") {
                  //周期够自动生成，每一期每一期
                  item.statusText = item.progress;
                } else {
                  item.statusText = this.data.orderStatus[item.orderStatus];
                }
              }
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
        //console.log("complete");
        this.setData({
          loading: false
        });
      }
    });
  },


  getRateMoney: function() {
    //正在(loading或者已经把所有数据加载完毕)和不是搜索 就不让加载
    if ((this.data.loading || this.data.loadingComplete) && !this.data.isSearch) {
      console.log("正在加载中，阻止再次加载");
      return;
    }
    //展开相对应状态
    if (this.data.currPage == 1) {
      this.setData({
        rateDate: {},
      });
    }

    //全部status不填，待付款0，待发货1，待收货2，交易成功4，交易关闭5
    let status = "";
    if (this.data.TabStatusSelectedIndex == 0) {
      status = "";
    } else if (this.data.TabStatusSelectedIndex == 1) {
      status = "0";
    } else if (this.data.TabStatusSelectedIndex == 2) {
      status = "1";
    } else if (this.data.TabStatusSelectedIndex == 3) {
      status = "2";
    } else if (this.data.TabStatusSelectedIndex == 4) {
      status = "4";
    } else if (this.data.TabStatusSelectedIndex == 5) {
      status = "5";
    }
    let type = "";
    //全部""，周期购PERIOD
    if (this.data.TabTypeSelectedIndex == 0) {
      type = "";
    } else if (this.data.TabTypeSelectedIndex == 1) {
      type = "PERIOD";
    }
    var reqTask = wx.request({
      url: wx.db.url('stat/orderListInfo'),
      data: {
        "orderStatus": status,
        "queryStr": this.data.inputValue,
        "orderType": type,
        "startTime": "",
        "endTime": ""
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
            this.setData({
              rateDate: result.data.data
            });
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
        //console.log("complete");
      }
    });
  },

  getData: function() {
    this.getRateMoney();
    this.getInfo();
  },


  //回到顶部
  goTop: function() { // 一键回到顶部
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      console.log("当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试");
    }
  },

})