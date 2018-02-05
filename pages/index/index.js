// pages/index/index.js
const app = getApp();
const bsurl = require('../../utils/bsurl.js');
const imgpath = require('../../utils/imgpath.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qrcodeText:'',
    next:[],
    nextflag:0,
    serviceuser:[],
    serviceflag:0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.getHomeInfo();
    
  },
  getHomeInfo:function (){
    var that = this;
    wx.showLoading({
      title: '加载中'
    });
    wx.request({//获取首页信息
      url: bsurl + '/designer/home.json',
      method: 'POST',
      header: {
          'content-type': 'application/x-www-form-urlencoded',
          'sessionid':app.globalData.sessionId
      },
      success: function (res) {
        wx.hideLoading();
        if(res.data.code == 1){
            that.setData({
              nextflag:res.data.data.nextflag,
              next:res.data.data.next,
              serviceuser:res.data.data.serviceuser,
              serviceflag:res.data.data.serviceflag
            });
        }else{
          wx.redirectTo({
            url: '../login/login' 
          });
        }
        
      },
      fail:function (res){
        wx.hideLoading();
        wx.redirectTo({
          url: '../login/login' 
        });
      }
    });
  },
  qrcodeInput:function (e){
      var that = this;
      that.setData({
        qrcodeText: e.detail.value
      })
  },
  sendcode:function (){
    var that = this;
    wx.scanCode({
      success: (res) => {
        // console.log(res);
        that.setData({
          qrcodeText:res.result
        });
      }
    });
  },
  checktick:function(){
    var that = this;
    if(that.data.qrcodeText == ''){
      wx.showToast({
        title: '验票码为空',
        icon: 'success',
        duration: 1000
      });
      return;
    }
    wx.showLoading({
      title: '接单中'
    });
    wx.request({//获取首页信息
      url: bsurl + '/designer/checktick.json',
      method: 'POST',
      header: {
          'content-type': 'application/x-www-form-urlencoded',
          'sessionid':app.globalData.sessionId
      },
      data:{
        code:that.data.qrcodeText
      },
      success: function (res) {
        console.log(res);
        wx.hideLoading();
        if(res.data.code == 1){
            wx.showModal({
              title: '温馨提示',
              content: '接单成功！',
              showCancel:false,
              confirmColor:'#7f8ffc',
              success: function(res) {
              }
            })
            that.getHomeInfo();
            that.setData({
              qrcodeText:''
            });
        }else{
          wx.showModal({
            title: '温馨提示',
            content: res.data.reason,
            showCancel:false,
            confirmColor:'#7f8ffc',
            success: function(res) {
            }
          })
        }
        
      },
      fail:function (res){
        wx.hideLoading();
        wx.showModal({
          title: '温馨提示',
          content: '网络错误，请稍后重试',
          showCancel:false,
          confirmColor:'#7f8ffc',
          success: function(res) {
          }
        })
      }
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    setTimeout(function(){
        wx.stopPullDownRefresh();
    },1500)

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: 'YUE-吹发师',
      desc: '臻选您的美丽',
      path: 'pages/index/index',
      imageUrl: '',
    }
  }
})