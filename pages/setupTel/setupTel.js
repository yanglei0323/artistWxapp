// pages/setupTel/setupTel.js
const app = getApp();
const bsurl = require('../../utils/bsurl.js');
const imgpath = require('../../utils/imgpath.js');
const jm = require('../../utils/md5.js');
var interval = null //倒计时函数
Page({

  /**
   * 页面的初始数据
   */
  data: {
    btnText:'确定',
    sendCodeText:'获取验证码',
    sending:false,//是否正在发送验证码
    phoneNum:'',
    codeNum:'',
    currentTime:61,
    passWord:'',
    type:2 //type=1修改密码，type=2忘记密码
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if(app.globalData.userInfo){
      that.setData({
        phoneNum:app.globalData.userInfo.telephone,
        type:1
      });
    }
  },
  phoneInput:function (e){
      var that = this;
      that.setData({
        phoneNum: e.detail.value
      })
  },
  codeInput:function (e){
      var that = this;
      that.setData({
        codeNum: e.detail.value
      })
  },
  pWdInput:function (e){
      var that = this;
      that.setData({
        passWord: e.detail.value
      })
  },
  makecall: function (){
    wx.showActionSheet({
      itemList: ['010-85611588', '呼叫'],
      itemColor:'#333',
      success: function(res) {
        if(res.tapIndex == 1){
            wx.makePhoneCall({
              phoneNumber: '01085611588' 
            })
        }
      },
      fail: function(res) {
        // console.log(res.errMsg)
      }
    })
  },
  getCode: function (){//获取验证码
    var that = this;
    if(that.data.sending){
      return;
    }
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

    wx.showLoading({
      title: '提交中',
    });
    that.setData({
      sending: true
    });
    var currentTime = that.data.currentTime;
    interval = setInterval(function () {
      currentTime--;
      that.setData({
        sendCodeText: '重新发送('+currentTime+')秒'
      })
      if (currentTime <= 0) {
        clearInterval(interval);
        that.setData({
          sending: false  
        });
      }
    }, 1000);
    wx.request({
      url: bsurl + '/designer/sendforget.json',
      method: 'POST',
      header: {
          'content-type': 'application/x-www-form-urlencoded',
          'sessionid':app.globalData.sessionId
      },
      data:{
        telnum:that.data.phoneNum
      },
      success: function (res) {
          console.log(res);
          wx.hideLoading();
          if(res.data.code == 1){
              wx.showToast({
                title: '发送成功',
                icon: 'success',
                duration: 1500
              })
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
  updateTel: function (){//点击提交按钮
    // wx.navigateBack();
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
    if(!(/^\d{4,6}$/.test(that.data.codeNum))){
      wx.showModal({
        title: '温馨提示',
        content: '请输入正确格式的验证码',
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
      title: '发送中...',
    });
    wx.request({
      url: bsurl + '/designer/forget.json',
      method: 'POST',
      header: {
          'content-type': 'application/x-www-form-urlencoded',
          'sessionid':app.globalData.sessionId
      },
      data:{
        telnum:that.data.phoneNum,
        check:that.data.codeNum,
        password:jm.md5(that.data.passWord)
      },
      success: function (res) {
        wx.hideLoading();
        console.log(res);
        if(res.data.code == 1){//绑定成功
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 1500
          });
          wx.navigateBack();
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