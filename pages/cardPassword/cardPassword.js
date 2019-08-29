//index.js
//获取应用实例
const app = getApp()

Page({
  data: {

  },
  onLoad: function(e) {
    var that=this;
    that.setData({
        winHeight:app.globalData.winHeight
    })

  },
  onPassword(e) {
    var that = this;
    that.data.password = e.detail.value;
  },
  //聚焦清空
  focusPwd() {
    var that = this;
    that.data.password = undefined;
  },
  onConfirmpassword(e) {
    var that = this;
    that.data.confirmPassword = e.detail.value;
  },
  //聚焦清空
  focusConfirmPwd() {
    var that = this;
    that.data.confirmPassword = undefined;
  },
  //提交
  onSubmit() {
    var that = this;
    if (that.data.confirmPassword!=undefined ) {
      if (that.data.confirmPassword.length != 6){
      wx.showToast({
        title: '密码只能六位',
        icon: 'none'
      })
      return;
    }
    }else{
      wx.showToast({
        title: '密码不能为空',
        icon: 'none'
      })
      return;
    }
    // if (that.data.confirmPassword != that.data.password) {
    //   wx.showToast({
    //     title: '密码不一致',
    //     icon: 'none'
    //   })
    //   return;
    // }
    
    that.settingPwd(that.data.password, that.data.confirmPassword);
  

  },

  //设置密码
  settingPwd(oldPassword, password) {
    var that = this;
    wx.request({
      url: app.globalData.hengUrl + "userInfo/updPassword.do",
      method: 'POST',
      data: {
        unionId: app.globalData.unionId,
        oldPassword: oldPassword,
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
            console.log("提交失败");
            wx.showToast({
              title: '密码设置失败',
              icon: 'none'
            })
            break;
          case 1:
            wx.showToast({
              title: '提交成功',
              icon: 'none'
            })
            //tab跳转
            wx.switchTab({
              url: '../mine/mine',
            })
        
            console.log("密码设置成功");
            break;
          case -1:
            console.log("参数为空");
            wx.showToast({
              title: '密码不能为空',
              icon: 'none'
            })
            break;
          case -2:
            console.log("原密码不正确");
            wx.showToast({
              title: '原密码不正确',
              icon: 'none'
            })
            break;
          default:
            console.log("err");
            wx.showToast({
              title: '密码设置失败',
              icon: 'none'
            })
            break;
        }
      },
      fail() {
        wx.showToast({
          title: '密码设置失败',
          icon: 'none'
        })
        console.log("密码设置失败");

      }

    })
  },
})