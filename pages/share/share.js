//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
  
  },
 
  onLoad: function () {
    var that = this;
    that.setData({
      winHeight: app.globalData.winHeight,
      level: app.globalData.level
    })

  },
  /**
  * 用户点击右上角分享
  */
  onShareAppMessage: function (e) {
    if (e.from === 'button') {
      if(e.target.id==0){
        return {
          title: '分享给会员',
          imageUrl: '/image/banner.png',
          path: 'pages/register/register?superUnionId=' + app.globalData.unionId+"&type="+0 // 路径，传递参数到指定页面。
        }
      }
      if (e.target.id == 1) {
        return {
          title: '注册代理',
          imageUrl: '/image/banner.png',
          path: 'pages/register/register?superUnionId=' + app.globalData.unionId +"&type="+1 // 路径，传递参数到指定页面。
        }
      }

      if (e.target.id == 2) {
        return {
          title: '推荐代理',
          imageUrl: '/image/banner.png',
          path: 'pages/register/register?superUnionId=' + app.globalData.unionId + "&type="+2 // 路径，传递参数到指定页面。
        }
      }

    }else{
  
        return {
          title: '分享',
          imageUrl: '/image/banner.png',
          path: 'pages/register/register?registerId=' + app.globalData.unionId + "&type=1" // 路径，传递参数到指定页面。
        }
      
    }
   
  },

})
