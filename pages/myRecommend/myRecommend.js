
//我的推荐
const app = getApp()

Page({
  data: {
    id: 0,
    array: ['合伙人', '联合创始人', '总代'],
  },

  onLoad: function() {
    var that = this;
    that.setData({
      winHeight: app.globalData.winHeight
    })
    //查询推荐列表
    that.myRecommend();
  },

  //获取下标
  onIndex(e) {
    var that = this;
    var index = e.target.dataset.index;
    that.data.index = index;
    console.log(index);

    //在推荐列表中根据选择的下标获取unionId
    that.data.recommendedUnionId = that.data.recommendList[index].unionId;
    console.log(that.data.recommendedUnionId);

  },

  bindPickerChange: function(e) {
    var that = this;
    console.log('picker发送选择改变，携带值为', e.detail.value)
    that.setData({
      id: e.detail.value
    })

    //设置等级
    that.myLevel(that.data.recommendedUnionId, e.detail.value+1);


  },


  //查看我的推荐列表
  myRecommend() {
    var that = this;
    wx.request({
      url: app.globalData.hengUrl + "userInfo/selMyRecommend.do",
      method: 'POST',
      data: {
        unionId: app.globalData.unionId,
        pageNow:1
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值 
      },
      complete() {
        wx.stopPullDownRefresh();
      },
      success(res) {
        console.log(res.data)
        that.setData({
          recommendList: res.data.data
        })
        that.data.recommendList = res.data.data

        switch (res.data.msg) {
          case 0:
            console.log("暂无数据");
            break;
          case 1:
            //判断是否是加载更多
            that.data.moreOne = 1;
            //加载到第几页
            that.data.page = 1;
            console.log("请求成功");
            break;
          case -1:
            console.log("请求失败");
            break;

          default:
            console.log("查看推荐shibai");
            break;
        }

      },
      fail() {
        console.log("查看推荐失败");

      }

    })
  },
  //查看等级
  myLevel(recommendedUnionId, level) {
    var that = this;
    wx.request({
      url: app.globalData.hengUrl + "userInfo/updRecommendLevel.do",
      method: 'POST',
      data: {
        unionId: app.globalData.unionId,
        recommendedUnionId: recommendedUnionId,
        level: level
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值 
      },
      complete() {

      },
      success(res) {
        console.log("res.data.msg" + res.data.msg);
        switch (res.data.msg) {
          case 0:
            console.log("设置失败");
            wx.showToast({
              title: '设置失败',
              icon: 'none'
            })
            break;
          case 1:
            that.myRecommend();
            console.log("设置等级成功");
            break;
          case -1:
            console.log("参数为空");
            wx.showToast({
              title: '参数为空',
              icon: 'none'
            })
            break;
          case -2:
            console.log("该推荐人unionid不存在");
            break;
          case -3:
            wx.showToast({
              title: '不能设置比自己等级低的',
              icon:'none'
            })
            console.log("不能设置比自己等级低的");
            break;
          default:
            console.log("err");
            break;
        }
      },
      fail() {
        console.log("设置等级失败");

      }

    })
  },

  //加载更多
  onLoadMore(more) {
    var that = this;
    var recommendList = that.data.recommendList;

    that.data.hasMore = false;
    that.setData({
      LoadMores: 1
    })
    wx.request({
      url: app.globalData.hengUrl + "userInfo/selMyRecommend.do",
      method: 'POST',
      data: {
        unionId: app.globalData.unionId,
        pageNow: more
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值 
      },
      complete() {
        that.setData({
          LoadMores: -1
        })
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
          
            break;
          case 1:
            var cont = recommendList.concat(res.data.data);
            that.data.hasMore = true;
            console.log(cont);
            that.setData({
              recommendList: cont
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
        console.log("查看失败");

      }

    })
  },

  onPullDownRefresh() {
    var that = this;
    //查询推荐列表
    that.myRecommend();
  },
  onReachBottom: function () {
    var that = this;
    if (that.data.moreOne == 1) {
      that.onLoadMore(++that.data.page);

      console.log(that.data.moreOne);
    }
    that.data.moreOne++;
    console.log(that.data.page);
    if (that.data.hasMore) {
      that.onLoadMore(++that.data.page);
      console.log(that.data.page);
    }


  },
})