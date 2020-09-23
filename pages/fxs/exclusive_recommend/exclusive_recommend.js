Page({

  /**
   * 页面的初始数据
   */
  data: {
    showLoading: false,
    listData: [],


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
    DialogData: {},
    DialogxcxmUrl: "",
    DialogxcxmUrlBase64: "",
    DialogInviteCode: "",
    rpx: 1,
    DialogxcxmUrlBase64Path: "",


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
   * 监听下拉动作
   */
  onPullDownRefresh: function() {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    this.getInfo(true);
  },

  /**
   * 上拉触底事件
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

    var reqTask = wx.request({
      url: wx.db.url('promote/products'),
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


  /**
   * 弹出分享框
   */
  v_share: function(e) {
    console.log("v_share");
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
    console.log("v_sheetDialog_click");
    this.setData({
      sheetDialogHidden: true,
    })
  },


  /**
   * 底部弹框
   * 取消按钮
   */
  v_sheetDialogContent_cancel_click: function() {
    console.log("v_sheetDialogContent_cancel_click");
    this.setData({
      sheetDialogHidden: true,
    })
  },

  /**
   * 底部弹框
   * 小程序码 点击事件
   */
  v_sheetDialogContentOneOne_click: function() {
    console.log("v_sheetDialogContentOneOne_click");
    this.xcxm(1);

  },

  /**
   * 底部弹框
   * 生成商品海报 点击事件
   */
  v_sheetDialogContentOneTwo_click: function() {
    console.log("v_sheetDialogContentOneTwo_click");
    this.xcxm(2);
  },

  /**
   * 底部弹框
   * 复制链接 点击事件
   */
  v_sheetDialogContentOneThree_click: function() {
    console.log("v_sheetDialogContentOneThree_click");
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
    console.log("小程序码弹框 长按图片保存至相册");
    this.savePicToAlbum();
  },


  /**
   * 生成海报商品弹框
   * 非内容部分  阴影点击事件
   */
  v_DialogTwo_click: function() {
    console.log("v_DialogTwo_click");
    this.deleteImage();
    this.setData({
      DialogTwoHidden: true,
      DialogxcxmUrl: "",
      DialogxcxmUrlBase64: "",
      DialogxcxmUrlBase64Path: "",
    });
  },

  /**
   * 生成海报商品弹框
   * 内容部分 长按事件
   */
  v_DialogTwoContent_lonePress: function() {
    console.log("生成海报商品 长按图片保存至相册");
    //把当前画布指定区域的内容导出生成指定大小的图片。在 draw() 回调里调用该方法才能保证图片导出成功。
    //指定的画布区域的左上角横坐标，指定的画布区域的左上角纵坐标，指定的画布区域的宽度,指定的画布区域的高度，输出的图片的宽度，输出的图片的高度
    let rpx = this.data.rpx;
    let that = this;
    //console.log(rpx);
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 264 * rpx,
      height: 420 * rpx,
      destWidth: 264 * rpx*3,
      destHeight: 420 * rpx*3,
      canvasId: 'pic',
      success(res) {
        //临时路径
        //console.log(res.tempFilePath);
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            wx.showToast({
              title: '保存成功',
            })
            that.deleteImage();
            that.setData({
              DialogTwoHidden: true,
              DialogxcxmUrl: "",
              DialogxcxmUrlBase64: "",
              DialogxcxmUrlBase64Path: "",
            });
          },
          fail(res) {
            wx.showToast({
              title: '保存失败',
            })
            that.deleteImage();
            that.setData({
              DialogTwoHidden: true,
              DialogxcxmUrl: "",
              DialogxcxmUrlBase64: "",
              DialogxcxmUrlBase64Path: "",
            });
          }
        });
      },
      fail(res) {
        console.log(res);
        wx.showToast({
          title: '保存失败',
        });
        that.deleteImage();
        that.setData({
          DialogTwoHidden: true,
          DialogxcxmUrl: "",
          DialogxcxmUrlBase64: "",
          DialogxcxmUrlBase64Path: "",
        });
      }
    });
  },


  /**
   * 获取小程序码  base64
   */
  xcxm: function(type) {
    this.setData({
      showLoading: true,
      DialogxcxmUrl: "",
      DialogxcxmUrlBase64: "",
    })
    console.log(this.data.DialogData.parentId)
    var reqTask = wx.request({
      url: wx.db.url('promote/product'),
      data: {
        "page": "pages/list/list", //小程序码全部跳转到首页
        "pId": this.data.DialogData.parentId
      },
      header: {
        'content-type': 'application/json',
        Authorization: `Bearer ${wx.RiceUserToken}`
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (result) => {
        //console.log(JSON.stringify(result));
        var statusCode = result.statusCode; //statusCode为200表示接口请求成功
        var code = result.data.code; //code为0表示获取数据成功
        if (statusCode == 200) {
          if (code == 0) {
            //this.data.DialogxcxmUrl =this.getBase64ImageUrl(result.data.data);
            //this.setData(this.data);
            //弹框
            //console.log(type);
            //console.log(JSON.stringify(this.data.DialogData));
            if (type == 1) {
              //小程序码
              this.setData({
                sheetDialogHidden: true,
                DialogOneHidden: false,
                DialogxcxmUrl: this.getBase64ImageUrl(result.data.data),
                DialogData: this.data.DialogData,
                DialogxcxmUrlBase64: result.data.data,
                showLoading: false,
              })
            } else if (type == 2) {
              //生成商品海报
              this.setData({
                sheetDialogHidden: true,
                DialogTwoHidden: false,
                DialogxcxmUrl: this.getBase64ImageUrl(result.data.data),
                DialogData: this.data.DialogData,
                DialogxcxmUrlBase64: result.data.data,
              })
              //绘制canvas
              this.drawBg();
            }
          } else {
            console.log("statusCode == 200 && code != 0");
            wx.showToast({
              title: result.data.msg,
              icon: "none"
            });
            this.setData({
              showLoading: false,
            });
          }
        } else {
          console.log("statusCode != 200");
          wx.showToast({
            title: result.errMsg,
            icon: "none"
          });
          this.setData({
            showLoading: false,
          });
        }
      },

      fail: () => {
        wx.showToast({
          title: result.errMsg,
          icon: "none"
        });
        this.setData({
          showLoading: false,
        });
      },
      complete: () => {
        console.log("complete");
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
    //console.log(base64ImgUrl);
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
          console.log("res.authSetting");
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
          that.savePhoto();
        }
      }
    })
  },


  //保存图片到相册，提示保存成功
  savePhoto: function(e) {
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
    // 不管是分销商 还是销售员  推广商品 和 专属分享  这两个地方分享出去的 都是申请成为分销商 。
    // 只有分销商下面的邀请销售员  这一个地方 分享出去的 才是申请成为销售员    就这一个地方
    //iT==1就是销售员，其它就是分销商
    console.log("iCode=" + wx.iCode);
    /*let IT = '0';
    if (wx.roleId == '3') {
      IT = '1'
    }
    console.log(IT);*/
    return {
      title: `${this.data.DialogData.productName}`,
      path: `/pages/list/list?pId=${this.data.DialogData.parentId}&pageId=exclusive_recommend&iCode=${wx.iCode}&iT=0`,
      imageUrl: `${this.data.DialogData.imgUrl}` //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径。支持PNG及JPG。显示图片长宽比是 5:4。
    }
  },


  //绘制小程序码
  drawCode: function(ctx) {
    let promise = new Promise((resolve, reject) => {
      let filePath = `${wx.env.USER_DATA_PATH}/011010100101`;
      wx.getFileSystemManager().writeFile({
        filePath: filePath,
        data: wx.base64ToArrayBuffer(this.data.DialogxcxmUrlBase64),
        encoding: 'binary',
        success: () => {
          console.log('写入成功, 路径: ', filePath);
          resolve(filePath);
        },
        fail: err => {
          reject('写入失败：', err);
        },
      });
    })
    /** return new Promise((resolve, reject) => {
       promise.then(filePath => {
         ctx.drawImage(filePath, 0, 0, 300, 300);
         ctx.draw(false, () => {
           wx.canvasToTempFilePath({
             canvasId: 'canvas',
             success: res => {
               let saveFilePath = res.tempFilePath;
               /// 删除写入的数据
               wx.getFileSystemManager().unlink({
                 filePath: filePath,
                 success: res => {
                   console.log('删除成功, 路径: ', filePath);
                   resolve(saveFilePath);
                 },
                 fail: err => {
                   reject('删除失败：', err);
                 }
               })
             },
             fail: err => {
               reject('保存图片到本地失败：', err);
             }
           })
         })
       }, err => {
         reject(err);
       })
     }) */
  },


  //绘制海报
  drawBg: function() {
    let that = this;
    wx.getSystemInfo({
      success: function(res) {
        let rpx = res.windowWidth / 375;
        that.setData({
          rpx: rpx,
        });
        const ctx = wx.createCanvasContext("pic")
        //绘制背景
        ctx.setFillStyle('#ffffff');
        ctx.fillRect(0, 0, 264 * rpx, 420 * rpx)
        ctx.draw(true);

        //绘制产品图片
        wx.getImageInfo({
          src: that.data.DialogData.imgUrl,
          success(res) {
            ctx.drawImage(res.path, 11 * rpx, 12 * rpx, 242 * rpx, 242 * rpx);
            ctx.draw(true);
            that.setData({
              showLoading: false,
            });
          },
          fail(res) {
            console.log(res)
            that.setData({
              showLoading: false,
            });
          }
        });

        //绘制产品文字
        //文本，绘制文本的左上角 x 坐标位置，绘制文本的左上角 y 坐标位置
        ctx.setFontSize(11);
        ctx.setFillStyle("#666666");
        let text = that.data.DialogData.productName;
        let textLength = that.getTextLength(text, ctx);
        if (264 * rpx > textLength + 20 * rpx) {
          ctx.fillText(text, (264 * rpx - ctx.measureText(text).width) / 2, 275 * rpx);
        } else {
          that.drawText(ctx, text, 10 * rpx, 275 * rpx, 148, 254 * rpx);
        }
        //console.log(264 * rpx + "  , " + textLength);


        //绘制二维码图片
        let promise = new Promise((resolve, reject) => {
          let filePath = `${wx.env.USER_DATA_PATH}/011010100101`;
          that.setData({
            DialogxcxmUrlBase64Path: filePath,
          });
          wx.getFileSystemManager().writeFile({
            filePath: filePath,
            data: wx.base64ToArrayBuffer(that.data.DialogxcxmUrlBase64),
            encoding: 'binary',
            success: () => {
              console.log('写入成功, 路径: ', filePath);
              ctx.drawImage(filePath, 89 * rpx, 295 * rpx, 86 * rpx, 86 * rpx);
              ctx.draw(true);
            },
            fail: err => {
              reject('写入失败：', err);
              that.setData({
                showLoading: false,
              });
            },
          });
        })



        //绘制长按识别二维码文字
        /**ctx.setFontSize(11);
        ctx.setFillStyle("#666666");
        ctx.fillText("长按识别二维码", (264 * rpx - ctx.measureText("长按识别二维码").width) / 2, 400 * rpx);
        ctx.draw(true);*/
      },
    });
  },


  //删除本地图片
  deleteImage: function() {
    let saveFilePath = this.data.DialogxcxmUrlBase64Path;
    /// 删除写入的数据
    wx.getFileSystemManager().unlink({
      filePath: saveFilePath,
      success: res => {
        console.log('删除成功, 路径: ', saveFilePath);
        // resolve(saveFilePath);
      },
      fail: err => {
        //reject('删除失败：', err);
      }
    })
  },



  //文本换行 参数：1、canvas对象，2、文本 3、距离左侧的距离 4、距离顶部的距离 5、6、文本的宽度
  drawText: function(ctx, str, leftWidth, initHeight, titleHeight, canvasWidth) {
    var lineWidth = 0;
    var lastSubStrIndex = 0; //每次开始截取的字符串的索引
    for (let i = 0; i < str.length; i++) {
      lineWidth += ctx.measureText(str[i]).width;
      if (lineWidth > canvasWidth) {
        ctx.fillText(str.substring(lastSubStrIndex, i), leftWidth, initHeight); //绘制截取部分
        initHeight += 16; //16为字体的高度
        lineWidth = 0;
        lastSubStrIndex = i;
        titleHeight += 30;
      }
      if (i == str.length - 1) { //绘制剩余部分
        ctx.fillText(str.substring(lastSubStrIndex, i + 1), leftWidth, initHeight);
      }
    }
    // 标题border-bottom 线距顶部距离
    titleHeight = titleHeight + 10;
    return titleHeight
  },


  //获取文本长度
  getTextLength: function(str, ctx) {
    var lineWidth = 0;
    var lastSubStrIndex = 0; //每次开始截取的字符串的索引
    for (let i = 0; i < str.length; i++) {
      lineWidth += ctx.measureText(str[i]).width;
    }
    return lineWidth;
  },


})