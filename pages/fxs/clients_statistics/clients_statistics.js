Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchBg: "/assets/imgs/ic_search.png",

    listData: [],
    inputValue: "", //搜索框输入的值

    sv_Height: 0, //scroll-view的高度
    loading: false, //"上拉加载"的变量，默认false，隐藏
    loadingComplete: false, //“没有数据”的变量，默认false，隐藏
    currPage: 1, //分页当前页，起始时时第一页
    pageSize: 10, //分页大小
    isSearch: false, //是否搜索
  },



  /**
   * 网络请求
   */
  onLoad: function() {
    this.getInfo();
  },

  onReady: function() {
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
        console.log(height + "rpx");

        //创建节点选择器
        var query = wx.createSelectorQuery();
        //选择id
        query.select('#v_bodyTop').boundingClientRect()
        query.exec(function(res) {
          //res就是 所有标签为v_bodyTop的元素的信息 的数组
          console.log(res);
          //取高度
          //console.log("height=" + res[0].height);
          //到顶部的距离
          //console.log("top=" + res[0].top);
          console.log((res[0].top + res[0].height) * 2 + "rpx");
          //部分手机不准确，底部会留白，加一个30
          that.setData({
            sv_Height: height - (res[0].top + res[0].height) * 2 + 30
          });
        });
      }
    });
  },


  //滚动到底部触发事件
  bottomRefresh: function() {
    console.log("滚动到底部触发事件");
    this.getInfo();
  },




  /**
   * 推荐商品
   * 专属推荐
   */
  v_cjsp_click: function(e) {
    console.log("推荐商品");
    var item = e.currentTarget.dataset.index;
    console.log(JSON.stringify(item));
    wx.navigateTo({
      url: "../exclusive_recommend/exclusive_recommend"
    })
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
      inputValue: e.detail.value,
      isSearch: true,
      listData: [],
      loading: false,
      loadingComplete: false,
      currPage: 1,
      pageSize: 10,
    });
    this.getInfo();
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
      loading: false,
      loadingComplete: false,
      currPage: 1,
      pageSize: 10,
    });
    this.getInfo();
  },

  /**
   * 自动获取input中的实时输入的值
   */
  getInputValue: function(e) {
    this.data.inputValue = e.detail.value;
    if (this.data.inputValue === "" || this.data.inputValue === null) {
      //清除输入框后就不是搜索并且立即重新加载数据
      //重置数据
      this.setData({
        isSearch: false,
        listData: [],
        loading: false,
        loadingComplete: false,
        currPage: 1,
        pageSize: 10,
      });
      this.getInfo();
    }
  },


  /**
   * 复制微信昵称
   */
  v_contactTA_click: function(e) {
    var nickName = e.currentTarget.dataset.index.nickName;
    if (nickName == '') {
      wx.showToast({
        title: "微信名为空",
        icon: "none"
      });
      return;
    }
    wx.setClipboardData({
      data: nickName,
      success: function(res) {
        wx.getClipboardData({
          success: function(res) {
            console.log(res.data) // data
          }
        })
      }
    });

  },



  /**
   * 网络请求
   */
  getInfo: function() {
    //正在(loading或者已经把所有数据加载完毕)和不是搜索 就不让加载
    if ((this.data.loading || this.data.loadingComplete) && !this.data.isSearch) {
      console.log("正在加载中，阻止再次加载");
      return;
    }
    console.log("正在加载中... currPage:" + this.data.currPage + " ,queryStr:" + this.data.inputValue);
    //展开相对应状态
    this.setData({
      loading: true,
      loadingComplete: false
    });

    console.log(this.data.inputValue);
    var reqTask = wx.request({
      url: wx.db.url('stat/customerList'),
      data: {
        "page": this.data.currPage,
        "pageSize": this.data.pageSize,
        "queryStr": this.data.inputValue
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
        this.setData({
          loading: false
        });
      }
    });
  },

})