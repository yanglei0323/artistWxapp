const bsurl = require('./utils/bsurl.js');
const imgpath = require('./utils/imgpath.js');
App({
  onLaunch: function (options) {
    var that = this;
    if(wx.getStorageSync('loginId')){
        that.globalData.userInfo = wx.getStorageSync('desinerInfo');
        that.globalData.sessionId = wx.getStorageSync('loginId');

    }else{
      that.login();
    }
  },
  login:function(){
    wx.redirectTo({
      url: './pages/login/login' 
    });
  },
  onShow: function () {
    // console.log('App Show')
  },
  onHide: function () {
    // console.log('App Hide')
  },
  globalData: {
    userInfo:null,    //用户信息
    sessionId:0      //登陆状态保持凭证
  }

})
