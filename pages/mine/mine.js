//获取应用实例
const app = getApp()

Page({
  data: {
    isLogin: -1,
    isPull: true
  },

  onLoad: function(e) {
    var that = this;
    // 获取窗口高度
    wx.getSystemInfo({
      success: (res) => {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR;

        console.log(calc)
        that.setData({
          pixelRatio: res.pixelRatio,
          // winHeight: res.windowHeight,
          windowWidth: res.windowWidth,
          winHeight: calc,

        })

      },
    })

    // app.globalData.isLogin = 1
    // app.globalData.userInfo = e.detail.userInfo

  },
  onShow(e) {
    var that = this;

    if (app.globalData.isRegster) {
      that.setData({
        userInfo: app.globalData.userInfo,
        isLogin: app.globalData.isLogin
      })
    }
    console.log(app.globalData.unionId + "unionId");
    if (app.globalData.unionId != undefined) {
      that.userInfoAmount(app.globalData.unionId);
    } else {
      wx.stopPullDownRefresh()
    }

    // if (app.globalData.isLogin==1){
    //   that.code();
    // }
  },
  //刷新
  onPullDownRefresh: function() {
    var that = this;
    that.data.isPull = false;
    // if (app.globalData.isRegster) {
    //   that.setData({
    //     userInfo: app.globalData.userInfo,
    //     isLogin: app.globalData.isLogin
    //   })
    // }

    // if (app.globalData.unionId != undefined) {
    //   that.userInfoAmount(app.globalData.unionId);
    // }
    if (that.data.isLogin == 1) {
      wx.getUserInfo({
        success: function(res) {

          that.code(res.iv, res.encryptedData);
        }

      })
    }
  },
  //去完善
  onToPerfect(e) {
    var that = this;
    wx.navigateTo({
      url: '../register/register',
    })
  },
  //提现
  onWithdraw(e) {
    wx.showToast({
      title: '暂未开发',
      icon: "none"
    })
  },
  //我的收入
  onMyIncome(e) {
    var that = this;
    wx.navigateTo({
      url: '../myIncome/myIncome',
    })
  },
  //发卡密码
  onCardPwd(e) {
    var that = this;
    wx.navigateTo({
      url: '../cardPassword/cardPassword',
    })
  },
  //我要推荐
  onRecommend() {

  },
  //我要发卡
  onFaKa() {

  },
  //我的推荐
  onMyTuiJian(e) {
    var that = this;
    wx.navigateTo({
      url: '../myRecommend/myRecommend',
    })

  },
  onAgency(e) {
    var that = this;
    wx.navigateTo({
      url: '../agency/agency',
    })
  },
  onMyVip(e) {
    var that = this;
    wx.navigateTo({
      url: '../my_vip/my_vip',
    })
  },
  //分享
  onShare(e) {
    var that = this;
    wx.navigateTo({
      url: '../share/share',
    })
  },

  //登录
  onGotUserInfo(e) {
    var that = this;

    // 获取用户信息

    console.log(e.detail)

    that.code(e.detail.iv, e.detail.encryptedData);
    that.data.userInfo = e.detail.userInfo;
    //  that.data.iv = e.detail.iv;
    // that.data.encryptedData = e.detail.encryptedData;
    app.globalData.iv = e.detail.iv;
    app.globalData.encryptedData = e.detail.encryptedData;
    console.log(e.detail.encryptedData);


  },

  //微信登录
  code: function(iv, encryptedData) {
    var that = this
    wx.login({
      success(res) {
        if (that.data.isPull) {
          wx.showLoading({
            title: '登录中...'

          })
        }

        that.hqCode(res.code, iv, encryptedData);
        console.log(res.code)
      }
    })
  },
  //获取code
  hqCode(code, iv, encryptedData) {
    var that = this;

    if (code) {
      wx.request({
        url: "http://henglinjk.com/henglin_mini/weChat/jscode2session.do",
        method: 'POST',
        data: {
          code: code,
          iv: iv,
          encryptedData: encryptedData
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded' //默认值（post）
        },
        complete() {

        },
        success(res) {
          wx.hideLoading();
          wx.stopPullDownRefresh();
          switch (res.data.msg) {
            case 0:
              console.log("暂无数据");
              wx.showToast({
                title: '暂无数据',
                icon: 'none',
                scroll: -1
              })
              break;
            case 1:
              //获取用户等级
              console.log(res.data.unionId + "unionId");
              if (res.data.unionId != undefined) {
                app.globalData.level = res.data.level;
                app.globalData.unionId = res.data.unionId;

                //获取积分和等级
                that.userInfoAmount(res.data.unionId);
                that.setData({
                  userInfo: that.data.userInfo,
                  isLogin: 1,
                })
              } else {
                wx.getUserInfo({
                  success: function(res) {
                    that.code(res.iv, res.encryptedData);

                  }
                })
              }

              break;
            case -1:
              wx.showToast({
                title: '登录失败，请重试',
                icon: 'none',
                scroll: -1
              })
              console.log("code为空");
              break;
            default:
              wx.showToast({
                title: '登录失败，请重试',
                icon: 'none',
                scroll: -1
              })
              console.log("err");
              break;
          }

        },
        fail() {
          console.log("微信登录失败");
          wx.hideLoading();
          wx.stopPullDownRefresh();
        }

      })

    }
  },

  //获取积分 等级
  userInfoAmount(unionId) {
    var that = this;

    wx.request({
      url: app.globalData.hengUrl + "userInfo/selUserInfoAmount.do",
      method: 'POST',
      data: {
        unionId: unionId,

      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //默认值（post）
      },
      complete() {

      },
      success(res) {
        wx.stopPullDownRefresh();
        //获取用户等级
        app.globalData.level = res.data.level;

        that.setData({
          recommendAmount: res.data.recommendAmount,
          agentAmount: res.data.agentAmount,
          level: res.data.level,
          realName: res.data.realName,
          isExecuteDirector: res.data.isExecuteDirector
        })
        console.log(res.data.isExecuteDirector);
        switch (res.data.msg) {
          case 0:
            console.log("暂无数据");
            wx.showToast({
              title: '暂无数据',
              icon: 'none',
              scroll: -1
            })
            break;
          case 1:

            break;
          case -1:
            wx.showToast({
              title: '积分获取失败',
              icon: 'none',
              scroll: -1
            })
            console.log("code为空");
            break;
          default:
            wx.showToast({
              title: '积分获取失败',
              icon: 'none',
              scroll: -1
            })
            console.log("err");
            break;
        }
      },
      fail() {
        console.log("积分获取失败");
      }

    })

  },
})