//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    mengceng: -1,
    pwd: null,
    animationData: {},
  },

  onLoad: function() {
    var that = this;
    that.setData({
      winHeight: app.globalData.winHeight
    })
    that.myVipList(1);
    that.myProductList();
  },

  // 点击发卡
  onFaCard(e) {
    var that = this;
    var index = e.target.dataset.index;
    console.log("index" + e.target.dataset.index);

    that.data.memberInfoUnionId = that.data.vipList[index].unionId;
    console.log("unionId:" + that.data.vipList[index].unionId);


  },

  //发卡名
  bindPickerChange: function(e) {
    var that = this;
    console.log('picker发送选择改变，携带值为', e.detail.value)
    that.setData({
      mengceng: 1
    })
    //获取productId
    that.data.productId = that.data.productList[e.detail.value].id;
    //获取发卡id
    // that.myProductList(e.detail.value);


  },


  //产品列表
  myProductList() {
    var that = this;
    console.log(app.globalData.level);
    wx.request({
      url: app.globalData.hengUrl + "product/selProduct.do",
      method: 'POST',
      data: {
        level: "1"
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
            break;
          case 1:

            //套票
            var arry = [];
            for (var j = 0; j < res.data.data.length; j++) {

              arry.push(res.data.data[j].productName);

            }

            console.log(arry);
            //获取产品列表
            that.setData({
              productList: arry
            })
            that.data.productList = res.data.data;
            console.log("产品列表ok");
            break;
          case -1:
            console.log("参数为空");
            break;

          default:
            console.log("err");
            break;
        }
      },
      fail() {
        console.log("产品列表err");

      }

    })
  },
  //关闭蒙层
  onCancelMengceng(e) {
    var that = this;
    that.setData({
      mengceng: -1
    })
  },
  //聚焦清除之前卡数
  focusNumber(e) {
    var that = this;
    that.data.num = undefined;
  },
  //聚焦清除之前密码
  focusPassword() {
    var that = this;
    that.data.pwd = undefined;
  },
  password(e) {
    var that = this;

    that.data.pwd = e.detail.value;
    console.log(e.detail.value);
  },
  number(e) {
    var that = this;
    that.data.num = e.detail.value;
  },
  //密码是否正确
  onPassword(e) {
    var that = this;
    console.log(that.data.pwd);

    if (that.data.num == undefined) {

      wx.showToast({
        title: '卡数不能为空',
        icon: 'none'
      })
      return;
    }

    if (that.data.pwd == undefined) {
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
  

    //发卡
    that.myFaCard(that.data.productId, that.data.num, that.data.pwd, that.data.memberInfoUnionId);
    

  },

  //查看为的会员列表
  myVipList(pageNow) {
    var that = this;
    wx.request({
      url: app.globalData.hengUrl + "userInfo/selMyMeberInfo.do",
      method: 'POST',
      data: {
        pageNow: pageNow,
        unionId: app.globalData.unionId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值 
      },
      complete() {
        wx:wx.stopPullDownRefresh();
      },
      success(res) {

        that.setData({
          vipList: res.data.data
        })
        that.data.vipList = res.data.data;

        switch (res.data.msg) {
          case 0:
            console.log("无会员列表");
            wx.showToast({
              title: '无会员列表',
              icon: 'none',
              scroll: -1
            })
            break;
          case 1:
            //判断是否是加载更多
            that.data.moreOne = 1;
            //加载到第几页
            that.data.page = 1;

            console.log("查看会员成功");
            break;
          case -1:
            console.log("会员参数为空");
            wx.showToast({
              title: '会员参数为空',
              icon: 'none',
              scroll: -1
            })
            break;

          default:
            console.log("err");
            break;
        }
      },
      fail() {
        wx.showToast({
          title: '查看会员失败',
          icon: 'none',
          scroll: -1
        })
        console.log("查看会员失败");

      }

    })
  },

  //代理给会员发卡
  myFaCard(productId, num, password, memberInfoUnionId) {
    var that = this;
    wx.request({
      url: app.globalData.hengUrl + "userInfo/sellMeberInfoCard.do",
      method: 'POST',
      data: {
        productId: productId,
        num: num,
        memberInfoUnionId: memberInfoUnionId,
        password: password,
        agentUnionId: app.globalData.unionId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值 
      },
      complete() {

      },
      success(res) {
        switch (res.data.msg) {
          case 1:
            console.log("发卡成功");
            that.myVipList(1);
            wx.showToast({
              title: '发卡成功',
              icon: 'none',
              scroll: -1
            })
            that.setData({
              mengceng: -1
            })
            break;
          case -1:
            console.log("参数为空");
            wx.showToast({
              title: '密码或发卡数不能为空',
              icon: 'none',
              scroll: -1
            })
            break;
          case -2:
            console.log("该会员不属于该代理的会员");
            wx.showToast({
              title: '该会员不属于该代理的会员',
              icon: 'none',
              scroll: -1
            })
            break;
          case -4:
            console.log("密码不正确");
            wx.showToast({
              title: '密码不正确',
              icon: 'none',
              scroll: -1
            })
            break;

          case -5:
            console.log("平台会员卡张数不足，请联系客服");
            wx.showToast({
              title: '平台会员卡张数不足，请联系客服',
              icon: 'none',
              scroll: -1
            })
            break;

          case -6:
            console.log("该产品id不存在");
            wx.showToast({
              title: '该产品不存在',
              icon: 'none',
              scroll: -1
            })
            break;
          case -7:
            console.log("您的余额不足");
            wx.showToast({
              title: '您的余额不足',
              icon: 'none',
              scroll: -1
            })
            break;
          default:
            wx.showToast({
              title: '发卡失败',
              icon: 'none',
              scroll: -1
            })
            console.log("err");
            break;
        }

      },
      fail() {
        wx.showToast({
          title: '发卡失败',
          icon: 'none',
          scroll: -1
        })
        console.log("发卡失败");

      }

    })
  },
  //加载更多
  onLoadMore(more) {
    var that = this;
    var vipList = that.data.vipList;

    that.data.hasMore = false;
    that.setData({
      LoadMores: 1
    })
    wx.request({
      url: app.globalData.hengUrl + "userInfo/selMyMeberInfo.do",
      method: 'POST',
      data: {
        pageNow: more,
        unionId: app.globalData.unionId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值 
      },
      complete() {

      },
      success(res) {

        switch (res.data.msg) {
          case 0:
            console.log("暂无更多数据");
            wx.showToast({
              title: '暂无更多数据',
              icon: 'none',
              scroll: -1
            })
            that.setData({
              LoadMores: -1
            })
            break;
          case 1:
            var cont = vipList.concat(res.data.data);
            that.data.hasMore = true;
            console.log(cont);
            that.setData({
              vipList: cont,
              LoadMores: -1,
            })
            console.log("查看会员成功");
            break;
          case -1:
            console.log("会员参数为空");
            wx.showToast({
              title: '会员参数为空',
              icon: 'none',
              scroll: -1
            })
            that.setData({
              LoadMores: -1
            })
            break;

          default:
            console.log("err");
            break;
        }
      },
      fail() {
        wx.showToast({
          title: '查看会员失败',
          icon: 'none',
          scroll: -1
        })
        that.setData({
          LoadMores: -1,
        })
        console.log("查看会员失败");

      }

    })
  },
  onPullDownRefresh(){
    var that = this;
    that.myVipList(1);
    that.myProductList();
  },
  onReachBottom: function() {
    var that = this;
    if (that.data.moreOne == 1) {
      that.onLoadMore(++that.data.page);

      console.log(that.data.moreOne);
    }
    that.data.moreOne++;
    console.log(that.data.moreOne);
    if (that.data.hasMore) {
      that.onLoadMore(++that.data.page);
      console.log(that.data.page);
    }


  },
})