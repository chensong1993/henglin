//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    text: '恒麟康养基地欢迎您！'
  },

  onLoad: function(e) {

    var that = this;
    console.log('444');
    that.setData({
      winHeight: app.globalData.winHeight,
      unionId: app.globalData.unionId
    })
    console.log(app.globalData.shareType);
    if (app.globalData.isShare) {
      wx.redirectTo({
        url: '../register/register?type=' + app.globalData.shareType + "&superUnionId=" + app.globalData.superUnionId,
      })
    }
    that.onBannerList();
    //console.log(app.globalData.isShare);
  },
  onShow(){
    //获取轮播图
    var that = this;
    that.onBannerList();
  },
  //获取轮播图
  onBannerList(e) {
    //获取轮播图
    var that = this;
    wx.request({
      url: app.globalData.hengUrl + "banner/selBanner.do",
      method: 'POST',
      data: {

      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值 
      },
      complete() {
        wx.stopPullDownRefresh();
      },
      success(res) {
        that.setData({
          bannerList: res.data.data
        })
        console.log(res.data.data);
      },
      fail() {

        wx.showToast({
          title: '轮播图加载失败',
          icon: 'none',
          scroll: -1
        })
      }

    })
  },
  onPullDownRefresh: function() {
    var that = this;
    that.onBannerList();
  },
  //轮播图点击
  bannerDetail(e) {
    var that = this;
    //  that.data.bannerIndex = e.target.setData.index;
    console.log(e.target.dataset.index);
    // wx.showToast({
    //   title: e.target.dataset.index+"",
    //   icon:"none"
    // })
  },
  //单人套票
  onCarDetail: function() {
    wx.navigateTo({
      url: '../yuyue_detail/yuyue_detail?type=' + 0,
    })

    //tab跳转
    // wx.switchTab({
    //   url: '../subscribe/subscribe',
    // })
    console.log("subscribe");
  },
  //双人套票
  onCarDetail1: function() {
    wx.navigateTo({
      url: '../yuyue_detail/yuyue_detail?type=' + 1,
    })

    //tab跳转
    // wx.switchTab({
    //   url: '../subscribe/subscribe',
    // })
    console.log("subscribe");
  },
  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }


})