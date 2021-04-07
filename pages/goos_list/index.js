
import {request} from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
      id:0,
      value:"综合",
      isActive:true
       },
       {
        id:0,
        value:"销量",
        isActive:false
      },
      {
        id:0,
        value:"价格",
        isActive:false
      },
    ],
    goodsList:[]
  },
  // 接口需要的参数
  QueryParams:{
    querry:"",
    cid:"",
    pagenum:1,
    pagesize:10
  },
  totalPages:1,
  //  标题的点击事件   从子组件传递过来的
  handleTabsItemChange(e){
    const {index} = e.detail;
    let {tabs} = this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false)
    this.setData({
      tabs
    })
  },

  onLoad: function (options) {
    this.QueryParams.cid = options.cid;
    this.getGoodsList();
  },
  async getGoodsList(){
    const res = await request({url:"/goods/search",data:this.QueryParams}); // 为什么要传入queryparams?????????????????????
    console.log(res);
    const total = res.data.message.total;
    this.totalPages=Math.ceil(total/this.QueryParams.pagesize);
    console.log(this.totalPages);
    this.setData({
      goodsList:[...this.data.goodsList,...res.data.message.goods]//拼接的数组
    })
    // 关闭下拉刷新的效果  如果没有调用下拉刷新窗口直接关闭也不会出错
    wx-wx.stopPullDownRefresh();
  },
  onReachBottom(){
    if(this.QueryParams.pagenum>=this.totalPages){
      wx-wx.showToast({title: '所有商品已加载'})
    }else{
      // 还有下一页 1.当前页码++ 2.重新发送请求 3. 数据请求回来 要对data中的数字进行拼接
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }
  },
  onPullDownRefresh(){
    // 1. 重置数组
    this.setData({
      goodsList:[]
    })
    // 2. 重置页码
    this.QueryParams.pagenum=1;
    // 3. 发送请求
    this.getGoodsList();
  }
})