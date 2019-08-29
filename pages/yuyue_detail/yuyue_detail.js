// pages/yuyue_detail/yuyue_detail.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mengceng: -1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(e) {
    var that = this;
  
    that.setData({
      winHeight: app.globalData.winHeight,
      type: e.type
    })

  },

  //取消蒙层
  onCancelMengceng(e) {
    var that=this;
    that.setData({
      mengceng:-1
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  onYuYue: function(e) {
    var that = this;
    that.setData({
      mengceng: 1
    })
    // wx.switchTab({
    //   url: '../subscribe/subscribe',
    // })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})