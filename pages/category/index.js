// pages/category/index.js
import {request} from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime'
Page({
//页面绑定的是data 里面的数据
  data: {
    leftMenuList:[],
    rightContent:[],
    currentIndex:0,    // 被点击的左侧菜单
    scrollTop:-1// 右侧内容的滚动条
  },
  Cates:[],

  onLoad: function (options) {
    /*
      0 web 中的本地存储和小程序中的不一样
        web: localStorage.setItem('key','value') localStorage.getItem('key')
        wx: wx.setStorageSync('key', 'value') wx.getStorageSync('key')
        web : 存的时候要先tostring 再存入
        wx : 不需要类型转换
      1 先判断一下本地存储中有没有旧的数据
      2 没有旧的数据 直接发送新请求
      3 有旧的数据  先判断是否过期
    */
   const Cates = wx.getStorageSync('cates')
   if(!Cates){
    //  不存在
    this.getdata();
   }else{
    //  有旧的数据 定义过期时间
    if(Date.now()-Cates.time > 1000*10){ //1000ms*10 = 10s
      this.getdata()
    }else{
      this.Cates = Cates.data
      let leftMenuList = this.Cates.map(v=>v.cat_name);
      let rightContent = this.Cates[0].children;
      this.setData({
        rightContent,
        leftMenuList
      })
    }
   }
  },
  async getdata(){
    // 1 发送异步请求  优化方法可以用es6的 promise  现在没有用
    // wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/categories',
    //   success: (result) => {
    //     console.log(result);
    //     this.Cates = result.data.message;
    //     wx.setStorageSync('cates', {time:Date.now(),data:this.Cates});
    //     let leftMenuList = this.Cates.map(v=>v.cat_name);
    //     let rightContent = this.Cates[0].children;
    //     this.setData({
    //       rightContent,
    //       leftMenuList
    //     })
    //   }
    // })
    // request({url:"/categories"})
    // .then(result=>{
    //   console.log(result);
    //   this.Cates = result.data.message;
    //   let leftMenuList = this.Cates.map(v=>v.cat_name);
    //   let rightContent = this.Cates[0].children;
    //   this.setData({
    //     rightContent,
    //     leftMenuList
    //   })
    // })

    // 使用es7 的async await 来发送请求
    const res= await request({url:'/categories'});
    console.log(res);
    this.Cates = res.data.message;
    wx.setStorageSync("cates",{time:Date.now,data:this.Cates});
    let leftMenuList = this.Cates.map(v => v.cat_name);
    let rightContent = this.Cates[0].children;
    this.setData({
      leftMenuList,
      rightContent
    })
  },
  //左侧菜单点击事件
  handleItemTap(e){
    console.log(e);
    const {index} = e.currentTarget.dataset;
    let rightContent = this.Cates[index].children;
    let scrollTop = 0;
    this.setData({
      rightContent,
      currentIndex:index,
      scrollTop
    })
  }
})