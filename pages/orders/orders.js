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
    showPicker: false
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
    console.log(that.data.startime);
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
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  }
})