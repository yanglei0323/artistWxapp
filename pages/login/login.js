// pages/login/login.js
const app = getApp();
const bsurl = require('../../utils/bsurl.js');
const imgpath = require('../../utils/imgpath.js');
const jm = require('../../utils/md5.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoneNum:'',
    passWord:''
  },
  phoneInput:function (e){
      var that = this;
      that.setData({
        phoneNum: e.detail.value
      })
  },
  pWdInput:function (e){
      var that = this;
      that.setData({
        passWord: e.detail.value
      })
  },
  forgetPwd:function(){
      wx.navigateTo({
        url: '../setupTel/setupTel'
      })
  },
  confirm:function(){
      var that = this;
      if(!(/^1[34578]\d{9}$/.test(that.data.phoneNum))){
        wx.showModal({
          title: '温馨提示',
          content: '请输入正确格式的手机号码',
          showCancel:false,
          confirmColor:'#7f8ffc',
          success: function(res) {
          }
        })
        return;
      }
      if(!(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,18}$/.test(that.data.passWord))){
        wx.showModal({
          title: '温馨提示',
          content: '请输入6-18位数字+字母格式的密码',
          showCancel:false,
          confirmColor:'#7f8ffc',
          success: function(res) {
          }
        })
        return;
      }
      wx.showLoading({
        title: '登录中',
      });
      wx.request({
        url: bsurl + '/designer/login.json',
        method: 'POST',
        header: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        data:{
          account:that.data.phoneNum,
          password:jm.md5(that.data.passWord)
        },
        success: function (res) {
          wx.hideLoading();
          console.log(res);
          if(res.data.code == 1){//绑定成功
            wx.showToast({
              title: '登录成功',
              icon: 'success',
              duration: 1000
            });
            app.globalData.userInfo = res.data.data;
            wx.setStorageSync('desinerInfo',res.data.data);
            app.globalData.sessionId = res.data.data.logintoken;
            wx.setStorageSync('loginId',res.data.data.logintoken);
            wx.switchTab({
              url: '../index/index' 
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
        }
      });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
  }
})