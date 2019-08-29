//获取应用实例
const app = getApp()

var currentTime = require("../../utils/util.js");

Page({
  data: {
    isPickerRender: false,
    isPickerShow: false,
    pickerConfig: {
      endDate: false,
      column: "minute",
      dateLimit: false,
    }
  },

  onLoad: function(e) {
    var that = this;
    that.setData({
      winHeight: app.globalData.winHeight,
    
    })



    //获取当前时间
    that.setData({
      initStartTime: currentTime.formatNumber
    })


  },
  onPullDownRefresh() {
    var that = this;
    that.myVipCard();
  },
  onShow(e) {
    var that = this;
    that.myVipCard();
  },
  //会员查询我的会员卡
  myVipCard() {
    var that = this;
    wx.request({
      url: app.globalData.hengUrl + "memberInfoCard/selMyMemberInfoCard.do",
      method: 'POST',
      data: {
        unionId: app.globalData.unionId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值 
      },
      complete() {
        wx.stopPullDownRefresh();
      },
      success(res) {
        
        that.setData({
          vipList: res.data.data
        })
        that.data.vipList = res.data.data;

        switch (res.data.msg) {
          case 0:
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

            console.log(res.data);
            console.log("查看会员成功");
            break;
          case -1:
            break;
        }

      },
      fail() {
        console.log("查看会员失败");

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
      url: app.globalData.hengUrl + "memberInfoCard/selMyMemberInfoCard.do",
      method: 'POST',
      data: {
        pageNow: more,
        unionId: app.globalData.unionId
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
            var cont = vipList.concat(res.data.data);
            that.data.hasMore = true;
            console.log(cont);
            that.setData({
              vipList: cont
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
  //修改预约时间
  myAppointmentTime(appointmentTime, id) {
    var that = this;
    wx.request({
      url: app.globalData.hengUrl + "memberInfoCard/updAppointmentTime.do",
      method: 'POST',
      data: {
        "appointmentTime": appointmentTime,
        "id": id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值 
      },
      complete() {

      },
      success(res) {
        switch(res.data.msg){
          case 0:
            wx.showToast({
              title: '修改失败',
              icon: 'none'
            })
          break;
          case 1:
            wx.showToast({
              title: '修改成功',
              icon: 'none'
            })
          break;
          case -1:
            wx.showToast({
              title: '参数为空',
              icon:'none'
            })
          break;
        }
        that.myVipCard();
        console.log(res.data.data);
        console.log("查看会员成功");
      },
      fail() {
        console.log("查看会员失败");

      }

    })
  },
  //获取时间
  setPickerTime: function(val) {
    console.log(val);
    var that = this;
    let data = val.detail;

    that.myAppointmentTime(data.startTime, that.data.id);

    // that.data.startTime = data.startTime
    // that.setData({
    //   startTime: data.startTime,
    // });

  },
  // 修改预约时间
  pickerShow: function(e) {
    var that = this;
    var index = e.target.dataset.index;

    that.data.id = that.data.vipList[index].id;
    console.log(that.data.id);
    this.setData({
      isPickerShow: true,
      isPickerRender: true,
      chartHide: true
    });
  },
  pickerHide: function() {
    this.setData({
      isPickerShow: false,
      chartHide: false
    });
  },

  bindPickerChange: function(e) {
    console.log("picker发送选择改变，携带值为", e.detail.value);
    console.log(this.data.sensorList);

    this.getData(this.data.sensorList[e.detail.value].id);
    this.setData({
      index: e.detail.value,
      sensorId: this.data.sensorList[e.detail.value].id
    });
  },


  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }

})