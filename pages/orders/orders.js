// pages/orders/orders.js
const app = getApp();
const bsurl = require('../../utils/bsurl.js');
const imgpath = require('../../utils/imgpath.js');
'use strict';
let choose_year = null,
  choose_month = null;
Page({

  /**
   * 页面的初始数据 
   */
  data: {
    showTimeBox:false,
    selectflag:'',
    startime:'',
    endtime:'',
    hasEmptyGrid: false,
    showPicker: false,
    ordersList: [],
    page: 1,
    hasMore:true,
    zkid:0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    const date = new Date();
    const cur_year = date.getFullYear();
    const cur_month = date.getMonth() + 1;
    const weeks_ch = [ '周日', '周一', '周二', '周三', '周四', '周五', '周六' ];
    that.calculateEmptyGrids(cur_year, cur_month);
    that.calculateDays(cur_year, cur_month);
    that.setData({
      cur_year,
      cur_month,
      weeks_ch
    });
  },
  getcommentlist: function (){
    var that = this;
    if(that.data.startime =='' || that.data.endtime == ''){
        wx.showModal({
          title: '温馨提示',
          content: '请选择有效开始及结束时间',
          showCancel:false,
          confirmColor:'#7f8ffc',
          success: function(res) {
          }
        })
        return;
    }
    let startData = new Date(that.data.startime).getTime();
    let endData = new Date(that.data.endtime).getTime();
    let lefttime = endData - startData;
    if(lefttime <= -1){
      wx.showModal({
        title: '温馨提示',
        content: '截止时间不能小于开始时间！',
        showCancel:false,
        confirmColor:'#7f8ffc',
        success: function(res) {
        }
      })
      return;
    }
    that.setData({
      ordersList:[],
      page:1,
      hasMore:true
    });
    wx.showLoading({
      title: '加载中'
    });
    wx.request({//查询订单信息
      url: bsurl + '/designer//orderlist.json',
      method: 'POST',
      header: {
          'content-type': 'application/x-www-form-urlencoded',
          'sessionid':app.globalData.sessionId
      },
      data:{
        starttime:that.data.startime,
        endtime:that.data.endtime,
        page:that.data.page
      },
      success: function (res) {
        let evaList = that.data.ordersList;
        let orderlist = res.data.data.orderlist;
        console.log(orderlist); 
        if(orderlist.length >= 1){
          let page = that.data.page + 1;
          for(let item of orderlist){
            evaList.push(item);
          }
          that.setData({
            ordersList:evaList,
            page:page
          });
          wx.hideLoading();
        }else{
          wx.hideLoading();
          if(evaList.length == 0){
              that.setData({
                hasMore:true
              });
          }else{
            that.setData({
              hasMore:false
            });
          }
        }
        
      }
    });
  },
  getThisMonthDays: function(year, month) {
    return new Date(year, month, 0).getDate();
  },
  getFirstDayOfWeek: function(year, month) {
    return new Date(Date.UTC(year, month - 1, 1)).getDay();
  },
  calculateEmptyGrids: function(year, month) {
    var that =this;
    const firstDayOfWeek = that.getFirstDayOfWeek(year, month);
    let empytGrids = [];
    if (firstDayOfWeek > 0) {
      for (let i = 0; i < firstDayOfWeek; i++) {
        empytGrids.push(i);
      }
      that.setData({
        hasEmptyGrid: true,
        empytGrids
      });
    } else {
      that.setData({
        hasEmptyGrid: false,
        empytGrids: []
      });
    }
  },
  calculateDays: function(year, month) {
    let days = [];
    var that = this;
    const thisMonthDays = that.getThisMonthDays(year, month);

    for (let i = 1; i <= thisMonthDays; i++) {
      days.push({
        day: i,
        choosed: false
      });
    }

    that.setData({
      days
    });
  },
  handleCalendar: function(e) {
    var that = this;
    const handle = e.currentTarget.dataset.handle;
    const cur_year = that.data.cur_year;
    const cur_month = that.data.cur_month;
    if (handle === 'prev') {
      let newMonth = cur_month - 1;
      let newYear = cur_year;
      if (newMonth < 1) {
        newYear = cur_year - 1;
        newMonth = 12;
      }

      that.calculateDays(newYear, newMonth);
      that.calculateEmptyGrids(newYear, newMonth);

      that.setData({
        cur_year: newYear,
        cur_month: newMonth
      });

    } else {
      let newMonth = cur_month + 1;
      let newYear = cur_year;
      if (newMonth > 12) {
        newYear = cur_year + 1;
        newMonth = 1;
      }

      that.calculateDays(newYear, newMonth);
      that.calculateEmptyGrids(newYear, newMonth);

      that.setData({
        cur_year: newYear,
        cur_month: newMonth
      });
    }
  },
  tapDayItem: function(e) {
    var that = this;
    const idx = e.currentTarget.dataset.idx;
    const days = that.data.days;
    let year=that.data.cur_year;
    let month=that.data.cur_month;
    let selectflag = that.data.selectflag;
    for(let item of days){
      item.choosed = false;
    }
    days[ idx ].choosed = true;
    if(selectflag == 1){
      that.setData({
        startime:year+'-'+month+'-'+days[ idx ].day,
        showTimeBox:false,
        days,
      });
    }else if(selectflag == 2){
      that.setData({
        endtime:year+'-'+month+'-'+days[ idx ].day,
        showTimeBox:false,
        days,
      });

    }
    // console.log(that.data.startime);
  },
  chooseYearAndMonth: function() {
    var that = this;
    const cur_year = that.data.cur_year;
    const cur_month = that.data.cur_month;
    let picker_year = [],
      picker_month = [];
    for (let i = 1900; i <= 2100; i++) {
      picker_year.push(i);
    }
    for (let i = 1; i <= 12; i++) {
      picker_month.push(i);
    }
    const idx_year = picker_year.indexOf(cur_year);
    const idx_month = picker_month.indexOf(cur_month);
    that.setData({
      picker_value: [ idx_year, idx_month ],
      picker_year,
      picker_month,
      showPicker: true,
    });
  },
  pickerChange: function(e) {
    var that = this;
    const val = e.detail.value;
    choose_year = that.data.picker_year[val[0]];
    choose_month = that.data.picker_month[val[1]];
  },
  tapPickerBtn: function(e) {
    var that = this;
    const type = e.currentTarget.dataset.type;
    const o = {
      showPicker: false,
    };
    if (type === 'confirm') {
      o.cur_year = choose_year;
      o.cur_month = choose_month;
      that.calculateEmptyGrids(choose_year, choose_month);
      that.calculateDays(choose_year, choose_month);
    }
    
    that.setData(o);
  },
  showselectbox: function (e){
    var that = this;
    let index=e.target.dataset.index;
    that.setData({
      showTimeBox:!that.data.showTimeBox,
      selectflag:index,
    });
  },
  zkorder:function (e){
    var that = this;
    let id=e.target.dataset.id;
    if(that.data.zkid == id){
      that.setData({
        zkid:0
      });
    }else{
      that.setData({
        zkid:id
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
    var that = this;
    if(that.data.startime =='' || that.data.endtime == ''){
        wx.showModal({
          title: '温馨提示',
          content: '请选择有效开始及结束时间',
          showCancel:false,
          confirmColor:'#7f8ffc',
          success: function(res) {
          }
        })
        return;
    }
    let startData = new Date(that.data.startime).getTime();
    let endData = new Date(that.data.endtime).getTime();
    let lefttime = endData - startData;
    if(lefttime <= -1){
      wx.showModal({
        title: '温馨提示',
        content: '截止时间不能小于开始时间！',
        showCancel:false,
        confirmColor:'#7f8ffc',
        success: function(res) {
        }
      })
      return;
    }
    wx.showLoading({
      title: '加载中'
    });
    wx.request({//查询订单信息
      url: bsurl + '/designer//orderlist.json',
      method: 'POST',
      header: {
          'content-type': 'application/x-www-form-urlencoded',
          'sessionid':app.globalData.sessionId
      },
      data:{
        starttime:that.data.startime,
        endtime:that.data.endtime,
        page:that.data.page
      },
      success: function (res) {
        let evaList = that.data.ordersList;
        let orderlist = res.data.data.orderlist;
        console.log(orderlist);
        if(orderlist.length > 0){
          let page = that.data.page + 1;
          for(let item of orderlist){
            evaList.push(item);
          }
          that.setData({
            ordersList:evaList,
            page:page
          });
          wx.hideLoading();
        }else{
          wx.hideLoading();
          if(evaList.length == 0){
              that.setData({
                hasMore:true
              });
          }else{
            that.setData({
              hasMore:false
            });
          }
        }
        
      }
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  }
})