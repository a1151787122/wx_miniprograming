import {request} from "../../request/index.js"
Page({
  data: {
    swiperList:[],
    cateList:[],
    floorList:[]
  },

  onLoad: function (options) {
    this.getswiperList(),
    this.getcateList(),
    this.getFloorList()
  },
  getswiperList(){
    // 1 发送异步请求 
    request({url:"/home/swiperdata"})
    .then(result=>{
      this.setData({
       swiperList:result.data.message
      })
    })
  },
  getcateList(){
    // 1 发送异步请求  优化方法可以用es6的 promise  现在没有用
    // wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/catitems',
    //   success: (result) => {
    //     this.setData({
    //       cateList:result.data.message
    //     })
    //   },
    //   fail: (res) => {},
    //   complete: (res) => {},
    // })
    request({url:"/home/catitems"})
    .then(result=>{
      this.setData({
       cateList:result.data.message
      })
    })
  },
  getFloorList(){
    // 1 发送异步请求 
    request({url:"/home/floordata"})
    .then(result=>{
      this.setData({
       floorList:result.data.message
      })
    })
  }
})