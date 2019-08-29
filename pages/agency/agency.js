//获取应用实例
const app = getApp()

Page({
  data: {
    id: 0,
    LoadMores: 0,
    hasMore: false,
  },

  onLoad: function() {
    var that = this;
    that.setData({
      winHeight: app.globalData.winHeight
    })
    //获取充值金额列表
    that.selAgent();
    //获取我的代理
    that.myAgent(1);
  },

  // 点击充值
  onFaCard(e) {
    var that = this;
    var index = e.target.dataset.index;
    console.log(index);

    that.data.unionId = that.data.agentList[index].unionId;
    // that.data.id = res.data.data[index].id;
    console.log(that.data.unionId);
  },

  //充值金额
  bindPickerChange: function(e) {
    var that = this;
    console.log('picker发送选择改变，携带值为', e.detail.value)
    that.setData({
      mengceng: 1
    })
    //获取充值的id
    that.data.id = that.data.selAgentList[e.detail.value].id;
    console.log(that.data.id + "id;");

  },
  //关闭蒙层
  onCancelMengceng(e) {
    var that = this;
    that.setData({
      mengceng: -1
    })
  },
  password(e) {
    var that = this;
    that.data.pwd = e.detail.value;
  },
  //密码是否正确
  onPassword(e) {
    var that = this;
    console.log(that.data.pwd);

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

    that.rechargeAgent(that.data.id, that.data.pwd, that.data.unionId);
    that.setData({
      mengceng: -1
    })

  },
  focusPwd() {
    var that = this;
    that.data.pwd = undefined;
  },
  //查看为的代理列表
  myAgent(pageNow) {
    var that = this;
    console.log(app.globalData.unionId + " " + pageNow);
    wx.request({
      url: app.globalData.hengUrl + "userInfo/selMyAgent.do",
      method: 'POST',
      data: {
        pageNow: pageNow,
        superUnionId: app.globalData.unionId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值 
      },
      complete() {
        wx.stopPullDownRefresh();
      },
      success(res) {

        that.setData({
          agentList: res.data.data
        })
        that.data.agentList = res.data.data;

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
            //判断是否是加载更多
            that.data.moreOne = 1;
            //加载到第几页
            that.data.page = 1;
            console.log("查看代理成功");
            break;
          case -1:
            wx.showToast({
              title: '查询失败',
              icon: 'none',
              scroll: -1
            })
            console.log("参数为空");
            break;

          default:
            console.log("err");
            wx.showToast({
              title: '查询失败',
              icon: 'none',
              scroll: -1
            })
            break;
        }
      },
      fail() {
        console.log("查看代理失败");
        wx.showToast({
          title: '查询失败',
          icon: 'none',
          scroll: -1
        })
      }

    })
  },
  //给下级代理充值接口
  rechargeAgent(agentId, password, unionId) {
    var that = this;
    wx.request({
      url: app.globalData.hengUrl + "userInfo/rechargeAgent.do",
      method: 'POST',
      data: {
        agentId: agentId,
        password: password,
        unionId: unionId,
        superUnionId: app.globalData.unionId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值 
      },
      complete() {

      },
      success(res) {
        switch (res.data.msg) {
          case 0:
            console.log("充值失败");
            wx.showToast({
              title: '充值失败',
              icon: 'none',
              scroll: -1
            })
            break;
          case 1:
            console.log(res.data);
            console.log("充值成功");
            wx.showToast({
              title: '充值成功',
              icon: 'none',
              scroll: -1
            })
            //获取我的代理
            that.myAgent(1);
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
            console.log("无代理关系");
            wx.showToast({
              title: '无关系',
              icon: 'none',
              scroll: -1
            })
            break;
          case -3:
            console.log("代理不能降级");
            wx.showToast({
              title: '不能降级',
              icon: 'none',
              scroll: -1
            })
            break;
          case -4:
            console.log("充值密码错误");
            wx.showToast({
              title: '充值密码错误',
              icon: 'none',
              scroll: -1
            })
            break;
          case -5:
            console.log("系统异常");
            wx.showToast({
              title: '系统异常',
              icon: 'none',
              scroll: -1
            })
            break;
          case -6:
            console.log("余额不足");
            wx.showToast({
              title: '余额不足',
              icon: 'none',
              scroll: -1
            })
            break;
          case -7:
            console.log("总代不能给下级充值");
            wx.showToast({
              title: '总代不能给下级充值',
              icon: 'none',
              scroll: -1
            })
            break;
          default:
            console.log("充值失败");
            wx.showToast({
              title: '充值失败',
              icon: 'none',
              scroll: -1
            })
            break;
        }

      },
      fail() {
        wx.showToast({
          title: '充值失败',
          icon: 'none',
          scroll: -1
        })
        console.log("充值失败");

      }

    })
  },

  //显示充值金额列表
  selAgent() {
    var that = this;
    wx.request({
      url: app.globalData.hengUrl + "agent/selAgent.do",
      method: 'POST',
      data: {

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
              title: '金额查询失败',
              icon: 'none',
              scroll: -1
            })
            break;
          case 1:
            //充值的金额
            var arry = [];
            var levelName;
            for (var j = 0; j < res.data.data.length; j++) {
              levelName = res.data.data[j].levelName + "       "
              arry.push(levelName + res.data.data[j].threshold);

            }
            that.setData({
              selAgentList: arry
            })
            console.log(arry);
            that.data.selAgentList = res.data.data;

            console.log(res.data.data);

            console.log("充值的金额");
            break;
          case -1:
            console.log("参数为空");
            wx.showToast({
              title: '金额查询失败',
              icon: 'none',
              scroll: -1
            })
            break;

          default:
            wx.showToast({
              title: '金额查询失败',
              icon: 'none',
              scroll: -1
            })
            console.log("err");
            break;
        }


      },
      fail() {
        wx.showToast({
          title: '金额查询失败',
          icon: 'none',
          scroll: -1
        })


      }

    })
  },
  //加载更多
  onLoadMore(more) {
    var that = this;
    var news = that.data.agentList;

    that.data.hasMore = false;
    that.setData({
      LoadMores: 1
    })

    wx.request({
      url: app.globalData.hengUrl + "userInfo/selMyAgent.do",
      method: 'POST',
      data: {
        pageNow: more,
        superUnionId: app.globalData.unionId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值 
      },
      complete() {

      },
      success(res) {


        switch (res.data.msg) {
          case 0:
            console.log("已加载全部数据");

            wx.showToast({
              title: '暂无数据',
              icon: 'none',
              scroll: -1
            })
            that.setData({
              LoadMores: -1,
            })

            break;
          case 1:
            var cont = news.concat(res.data.data);
            that.data.hasMore = true;
            console.log(cont);
            that.setData({
              agentList: cont,
              LoadMores: -1,
            })
            console.log("查看代理成功");
            break;
          case -1:
            wx.showToast({
              title: '查询失败',
              icon: 'none',
              scroll: -1
            })
            that.setData({
              LoadMores: -1,
            })
            console.log("参数为空");
            break;

          default:
            console.log("err");
            wx.showToast({
              title: '查询失败',
              icon: 'none',
              scroll: -1
            })
            that.setData({
              LoadMores: -1,
            })
            break;
        }
      },
      fail() {
        that.setData({
          LoadMores: -1,
        })
        console.log("查看代理失败");
        wx.showToast({
          title: '查询失败',
          icon: 'none',
          scroll: -1
        })
      }

    })
  },
  onPullDownRefresh() {
    var that = this;
    //获取充值金额列表
    that.selAgent();
    //获取我的代理
    that.myAgent(1);
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