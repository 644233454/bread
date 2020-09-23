Page({

  /**
   * 页面的初始数据
   */
  data: {
    topBg: "/assets/imgs/fxs_limit_time_task_top_bg.png",
    inviteType: "", //邀请类型
    inviteCode: "", //邀请码
    timer: '', //定时器名字
    countDownNum: 0, //倒计时初始值
    countDownText: "",
  },

  
  onLoad:function(){
    this.setData({
      inviteType: 1, //分销商邀请用户给销售员  inviteType =1  。inviteType =0 推广商品 邀请好友。
      inviteCode: wx.iCode
    });
    this.getInfo();
  },


  getInfo: function () {
    let t = this;
    var name = wx.getStorageSync("RiceNickName");
    var portrait = wx.getStorageSync("RiceHeadImgUrl");
    //刷新上面的数据
    this.setData({
      topBgDefaultName: name,
      topBgDefaultPortrait: portrait
    });
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
            result.data.data.activityLevels.unshift("0");
            let index = 0;
            for (let i = 0; i < this.data.userInfo.activityLevels.length; i++) {
              let a = parseFloat(this.data.userInfo.activityLevels[i]);
              if (a == parseFloat(this.data.userInfo.nextActivityReward)) {
                index = i;
                break;
              }
            }
            this.data.nextActivityRewardIndex = index;
            this.data.singleLingWidth = 576 / (index + 1),
              console.log(index)
            let array = new Array(this.data.userInfo.activityLevels.length);
            for (let i = 0; i < this.data.userInfo.activityLevels.length; i++) {
              if (i == index) {
                array[i] = "￥" + this.data.userInfo.nextActivityReward;
              } else {
                array[i] = "";
              }
            }
            this.data.nextActivityReward = array;
            console.log(array);


            this.data.countDownNum = result.data.data.remainTime;
            let idType = result.data.data.roleId;
            if (idType != 2) {
              this.data.isXSY = true;
            };
            this.setData(this.data);

            console.log(JSON.stringify(this.data.userInfo));
            this.countDown();
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


  timeStamp: function (second_time) {
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
      countDownText: "距离结束仅剩 "+time,
    });
    return time;
  },


  /**
   * 每隔一秒运行一次
   */
  countDown: function () {
    let that = this;
    let countDownNum = that.data.countDownNum;
    that.data.timer = setInterval(function () {
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



})
