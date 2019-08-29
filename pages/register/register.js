//index.js
//获取应用实例
const app = getApp()
var util = require("../../utils/util.js");

Page({
  data: {
    idCard: null,
    path: {},
    isVip: false,
    type: -1
  },

  onLoad: function(e) {
    var that = this;
    // that.code();
    //分享 上级的superUnionId
    console.log(e.superUnionId + " " + e.type);
    // that.data.superUnionId = e.superUnionId;
    app.globalData.superUnionId = e.superUnionId;
    that.data.superUnionId = e.superUnionId;
    that.data.type = e.type;
    app.globalData.shareType = e.type;
    console.log(e.type);
    //屏幕高度
    that.setData({
      winHeight: app.globalData.winHeight
    })
    //判断是会员还是代理分享来的

    if (e.type == 1) {
      that.setData({
        isVip: true
      })
    } else if (e.type == 2) {
      that.setData({
        isVip: true
      })
    } else {
      that.setData({
        isVip: false
      })
    }

    //判断是否是分享过来的
    if (e.superUnionId != null) {
      app.globalData.isShare = true;
    } else {
      app.globalData.isShare = false;
    }

  },
  //姓名
  inputName(e) {
    var that = this;
    that.data.realName = e.detail.value;
  },

  // 手机号
  inputPhone(e) {
    var that = this;
    that.data.phone = e.detail.value;
  },

  //密码
  inputPwd(e) {
    var that = this;
    that.data.pwd = e.detail.value;
  },
  //聚焦清空
  focusName() {
    var that = this;
    that.data.realName = undefined;
  },
  //聚焦清空
  focusPhone() {
    var that = this;
    that.data.phone = undefined;
  },
  //聚焦清空
  focusPwd() {
    var that = this;
    that.data.pwd = undefined;
  },
  // //身份证号
  // inputIdcard(e) {
  //   var that = this;
  //   that.data.idCard = e.detail.value;
  // },
  //提交
  onSubmit() {


  },
  //登录
  onGotUserInfo(e) {
    var that = this;

    // 获取用户信息

    console.log(e.detail)
    that.data.iv = e.detail.iv;
    that.data.encryptedData = e.detail.encryptedData;
    console.log(e.detail.iv + "  " + e.detail.encryptedData);
    if (that.data.realName == null) {
      wx.showToast({
        title: '姓名不能为空',
        icon: 'none'
      })
      return;
    }
    if (that.data.phone == null) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none'
      })
      return;
    }
    if (util.isPhoneNum(that.data.phone) == false) {
      wx.showToast({
        title: '手机号不正确',
        icon: 'none'
      })
      return;
    }

    if (that.data.type == 1) {
      if (that.data.pwd == null) {
        wx.showToast({
          title: '密码不能为空',
          icon: 'none'
        })
        return;
      }
      if (that.data.pwd.length < 4) {
        wx.showToast({
          title: '密码长度4-8位',
          icon: 'none'
        })
        return;
      }
      if (that.data.pwd.length > 8) {
        wx.showToast({
          title: '密码长度4-8位',
          icon: 'none'
        })
        return;
      }
    }
    if (that.data.type == 2) {
      if (that.data.pwd == null) {
        wx.showToast({
          title: '密码不能为空',
          icon: 'none'
        })
        return;
      }
      if (that.data.pwd.length < 4) {
        wx.showToast({
          title: '密码长度4-8位',
          icon: 'none'
        })
        return;
      }
      if (that.data.pwd.length > 8) {
        wx.showToast({
          title: '密码长度4-8位',
          icon: 'none'
        })
        return;
      }
    }
    //console.log(that.data.idCard);
    // if (that.data.idCard == null || that.data.idCard == '') {

    // } else {
    //   if (util.isIdcard(that.data.idCard) == false) {
    //     wx.showToast({
    //       title: '身份证格式不正确',
    //       icon: 'none'
    //     })
    //     return;
    //   }
    // }
    // wx.showToast({
    //   title: '提交成功',
    //   icon: 'none'
    // })

    that.code(e.detail.iv, e.detail.encryptedData);
    that.data.userInfo = e.detail.userInfo;
    console.log(that.data.realName + that.data.phone + that.data.sex + that.data.idCard);

    console.log(e.detail.userInfo);
    // wx.getSetting({
    //   success: res => {

    //     // that.setData({
    //     //   isLogin: 1,
    //     //   userInfo: e.detail.userInfo
    //     // })

    //   //  that.data.userInfo = e.detail.userInfo;
    //   //  that.data.wxNickName = e.detail.userInfo.nickName;
    //   //  that.data.sex = e.detail.userInfo.gender;
    //    // that.data.headUrl = e.detail.userInfo.avatarUrl;




    //   }
    // })
  },

  //微信登录
  code: function (iv, encryptedData) {
    var that = this
    wx.login({
      success(res) {

        wx.showLoading({
          title: '登录中...',
        })
        
        that.hqCode(res.code, iv,encryptedData);
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
           console.log(res.data.unionId + "unionId");
            wx.hideLoading();
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
              app.globalData.level = res.data.level;
              that.data.unionId = res.data.unionId
              app.globalData.unionId = res.data.unionId;

              switch (that.data.type) {
                case "0":
                  //分享给会员
                  if (res.data.unionId!=undefined && that.data.superUnionId!=undefined) {
                    that.insVip(that.data.realName, that.data.superUnionId, that.data.phone, res.data.unionId);
                  }else{
                    wx.getUserInfo({
                      success: function (res) {
                        that.code(res.iv, res.encryptedData);

                      }
                    })
                  }
                  break;
                case "1":
                  //分享给代理 
                 
                  if (res.data.unionId!=undefined && that.data.superUnionId!=undefined) {

                    that.insAgent(that.data.phone, that.data.realName, res.data.unionId, that.data.superUnionId, that.data.pwd);
                   
                  } else {
                    wx.getUserInfo({
                      success: function (res) {
                        that.code(res.iv, res.encryptedData);

                      }
                    })
                  }
                  break;
                case "2":
                
                  if (res.data.unionId!=undefined && that.data.superUnionId!=undefined) {
                    //推荐成功
                    that.insRecommend(that.data.superUnionId, that.data.phone, that.data.realName, res.data.unionId, that.data.pwd);
                  } else {
                    wx.getUserInfo({
                      success: function (res) {
                        that.code(res.iv, res.encryptedData);

                      }
                    })
                  }
                  break;
                default:
                  if (res.data.unionId!=undefined) {
                    that.userInfos();
                  } else {
                    wx.getUserInfo({
                      success: function (res) {
                        that.code(res.iv, res.encryptedData);
                      }
                    })
                  }
                  break;
              }

              //填写注册信息
              //   that.insUserInfo(res.data.openid, res.data.unionid, that.data.realName, that.data.sex, that.data.headUrl);

              console.log("请求成功");

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
          // wx.showToast({
          //   title: 'denglu',
          //   icon: 'none',
          //   scroll: -1
          // })
        }

      })
      console.log('登录成功！' + code)
    } else {
      console.log('登录失败！' + errMsg)
    }
    
  },
  //geren 个人信息
  userInfos(e) {
    var that = this;
    //判断是否登陆成功
    app.globalData.isLogin = 1;
    //个人信息
    app.globalData.userInfo = that.data.userInfo

    //判断注册页面
    app.globalData.isRegster=true;

    app.globalData.isShare = false;
    //tab跳转
    wx.switchTab({
      url: '../mine/mine',
    })
  },
  

  //代理注册接口
  insAgent: function(phone, realName, unionId, superUnionId, password) {
    var that = this;
    wx.request({
      url: app.globalData.hengUrl + "userInfo/insAgent.do",
      method: 'POST',
      data: {
        phone: phone,
        realName: realName,
        unionId: unionId,
        superUnionId: superUnionId,
        password: password
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值 
      },
      complete() {

      },
      success(res) {
        switch (res.data.msg) {
          case 0:
            console.log(phone + " " + realName + " " + unionId + " " + superUnionId) + " " + password;
            wx.showToast({
              title: '注册失败',
              icon: 'none',
              scroll: -1
            })
            break;
          case 1:
            console.log("请求成功");
            wx.showToast({
              title: '注册成功',
              icon: 'none',
              scroll: -1
            })
            that.userInfos();
            break;
          case -1:
            console.log("参数为空");
            wx.showToast({
              title: '-1',
              icon: 'none',
              scroll: -1
            })
            break;
          case -2:
            wx.showToast({
              title: '您已经是代理商',
              icon: 'none',
              scroll: -1
            })
            setTimeout(function(){
              that.userInfos();
            },1000)
            
            console.log("已经成为代理商");
            break;
          default:
            wx.showToast({
              title: 'err',
              icon: 'none',
              scroll: -1
            })
            console.log("err");
            break;
        }


      },
      fail() {
        console.log("代理注册失败")
        wx.showToast({
          title: '注册失败',
          icon: 'none',
          scroll: -1
        })
      }

    })
  },
  //会员注册接口
  insVip: function(realName, superUnionId, phone, unionId) {
    var that = this;
    wx.request({
      url: app.globalData.hengUrl + "userInfo/insMeberInfo.do",
      method: 'POST',
      data: {
        realName: realName,
        agentUnionId: superUnionId,
        phone: phone,
        unionId: unionId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值 
      },
      complete() {

      },
      success(res) {
        switch (res.data.msg) {
          case 0:
            console.log("提交失败");
            wx.showToast({
              title: '提交失败',
              icon: 'none',
              scroll: -1
            })
            break;
          case 1:
            that.userInfos();
            console.log("提交成功");
            wx.showToast({
              title: '提交成功',
              icon: 'none',
              scroll: -1
            })
            break;
          case -1:
            console.log("参数为空");
            wx.showToast({
              title: '参数为空',
              icon: 'none',
              scroll: -1
            })
            break;
          case -2:
            console.log("已有可买卡的上级");
            wx.showToast({
              title: '已有买卡上级',
              icon: 'none',
              scroll: -1
            })
            setTimeout(function () {
              that.userInfos();
            }, 1000)

            break;
          default:
            console.log("err");
            break;
        }
      },
      fail() {
        console.log("会员注册失败")
        wx.showToast({
          title: '会员注册失败',
          icon: 'none',
          scroll: -1
        })
      }

    })
  },


  //推荐代理注册
  insRecommend(referrerUnionId, phone, realName, unionId, pwd) {
    var that = this;
    wx.request({
      url: app.globalData.hengUrl + "userInfo/insRecommend.do",
      method: 'POST',
      data: {
        referrerUnionId: referrerUnionId,
        phone: phone,
        realName: realName,
        unionId: unionId,
        password: pwd
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值 
      },
      complete() {

      },
      success(res) {
        switch (res.data.msg) {
          case 0:
            console.log("提交失败");
            wx.showToast({
              title: '提交失败',
              icon: 'none',
              scroll: -1
            })
            break;
          case 1:
            that.userInfos();
            console.log("推荐成功");
            wx.showToast({
              title: '推荐成功',
              icon: 'none',
              scroll: -1
            })
            break;
          case -1:
            console.log("参数为空");
            wx.showToast({
              title: '参数为空',
              icon: 'none',
              scroll: -1
            })
            break;
          case -2:
            console.log("已经成为代理");
            wx.showToast({
              title: '您已是代理',
              icon: 'none',
              scroll: -1
            })
            setTimeout(function () {
              that.userInfos();
            }, 1000)

            break;

          default:
            console.log("err");
            wx.showToast({
              title: 'err',
              icon: 'none',
              scroll: -1
            })
            break;
        }

      },
      fail() {
        console.log("推荐代理注册失败");

      }

    })
  },



})