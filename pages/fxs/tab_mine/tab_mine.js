Page({

  /**
   * 页面的初始数据
   */
  data: {
    showMainPage: false,
    showLoading: false,
    topBg: "/assets/imgs/fxs_tab_mine_top_bg.png",
    topBgDefaultPortrait: "/assets/imgs/userDefaultHead.png",
    topBgDefaultName: "Name",
    topBgStar: "/assets/imgs/fxs_tab_mine_top_star.png",
    topBgTip: "/assets/imgs/fxs_tab_mine_top_tip.png",
    propertyEye: true,
    propertyEyeOpen: "/assets/imgs/fxs_tab_mine_property_eye_open.png",
    propertyEyeClose: "/assets/imgs/fxs_tab_mine_property_eye_close.png",
    bottomGeneralize: "/assets/imgs/fxs_tab_mine_generalize.png",
    bottomInvite: "/assets/imgs/fxs_tab_mine_invite.png",
    bottomDetail: "/assets/imgs/fxs_tab_mine_detail.png",
    bottomWithdrawRecord: "/assets/imgs/fxs_tab_mine_withdraw_records.png",


    //user/info 接口数据
    userInfo: {
      //角色ID ADMIN("0", "管理员"),CUSTOMER("1", "普通客户"),SELL("2", "销售员"),DISTRIBUTOR("3", "分销商");
      "roleId": "",
      "star": 0, //星级
      "commission": "", //佣金
      "isInActivity": false, //是否参与限时任务奖励
      "remainTime": 0, //限时任务剩余时间（单位：S）
      "activityLevels": [ //活动各级销售额
      ],
      "nextActivityReward": "", //下一级奖励销售额
      "balance": "", //账户余额
      "totalIncome": "", //累计收益
      "toSettelIncome": "", //累计待结算收益
      "totalOrderCount": null, //累计订单
      "totalCustomer": null, //累计客户
      "todayIncome": "", //今日收益
      "todayOrderCount": null, //今日订单
      "todayCustomer": null, //今日新增客户
      "sellerTotalIncome": "", //从销售员获取的累计收益
      "sellerToSettleIncome": "", //从销售员获取待结算收益
      "sellerOrderCount": null, //销售员推广的订单
      "sellerCount": null, //累计销售员
    },
    nextActivityRewardText: "", //距离下一级还差0元




    timer: '', //定时器名字
    countDownNum: 0, //倒计时初始值
    countDownText: "",
    DialogData: {},

    //==============================================底部弹框
    anticipateEarnbg: "/assets/imgs/fxs_exclusive_recommend_anticipate_earn.png",
    sheetDialogHidden: true,
    sheetDialogMove: false,
    sheetDialogBgOne: "/assets/imgs/fxs_exclusive_recommend_sheetDialog_one.png",
    sheetDialogBgTwo: "/assets/imgs/fxs_exclusive_recommend_sheetDialog_two.png",
    sheetDialogBgThree: "/assets/imgs/fxs_exclusive_recommend_sheetDialog_three.png",
    DialogOneHidden: true,
    DialogOneMove: false,
    DialogOne_dismissBg: "/assets/imgs/fxs_exclusive_recommend_dismiss.png",
    DialogOne_print: "/assets/imgs/fxs_exclusive_recommend_print.png",
    DialogTwoHidden: true,
    DialogTwoMove: false,
    DialogxcxmUrl: "",
    DialogInviteCode: "",


    it: "", //为1 就展示申请销售员  如果不为1  就展示申请成为分销商，前提是用户角色为1
    //申请成为分销商图片链接
    //userInfo.roleId是1
    applyFXS_bg: "https://agent-test-app.oss-cn-beijing.aliyuncs.com/ApplyToDistributor.png",
    //申请成为销售员图片链接
    //userInfo.roleId是1，且是通过分享二维码进来 , iT:""
    applySXY_bg: "https://agent-test-app.oss-cn-beijing.aliyuncs.com/ApplyToSalesperson.png",
    longBG: "",
    applyButtonText: "",



    indicatorCurrentValue: "",
    indicatorBottom: [],
    indicatorPercent: 0.0, //黄色部分占整个长度的百分比
    smallIndex: 0,
    bigIndex: 0,

  },


  /**
   * 申请成为分销商或者销售员
   */
  v_applyFXS_bt: function() {
    if (this.data.userInfo.hasApply) {
      //正在申请中
      return;
    }
    //wx.roleId == '1'是普通用户，可以成为销售员或分销商
    //wx.iT 。0是推广商品，1是邀请好友，2是领取礼品卡
    if (wx.roleId == '1') {
      if (wx.iT == '1') {
        //申请成为销售员
      } else {
        //申请成为分销商
      }
      let data = {
        "it": this.data.it
      };
      var jsonDate = JSON.stringify(data)
      console.log(jsonDate);
      wx.navigateTo({
        url: "../apply_fxs/apply_fxs?date=" + jsonDate,
      })
    }
  },

  /**
   * 限时任务奖励
   */
  v_limitTime_task_award_Click: function() {
    /* wx.navigateTo({
       url: "../limitTimeTaskAward/limitTimeTaskAward"
     })*/
  },


  /**
   * 我的资产 
   * 睁眼，闭眼
   */
  iv_property_eye_click: function() {
    this.setData({
      propertyEye: !this.data.propertyEye
    })
  },

  /**
   * 提现
   */
  bt_v_property_tipClick: function() {
    wx.navigateTo({
      url: "../withdraw/withdraw"
    })

  },

  /**
   * 我的收益
   */
  v_earings_statistics_onClick: function() {
    wx.navigateTo({
      url: "../earings_statistics/earings_statistics"
    })
  },


  /**
   * 累计订单
   * 订单统计
   */
  v_earningsOrder_click: function() {
    wx.navigateTo({
      url: "../orders_statistics/orders_statistics"
    })
  },


  /**
   * 累计客户
   * 客户统计
   */
  v_earningsClient_click: function() {
    wx.navigateTo({
      url: "../clients_statistics/clients_statistics"
    })
  },

  /**
   * 我的销售员
   */
  v_salesman_onClick: function() {
    wx.navigateTo({
      url: "../salesman/salesman"
    })
  },

  /**
   * 推广商品
   */
  v_generalize_onClick: function() {
    wx.navigateTo({
      url: "../generalize/generalize"
    })
  },

  /**
   * 邀请好友
   * 弹框
   */
  v_invite_onClick: function() {
    console.log("v_invite_onClick");
    this.setData({
      sheetDialogHidden: false
    })
  },

  /**
   * 收支明细
   */
  v_income_expenses_onClick: function() {
    wx.navigateTo({
      url: "../income_expenses/income_expenses"
    })
  },

  /**
   * 提现记录
   */
  v_withdraw_record_onClick: function() {
    wx.navigateTo({
      url: "../withdraw_record/withdraw_record"
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    //每次可见刷新页面
    let that = this;
    that.getInfo();
    console.log(wx.iT+" , "+wx.roleId);
  },

  /**
   * 页面被隐藏
   */
  onHide: function() {
    clearInterval(this.data.timer);
  },

  /**
   * 页面被卸载
   */
  onUnload: function() {
    clearInterval(this.data.timer);
  },


  /**
   * onload->onshow-onready
   * 网络请求
   * 获取用户中心
   */
  onLoad: function() {},


  getInfo: function() {
    let t = this;
    var name = wx.nickName;
    var portrait = wx.headImgUrl;
    //刷新上面的数据
    this.setData({
      topBgDefaultName: name,
      topBgDefaultPortrait: portrait
    });
    console.log(name);
    console.log(portrait);
    var reqTask = wx.request({
      url: wx.db.url('user/info'),
      data: {},
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
            this.data.userInfo = result.data.data;
            this.data.countDownNum = result.data.remainTime;
            // result.data.data.currentActivityValue="19.9";
            if (result.data.data.activityLevels.length > 0) {
              result.data.data.activityLevels.unshift("0");
              let arr1 = new Array(this.data.userInfo.activityLevels.length);
              let smallIndex = 0;
              let bigIndex = 0;
              let currentActivityValue = parseFloat(result.data.data.currentActivityValue);
              let equal = false;
              for (let i = 0; i < this.data.userInfo.activityLevels.length; i++) {
                let a = parseFloat(result.data.data.activityLevels[i]);
                if (currentActivityValue == a) {
                  //正好是当前的一个点
                  smallIndex = i;
                  bigIndex = i;
                  equal = true;
                } else if (a > currentActivityValue) {
                  //在a之前
                  if (!equal) {
                    bigIndex = smallIndex + 1;
                  }
                } else if (a < currentActivityValue) {
                  //在a之后
                  smallIndex = i;
                  bigIndex = i;
                }
                if (a >= 10000) {
                  var b = '';
                  if (this.isInteger(a / 10000)) {
                    b = a / 10000 + "万";
                  } else {
                    b = (a / 10000).toFixed(2) + '万'
                  }
                  arr1[i] = b;
                } else {
                  arr1[i] = a;
                }
              }
              this.data.indicatorBottom = arr1;
              this.data.indicatorCurrentValue = "￥" + result.data.data.currentActivityValue; //当前多少钱
              if (smallIndex == bigIndex) {
                //this.data.indicatorPercent = smallIndex / (this.data.indicatorBottom.length - 1);
                //整个长度是596rpx，
                //每一个圆直径就是20，一共this.data.indicatorBottom.length个圆，圆的总长度是this.data.indicatorBottom.length*20
                //所有直线长度就是596-this.data.indicatorBottom.length*20，
                //每一个直线长度就是(596-this.data.indicatorBottom.length*20)/this.data.indicatorBottom.length-1

                //每一个圆的直径占比是20/596
                //每一个直线长度占比是(596-this.data.indicatorBottom.length*20)/（this.data.indicatorBottom.length-1）*596

                let rateC = 20 / 596;
                let rateL = (596 - this.data.indicatorBottom.length * 20) / ((this.data.indicatorBottom.length - 1) * 596);
                if (smallIndex == 0) {
                  this.data.indicatorPercent = smallIndex * rateL + (smallIndex + 0) * rateC;
                } else {
                  this.data.indicatorPercent = smallIndex * rateL + (smallIndex + 1) * rateC;
                }
              } else {
                let smallPercent = smallIndex / (this.data.indicatorBottom.length - 1);
                let indexGap = parseFloat(this.data.userInfo.activityLevels[bigIndex] - this.data.userInfo.activityLevels[smallIndex]);
                //let gapPercent = 1 - parseFloat(result.data.data.nextActivityReward) / indexGap;
                let gapPercent = (currentActivityValue - this.data.userInfo.activityLevels[smallIndex]) / indexGap
                this.data.indicatorPercent = smallPercent + (1 / (this.data.indicatorBottom.length - 1)) * gapPercent;
              }
              this.data.smallIndex = smallIndex;
              this.data.bigIndex = bigIndex;

             // console.log(this.data.indicatorBottom);
             // console.log(smallIndex + " , " + bigIndex);
              //console.log(this.data.indicatorPercent);
              //console.log(this.data.indicatorCurrentValue);

              this.drawIndicator();
              this.data.nextActivityRewardText = "距离下一级还差" + result.data.data.nextActivityReward + "元";
            }


            this.data.countDownNum = result.data.data.remainTime;
            //普通客户，且是通过分享二维码进来 , iT:""
            wx.roleId = result.data.data.roleId;
            //console.log(result.data.data.roleId)
            this.data.it = wx.iT; //iT==1就是销售员，其它就是分销商

            //普通客户
            if (wx.roleId == '1') {
              if (this.data.it == '1') {
                this.data.longBG = this.data.applyFXS_bg;
                if (result.data.data.hasApply) {
                  //申请中
                  this.data.applyButtonText = "销售员正在申请中..."
                } else {
                  this.data.applyButtonText = "申请成为销售员"
                }
                //用户不是通过邀请链接进来的wx.iT为空
              } else {
                this.data.longBG = this.data.applySXY_bg;
                if (result.data.data.hasApply) {
                  //申请中
                  this.data.applyButtonText = "分销商正在申请中..."
                } else {
                  this.data.applyButtonText = "申请成为分销商"
                }
              }
            } else if (wx.roleId == '2') {
              //销售员
              this.data.longBG = '';
            } else if (wx.roleId == '3') {
              //分销商
              this.data.longBG = '';
            }
            //console.log(wx.iT, this.data.it);
            this.data.showMainPage = true;
            this.setData(this.data);
            console.log(JSON.stringify(this.data.userInfo));
            if (result.data.data.isInActivity) {
              //有活动就倒计时
              //this.countDown();
            }
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


  timeStamp: function(second_time) {
    var time = parseInt(second_time) + "";
    if (parseInt(second_time) > 60) {
      var second = parseInt(second_time) % 60;
      var min = parseInt(second_time / 60);
      time = min + ":" + second + "";
      if (min > 60) {
        min = parseInt(second_time / 60) % 60;
        var hour = parseInt(parseInt(second_time / 60) / 60);
        time = hour + ":" + min + ":" + second + "";
        if (hour > 24) {
          hour = parseInt(parseInt(second_time / 60) / 60) % 24;
          var day = parseInt(parseInt(parseInt(second_time / 60) / 60) / 24);
          time = day + ":" + hour + ":" + min + ":" + second + "";
        }
      }
    }
    //console.log(time);
    this.setData({
      countDownText: time,
    });
    return time;
  },


  /**
   * 每隔一秒运行一次
   */
  countDown: function() {
    let that = this;
    let countDownNum = that.data.countDownNum;
    that.data.timer = setInterval(function() {
      if (countDownNum == 0) {
        clearInterval(that.data.timer);
      } else {
        countDownNum--;
        that.timeStamp(countDownNum);
        that.setData({
          countDownNum: countDownNum
        });
      }
    }, 1000)
  },















  //========================================================底部弹框

  /**
   * 弹出分享框
   */
  v_share: function(e) {
    console.log("弹出分享框");
    this.data.DialogData = e.currentTarget.dataset.index;
    console.log(JSON.stringify(this.data.DialogData));
    this.setData({
      sheetDialogHidden: false
    })
  },

  /**
   * 底部弹框
   * 非内容部分  阴影点击事件
   */
  v_sheetDialog_click: function() {
    console.log("阴影点击事件");
    this.setData({
      sheetDialogHidden: true,
    })
  },


  /**
   * 底部弹框
   * 取消按钮
   */
  v_sheetDialogContent_cancel_click: function() {
    console.log("取消按钮");
    this.setData({
      sheetDialogHidden: true,
    })
  },

  /**
   * 底部弹框
   * 小程序码 点击事件
   */
  v_sheetDialogContentOneOne_click: function() {
    console.log("小程序码");
    this.xcxm(1);
  },

  /**
   * 底部弹框
   * 生成商品海报 点击事件
   */
  v_sheetDialogContentOneTwo_click: function() {
    console.log("生成商品海报");
    wx.navigateTo({
      url: "../invite/invite"
    });
    this.setData({
      sheetDialogHidden: true,
    })
  },

  /**
   * 底部弹框
   * 复制链接 点击事件
   */
  v_sheetDialogContentOneThree_click: function() {
    console.log("复制链接");
    this.getInveteCode();
    this.setData({
      sheetDialogHidden: true
    })
  },


  /**
   * 小程序码弹框
   * 非内容部分  阴影点击事件
   */
  v_DialogOne_click: function() {
    console.log("v_DialogOne_click");
    this.setData({
      DialogOneHidden: true,
      DialogxcxmUrl: "",
    })
  },

  /**
   * 小程序码弹框
   * 内容部分 长按事件
   */
  v_DialogOneContent_lonePress: function() {
    console.log("小程序码 长按事件");
    this.savePicToAlbum();
  },


  /**
   * 生成海报商品弹框
   * 非内容部分  阴影点击事件
   */
  v_DialogTwo_click: function() {
    console.log("生成海报商品弹框 阴影点击事件");
    this.setData({
      DialogTwoHidden: true,
      DialogxcxmUrl: "",
    })
  },

  /**
   * 生成海报商品弹框
   * 内容部分 长按事件
   */
  v_DialogTwoContent_lonePress: function() {
    console.log("生成海报商品弹框 长按");
  },


  /**
   * 获取小程序码  base64
   */
  xcxm: function(type) {
    this.setData({
      showLoading: true,
    })
    var reqTask = wx.request({
      url: wx.db.url('promote/invite'),
      data: {
        "page": "pages/list/list", //小程序码全部跳转到首页
        // "parentId": "",//此页面没有parentID
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
            //this.data.DialogxcxmUrl =this.getBase64ImageUrl(result.data.data);
            //this.setData(this.data);
            //弹框
            console.log(type);
            console.log(JSON.stringify(this.data.DialogData));
            if (type == 1) {
              //小程序码
              this.setData({
                sheetDialogHidden: true,
                DialogOneHidden: false,
                DialogxcxmUrl: this.getBase64ImageUrl(result.data.data),
                DialogData: this.data.DialogData
              })
            } else if (type == 2) {
              //生成商品海报
              this.setData({
                sheetDialogHidden: true,
                DialogTwoHidden: false,
                DialogxcxmUrl: this.getBase64ImageUrl(result.data.data),
                DialogData: this.data.DialogData
              })
            }

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
        this.setData({
          showLoading: false,
        })
      }
    });
  },


  //把base64转换成图片
  getBase64ImageUrl: function(data) {
    /// 获取到base64Data
    var base64Data = data;
    /// 通过微信小程序自带方法将base64转为二进制去除特殊符号，再转回base64
    base64Data = wx.arrayBufferToBase64(wx.base64ToArrayBuffer(base64Data));
    /// 拼接请求头，data格式可以为image/png或者image/jpeg等，看需求
    const base64ImgUrl = "data:image/png;base64," + base64Data;
    console.log(base64ImgUrl);
    return base64ImgUrl;
  },


  /**
   * 保存图片到相册
   */
  savePicToAlbum: function() {
    let that = this;
    //判断用户是否授权"保存到相册"
    wx.getSetting({
      success(res) {
        //没有权限，发起授权
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() { //用户允许授权，保存图片到相册
              that.savePhoto();
            },
            fail() { //用户点击拒绝授权，跳转到设置页，引导用户授权
              wx.openSetting({
                success() {
                  wx.authorize({
                    scope: 'scope.writePhotosAlbum',
                    success() {
                      that.savePhoto();
                    }
                  })
                }
              })
            }
          })
        } else { //用户已授权，保存到相册
          that.savePhoto()
        }
      }
    })
  },


  //保存图片到相册，提示保存成功
  savePhoto: function(e) {
    // let src = e.currentTarget.dataset.src;
    console.log(this.data.DialogxcxmUrl);
    //console.log(src);
    var aa = wx.getFileSystemManager();
    aa.writeFile({
      filePath: wx.env.USER_DATA_PATH + '/PATRIZIA PEPE.png',
      data: this.data.DialogxcxmUrl.slice(22),
      encoding: 'base64',
      success: res => {
        wx.saveImageToPhotosAlbum({
          filePath: wx.env.USER_DATA_PATH + '/PATRIZIA PEPE.png',
          success: function(res) {
            wx.showToast({
              title: '保存成功',
              icon: "success",
              duration: 1000
            });

          },
          fail: function(err) {
            wx.showToast({
              title: '保存失败',
              icon: "none",
              duration: 1000
            })
          },
          complete: () => {
            this.setData({
              DialogOneHidden: true,
              DialogTwoHidden: true,
            });
          }
        })

      },
      fail: err => {}
    })
  },


  getInveteCode: function() {
    var reqTask = wx.request({
      url: wx.db.url('promote/getInviteCode'),
      data: {},
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
              DialogInviteCode: result.data.data
            });
            wx.showToast({
              title: '复制链接成功',
              icon: "none"
            })
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
      }
    });
  },

  /**
   * 用户分享自定义
   */
  onShareAppMessage: function(res) {
    //iT=1是申请销售员，当前用户状态时分销商
    //switchTab是分享出去后，其它用户打开首页后里面跳转到这个页面,2就是第三个tab
    console.log("iCode=" + wx.iCode);
    return {
      title: `邀请好友`,
      path: `/pages/list/list?iCode=${wx.iCode}&iT=1`,
      imageUrl: this.data.applyFXS_bg, //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径。支持PNG及JPG。显示图片长宽比是 5:4。
    }
  },

  /**
   * 判断是不是整数
   */
  isInteger: function(obj) {
    return typeof obj === 'number' && obj % 1 === 0
  },



  drawIndicator: function() {
    let that = this;
    wx.getSystemInfo({
      success: function(res) {
        let rpx = res.windowWidth / 375;
        const ctx = wx.createCanvasContext("myCanvas");
        ctx.clearRect(0, 0, 298 * that.data.indicatorPercent * rpx, 10 * rpx);
        ctx.setFillStyle('#FFDE00');
        that.setData({
          //smallIndex: 3,
          //bigIndex: 3,
          //indicatorPercent:1,
        });
        if (that.data.bigIndex > 0) {
          let len = that.data.indicatorBottom.length;
          let perWidth = (298 - 10 * len) / (len - 1);
          for (let i = 0; i < that.data.bigIndex; i++) {
            let x = (10 * i + 10 + perWidth * i) * rpx;
            let height = 4 * rpx;
            let width = perWidth * rpx;
            ctx.fillRect(x, 3 * rpx, width, height);
            ctx.draw(true);
          }
          for (let i = 0; i < that.data.bigIndex + 1; i++) {
            let width = perWidth * rpx;
            let x = 5 * rpx + i * 10 * rpx + width * i;
            ctx.arc(x, 5 * rpx, 5 * rpx, 0, 2 * Math.PI);
            ctx.fill();
            ctx.draw(true);
          }
        }
      },
    })
  },


})