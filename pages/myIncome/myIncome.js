//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
   
    animationData: {},
  },

  onLoad: function() {
    var that = this;
    that.setData({
      winHeight: app.globalData.winHeight
    })
    that.myIncome();
   
  },
 
  

  //查看为的会员列表
  myIncome() {
    var that = this;
    console.log(app.globalData.unionId);
    wx.request({
      url: app.globalData.hengUrl + "referrerInfo/selReferrerInfo.do",
      method: 'POST',
      data: {
        pageNow: 1,
        referrerUnionId: app.globalData.unionId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值 
      },
      complete() {
        wx.stopPullDownRefresh();
      },
      success(res) {
       
        that.setData({
          incomeList: res.data.data
        })
        that.data.incomeList = res.data.data;
        
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
           
            console.log("查询成功");
            break;
          case -1:
            console.log("参数为空");
            wx.showToast({
              title: '参数为空',
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
          title: '查询失败',
          icon: 'none',
          scroll: -1
        })
        console.log("查询失败");

      }

    })
  },

  //加载更多
  onLoadMore(more) {
    var that = this;
    var incomeList = that.data.incomeList;

    that.data.hasMore = false;
    that.setData({
      LoadMores: 1
    })
    wx.request({
      url: app.globalData.hengUrl + "referrerInfo/selReferrerInfo.do",
      method: 'POST',
      data: {
        pageNow: more,
        referrerUnionId: app.globalData.unionId
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
            var cont = incomeList.concat(res.data.data);
            that.data.hasMore = true;
            console.log(cont);
            that.setData({
              incomeList: cont,
              LoadMores: -1,
            })
            console.log("查看成功");
            break;
          case -1:
            console.log("参数为空");
            wx.showToast({
              title: '参数为空',
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
          title: '查看失败',
          icon: 'none',
          scroll: -1
        })
        that.setData({
          LoadMores: -1,
        })
        console.log("查看失败");

      }

    })
  },

  onPullDownRefresh() {
    var that = this;
    that.myIncome();
  },
  onReachBottom: function () {
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