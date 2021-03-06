// pages/my/my.js
const app = getApp();
const bsurl = require('../../utils/bsurl.js');
const imgpath = require('../../utils/imgpath.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:[]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that =this;
    if(app.globalData.userInfo){
      let userInfo = app.globalData.userInfo;
      userInfo.avatar = imgpath + userInfo.avatar;
      that.setData({
        userInfo:userInfo
      });
    }
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
  },
  aboutUs:function(){
    wx.navigateTo({
      url: '/pages/aboutUs/aboutUs'
    })
  }

})